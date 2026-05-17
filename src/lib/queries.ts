import getDb from "./db";
import type { Family, Member } from "@/types";

type RawRow = Record<string, unknown>;

function toMember(r: RawRow): Member {
  return {
    id: Number(r.id),
    family_id: Number(r.family_id),
    full_name: String(r.full_name),
    phone: String(r.phone),
    role: String(r.role),
    email: r.email != null ? String(r.email) : null,
    member_type: String(r.member_type ?? "Regular Attender"),
    custom_member_type: r.custom_member_type != null ? String(r.custom_member_type) : null,
  };
}

function toFamily(r: RawRow, members: Member[]): Family {
  return {
    id: Number(r.id),
    surname: String(r.surname),
    address: String(r.address),
    created_at: String(r.created_at),
    members,
    member_count: members.length,
  };
}

function membersForFamily(familyId: number): Member[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM members WHERE family_id = ? ORDER BY id")
    .all(familyId) as unknown as RawRow[];
  return rows.map(toMember);
}

export function getAllFamilies(): Family[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM families ORDER BY created_at DESC")
    .all() as unknown as RawRow[];
  return rows.map((f) => toFamily(f, membersForFamily(Number(f.id))));
}

export function getFamilyById(id: number): Family | null {
  const db = getDb();
  const f = db
    .prepare("SELECT * FROM families WHERE id = ?")
    .get(id) as unknown as RawRow | undefined;
  if (!f) return null;
  return toFamily(f, membersForFamily(id));
}

export function findFamilyBySurname(surname: string): Family | null {
  const db = getDb();
  const f = db
    .prepare("SELECT * FROM families WHERE LOWER(surname) = LOWER(?)")
    .get(surname.trim()) as unknown as RawRow | undefined;
  if (!f) return null;
  return toFamily(f, membersForFamily(Number(f.id)));
}

export function getMemberTypeBreakdown(): Record<string, number> {
  const db = getDb();
  const rows = db.prepare(`
    SELECT
      CASE
        WHEN member_type = 'Other' AND custom_member_type IS NOT NULL AND custom_member_type != ''
          THEN custom_member_type
        ELSE member_type
      END AS label,
      COUNT(*) AS cnt
    FROM members
    GROUP BY label
    ORDER BY cnt DESC
  `).all() as unknown as { label: string; cnt: number }[];

  return Object.fromEntries(rows.map((r) => [r.label, Number(r.cnt)]));
}
