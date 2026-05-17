"use client";

import { useState } from "react";
import Link from "next/link";
import type { Family } from "@/types";

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

interface Props {
  families: Family[];
  totalFamilies: number;
  totalMembers: number;
  membersByType: Record<string, number>;
}

export default function AdminDashboard({ families, totalFamilies, totalMembers, membersByType }: Props) {
  const [search, setSearch] = useState("");

  const filtered = families.filter(
    (f) =>
      f.surname.toLowerCase().includes(search.toLowerCase()) ||
      f.address.toLowerCase().includes(search.toLowerCase())
  );

  const avgSize = totalFamilies > 0 ? (totalMembers / totalFamilies).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-gray-900 truncate">Church Admin</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Member Management System</p>
            </div>
          </div>
          <Link
            href="/register"
            className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Family
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-5">

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Total Families" value={totalFamilies} color="text-indigo-600" bg="bg-indigo-50"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <StatCard label="Total Members" value={totalMembers} color="text-violet-600" bg="bg-violet-50"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <StatCard label="Avg. Family Size" value={avgSize} color="text-sky-600" bg="bg-sky-50" className="hidden sm:block"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
        </div>

        {/* ── Member Type Breakdown ── */}
        {Object.keys(membersByType).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Members by Type</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(membersByType).map(([type, count]) => (
                <div
                  key={type}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${TYPE_COLORS[type] ?? "bg-gray-100 text-gray-600"}`}
                >
                  <span>{type}</span>
                  <span className="bg-white bg-opacity-60 rounded-full px-1.5 py-0.5 font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Family Table ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by family name or address…"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>
            {search && <span className="text-xs text-gray-400">{filtered.length} of {families.length}</span>}
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Family</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Address</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Registered</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Members</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center">
                      <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-400 text-sm">{search ? "No families match your search." : "No families registered yet."}</p>
                      {!search && <Link href="/register" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">Register the first family →</Link>}
                    </td>
                  </tr>
                ) : (
                  filtered.map((family) => (
                    <tr key={family.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                            {family.surname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{family.surname} Family</p>
                            <p className="text-xs text-gray-400 md:hidden mt-0.5 truncate max-w-[180px]">{family.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 hidden md:table-cell max-w-xs">
                        <p className="truncate">{family.address}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400 hidden sm:table-cell whitespace-nowrap">
                        {new Date(family.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                          {family.members.length}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/admin/${family.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
              Showing {filtered.length} {filtered.length === 1 ? "family" : "families"}{search && ` matching "${search}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg, className = "" }: {
  label: string; value: string | number; icon: React.ReactNode;
  color: string; bg: string; className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 ${className}`}>
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className={`text-2xl font-bold ${color} leading-none mt-0.5`}>{value}</p>
      </div>
    </div>
  );
}
