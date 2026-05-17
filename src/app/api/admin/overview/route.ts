import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { getAllFamilies, getMemberTypeBreakdown } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();

  const { total_families } = db
    .prepare("SELECT COUNT(*) AS total_families FROM families")
    .get() as unknown as { total_families: number };

  const { total_members } = db
    .prepare("SELECT COUNT(*) AS total_members FROM members")
    .get() as unknown as { total_members: number };

  const membersByType = getMemberTypeBreakdown();
  const families = getAllFamilies();

  return NextResponse.json({
    summary: {
      totalFamilies: Number(total_families),
      totalMembers: Number(total_members),
      membersByType,
    },
    families,
  });
}
