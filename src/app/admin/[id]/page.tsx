import { getFamilyById } from "@/lib/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

const TYPE_COLORS: Record<string, string> = {
  "Sunday School": "bg-yellow-100 text-yellow-700",
  Secretary: "bg-blue-100 text-blue-700",
  Youth: "bg-violet-100 text-violet-700",
  Elder: "bg-amber-100 text-amber-700",
  "Regular Attender": "bg-green-100 text-green-700",
  Other: "bg-gray-100 text-gray-600",
};

const ROLE_COLORS: Record<string, string> = {
  Father: "bg-blue-100 text-blue-700",
  Mother: "bg-pink-100 text-pink-700",
  Son: "bg-cyan-100 text-cyan-700",
  Daughter: "bg-purple-100 text-purple-700",
  Grandfather: "bg-amber-100 text-amber-700",
  Grandmother: "bg-orange-100 text-orange-700",
  Guardian: "bg-teal-100 text-teal-700",
  Dependent: "bg-lime-100 text-lime-700",
  Other: "bg-gray-100 text-gray-600",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FamilyDetailPage({ params }: Props) {
  const { id: rawId } = await params;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) notFound();

  const family = getFamilyById(id);
  if (!family) notFound();

  const typeBreakdown = family.members.reduce<Record<string, number>>((acc, m) => {
    const label = m.member_type === "Other" && m.custom_member_type
      ? m.custom_member_type
      : m.member_type;
    return { ...acc, [label]: (acc[label] ?? 0) + 1 };
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <DeleteButton familyId={family.id} familyName={family.surname} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Family header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md shadow-indigo-100">
                {family.surname.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{family.surname} Family</h1>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-500">{family.address}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Registered {new Date(family.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="text-center bg-indigo-50 rounded-2xl px-5 py-4 flex-shrink-0">
              <p className="text-3xl font-bold text-indigo-600">{family.members.length}</p>
              <p className="text-xs text-indigo-500 font-medium mt-0.5">{family.members.length === 1 ? "Member" : "Members"}</p>
            </div>
          </div>
        </div>

        {/* Members list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Family Members</h2>
            <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1 font-medium">{family.members.length} total</span>
          </div>

          {family.members.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">No members listed for this family.</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {family.members.map((member) => {
                const displayType = member.member_type === "Other" && member.custom_member_type
                  ? member.custom_member_type
                  : member.member_type;

                return (
                  <li key={member.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm mt-0.5">
                        {initials(member.full_name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900 text-sm">{member.full_name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[member.role] ?? "bg-gray-100 text-gray-600"}`}>
                            {member.role}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <a href={`tel:${member.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {member.phone}
                          </a>
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {member.email}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Member type badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${TYPE_COLORS[member.member_type] ?? "bg-gray-100 text-gray-600"}`}>
                        {displayType}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Type breakdown */}
        {Object.keys(typeBreakdown).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Member Type Breakdown</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeBreakdown).map(([type, count]) => (
                <span key={type} className={`px-3 py-1 rounded-full text-xs font-semibold ${TYPE_COLORS[type] ?? "bg-gray-100 text-gray-600"}`}>
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
