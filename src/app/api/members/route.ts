import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { findFamilyBySurname } from "@/lib/queries";
import type { SubmitFamilyPayload } from "@/types";

export async function POST(req: NextRequest) {
  let body: SubmitFamilyPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { surname, address, members } = body;

  if (!surname?.trim() || !address?.trim()) {
    return NextResponse.json({ error: "surname and address are required" }, { status: 400 });
  }
  if (!Array.isArray(members) || members.length === 0) {
    return NextResponse.json({ error: "At least one member is required" }, { status: 400 });
  }
  for (const m of members) {
    if (!m.full_name?.trim() || !m.phone?.trim() || !m.role?.trim() || !m.member_type?.trim()) {
      return NextResponse.json(
        { error: "Each member requires full_name, phone, role, and member_type" },
        { status: 400 }
      );
    }
    if (m.member_type === "Other" && !m.custom_member_type?.trim()) {
      return NextResponse.json(
        { error: `Member "${m.full_name}" has type "Other" but no custom type provided` },
        { status: 400 }
      );
    }
  }

  const db = getDb();

  // ── Deduplication: find existing family by surname (case-insensitive) ──
  const existing = findFamilyBySurname(surname);
  let familyId: number;
  let isNewFamily: boolean;

  if (existing) {
    familyId = existing.id;
    isNewFamily = false;
  } else {
    db.exec("BEGIN");
    try {
      const { lastInsertRowid } = db
        .prepare("INSERT INTO families (surname, address) VALUES (?, ?)")
        .run(surname.trim(), address.trim());
      familyId = Number(lastInsertRowid);
      isNewFamily = true;
      db.exec("COMMIT");
    } catch {
      db.exec("ROLLBACK");
      return NextResponse.json({ error: "Failed to create family" }, { status: 500 });
    }
  }

  // ── Append members ──
  const insertMember = db.prepare(`
    INSERT INTO members (family_id, full_name, phone, role, email, member_type, custom_member_type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.exec("BEGIN");
  try {
    for (const m of members) {
      insertMember.run(
        familyId,
        m.full_name.trim(),
        m.phone.trim(),
        m.role.trim(),
        m.email?.trim() || null,
        m.member_type.trim(),
        m.member_type === "Other" ? (m.custom_member_type?.trim() ?? null) : null
      );
    }
    db.exec("COMMIT");
  } catch {
    db.exec("ROLLBACK");
    return NextResponse.json({ error: "Failed to add members" }, { status: 500 });
  }

  return NextResponse.json(
    { familyId, isNewFamily, membersAdded: members.length },
    { status: isNewFamily ? 201 : 200 }
  );
}
