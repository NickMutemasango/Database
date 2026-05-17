import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import type { SubmitFamilyPayload } from "@/types";

interface RawFamily {
  id: number;
  surname: string;
  address: string;
  created_at: string;
}

export async function GET() {
  const db = getDb();

  const families = db
    .prepare("SELECT * FROM families ORDER BY created_at DESC")
    .all() as unknown as RawFamily[];

  const result = families.map((f) => {
    const members = db
      .prepare("SELECT * FROM members WHERE family_id = ? ORDER BY id")
      .all(f.id);
    return { ...f, members, member_count: members.length };
  });

  return NextResponse.json(result);
}

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
    if (!m.full_name?.trim() || !m.phone?.trim() || !m.role?.trim()) {
      return NextResponse.json(
        { error: "Each member must have full_name, phone, and role" },
        { status: 400 }
      );
    }
  }

  const db = getDb();

  let newId: number;
  db.exec("BEGIN");
  try {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO families (surname, address) VALUES (?, ?)")
      .run(surname.trim(), address.trim());

    const insertMember = db.prepare(
      "INSERT INTO members (family_id, full_name, phone, role) VALUES (?, ?, ?, ?)"
    );
    for (const m of members) {
      insertMember.run(lastInsertRowid, m.full_name.trim(), m.phone.trim(), m.role.trim());
    }

    db.exec("COMMIT");
    newId = Number(lastInsertRowid);
  } catch {
    db.exec("ROLLBACK");
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ id: newId }, { status: 201 });
}
