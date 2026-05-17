import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import type { Family, Member } from "@/types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const db = getDb();
  const family = db
    .prepare("SELECT * FROM families WHERE id = ?")
    .get(id) as unknown as Family | undefined;

  if (!family) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const members = db
    .prepare("SELECT * FROM members WHERE family_id = ? ORDER BY id")
    .all(id) as unknown as Member[];

  return NextResponse.json({ ...family, members, member_count: members.length });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const db = getDb();
  const { changes } = db.prepare("DELETE FROM families WHERE id = ?").run(id);

  if (changes === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
