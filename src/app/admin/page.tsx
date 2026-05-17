import { getAllFamilies, getMemberTypeBreakdown } from "@/lib/queries";
import getDb from "@/lib/db";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const db = getDb();

  const { total_families } = db
    .prepare("SELECT COUNT(*) AS total_families FROM families")
    .get() as unknown as { total_families: number };

  const { total_members } = db
    .prepare("SELECT COUNT(*) AS total_members FROM members")
    .get() as unknown as { total_members: number };

  const families = getAllFamilies();
  const membersByType = getMemberTypeBreakdown();

  return (
    <AdminDashboard
      families={families}
      totalFamilies={Number(total_families)}
      totalMembers={Number(total_members)}
      membersByType={membersByType}
    />
  );
}
