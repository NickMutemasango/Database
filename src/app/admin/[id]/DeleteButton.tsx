"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  familyId: number;
  familyName: string;
}

export default function DeleteButton({ familyId, familyName }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "confirm" | "deleting">("idle");

  async function handleDelete() {
    setPhase("deleting");
    try {
      const res = await fetch(`/api/families/${familyId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.push("/admin");
      router.refresh();
    } catch {
      setPhase("idle");
    }
  }

  if (phase === "confirm") {
    return (
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <span className="text-sm text-gray-600 font-medium">
          Delete <span className="text-gray-900">{familyName} Family</span>?
        </span>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setPhase("idle")}
          className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (phase === "deleting") {
    return (
      <span className="text-sm text-gray-400 flex items-center gap-1.5">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Deleting…
      </span>
    );
  }

  return (
    <button
      onClick={() => setPhase("confirm")}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Delete Family
    </button>
  );
}
