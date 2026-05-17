"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { MEMBER_TYPES, FAMILY_ROLES } from "@/types";

const PHONE_RE = /^[+]?[(]?[0-9]{2,4}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,6}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface MemberRow {
  uid: string;
  full_name: string;
  phone: string;
  email: string;
  role: string;
  member_type: string;
  custom_member_type: string;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function blankMember(role = "Other"): MemberRow {
  return {
    uid: uid(),
    full_name: "",
    phone: "",
    email: "",
    role,
    member_type: "Regular Attender",
    custom_member_type: "",
  };
}

type FieldErrors = Record<string, string>;

/* ────────────────────────────────────────────────────────── */

export default function RegisterPage() {
  const formId = useId();
  const [surname, setSurname] = useState("");
  const [address, setAddress] = useState("");
  const [members, setMembers] = useState<MemberRow[]>([blankMember("Father")]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ familyId: number; isNewFamily: boolean; membersAdded: number } | null>(null);

  /* ── member helpers ── */
  const addMember = () => setMembers((p) => [...p, blankMember()]);
  const removeMember = (uid: string) => setMembers((p) => p.filter((m) => m.uid !== uid));
  const updateMember = (uid: string, key: keyof Omit<MemberRow, "uid">, val: string) =>
    setMembers((p) => p.map((m) => (m.uid === uid ? { ...m, [key]: val } : m)));

  /* ── validation ── */
  function validate(): boolean {
    const e: FieldErrors = {};
    if (!surname.trim()) e.surname = "Family surname is required.";
    if (!address.trim()) e.address = "Physical address is required.";

    members.forEach((m) => {
      if (!m.full_name.trim()) e[`${m.uid}_name`] = "Full name is required.";

      if (!m.phone.trim()) {
        e[`${m.uid}_phone`] = "Phone number is required.";
      } else if (!PHONE_RE.test(m.phone.trim())) {
        e[`${m.uid}_phone`] = "Enter a valid phone number.";
      }

      if (m.email.trim() && !EMAIL_RE.test(m.email.trim())) {
        e[`${m.uid}_email`] = "Enter a valid email address.";
      }

      if (m.member_type === "Other" && !m.custom_member_type.trim()) {
        e[`${m.uid}_custom`] = "Please specify the member type.";
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: surname.trim(),
          address: address.trim(),
          members: members.map(({ full_name, phone, email, role, member_type, custom_member_type }) => ({
            full_name: full_name.trim(),
            phone: phone.trim(),
            email: email.trim() || undefined,
            role,
            member_type,
            custom_member_type: member_type === "Other" ? custom_member_type.trim() : undefined,
          })),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(d.error ?? "Server error");
      }
      setResult(await res.json());
    } catch (err) {
      setErrors({ _submit: (err as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setSurname(""); setAddress("");
    setMembers([blankMember("Father")]);
    setErrors({}); setResult(null);
  }

  /* ── success screen ── */
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {result.isNewFamily ? "Registration Successful!" : "Members Added!"}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {result.isNewFamily
              ? <>The <span className="font-semibold text-gray-700">{surname} Family</span> has been registered.</>
              : <>{result.membersAdded} member{result.membersAdded !== 1 ? "s" : ""} added to the existing <span className="font-semibold text-gray-700">{surname} Family</span> record.</>
            }
          </p>
          <div className="mt-7 space-y-3">
            <button onClick={resetForm} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
              Submit Another
            </button>
            <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── main form ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm mb-5 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Family Registration</h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            Already registered? Adding members will be linked to your existing family record.
          </p>
        </div>

        <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* ── Section 1: Family Info ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHeader n={1} label="Family Information" />
            <div className="space-y-4 mt-5">
              <Field label="Family Surname" required error={errors.surname}>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="e.g. Johnson"
                  className={inputCls(!!errors.surname)}
                />
              </Field>
              <Field label="Physical Address" required error={errors.address}>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 12 Oak Street, Johannesburg, 2001"
                  rows={2}
                  className={`${inputCls(!!errors.address)} resize-none`}
                />
              </Field>
            </div>
          </section>

          {/* ── Section 2: Members ── */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <SectionHeader n={2} label="Family Members" />
              <span className="text-xs text-gray-400 font-medium">
                {members.length} {members.length === 1 ? "member" : "members"}
              </span>
            </div>

            <div className="space-y-4 mt-5">
              {members.map((member, index) => (
                <MemberCard
                  key={member.uid}
                  member={member}
                  index={index}
                  errors={errors}
                  canRemove={members.length > 1}
                  onRemove={() => removeMember(member.uid)}
                  onChange={(key, val) => updateMember(member.uid, key, val)}
                />
              ))}

              <button
                type="button"
                onClick={addMember}
                className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-600 text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-400 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Member
              </button>
            </div>
          </section>

          {errors._submit && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors._submit}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : "Submit Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function SectionHeader({ n, label }: { n: number; label: string }) {
  return (
    <h2 className="flex items-center gap-2.5 text-base font-semibold text-gray-800">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
        {n}
      </span>
      {label}
    </h2>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function MemberCard({
  member, index, errors, canRemove, onRemove, onChange,
}: {
  member: MemberRow;
  index: number;
  errors: FieldErrors;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (key: keyof Omit<MemberRow, "uid">, val: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Member {index + 1}
        </span>
        {canRemove && (
          <button type="button" onClick={onRemove} className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="Remove">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Full name — full width */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={member.full_name}
            onChange={(e) => onChange("full_name", e.target.value)}
            placeholder="Full legal name"
            className={inputSmCls(!!errors[`${member.uid}_name`])}
          />
          {errors[`${member.uid}_name`] && <p className="mt-1 text-xs text-red-600">{errors[`${member.uid}_name`]}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={member.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+27 82 123 4567"
            className={inputSmCls(!!errors[`${member.uid}_phone`])}
          />
          {errors[`${member.uid}_phone`] && <p className="mt-1 text-xs text-red-600">{errors[`${member.uid}_phone`]}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            type="email"
            value={member.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="member@example.com"
            className={inputSmCls(!!errors[`${member.uid}_email`])}
          />
          {errors[`${member.uid}_email`] && <p className="mt-1 text-xs text-red-600">{errors[`${member.uid}_email`]}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Role in Family <span className="text-red-500">*</span></label>
          <select
            value={member.role}
            onChange={(e) => onChange("role", e.target.value)}
            className={inputSmCls(false)}
          >
            {FAMILY_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Member Type */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Member Type <span className="text-red-500">*</span></label>
          <select
            value={member.member_type}
            onChange={(e) => onChange("member_type", e.target.value)}
            className={inputSmCls(false)}
          >
            {MEMBER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Custom member type — conditional */}
        {member.member_type === "Other" && (
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Specify Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={member.custom_member_type}
              onChange={(e) => onChange("custom_member_type", e.target.value)}
              placeholder="e.g. Worship Team, Deacon, Usher…"
              className={inputSmCls(!!errors[`${member.uid}_custom`])}
              autoFocus
            />
            {errors[`${member.uid}_custom`] && <p className="mt-1 text-xs text-red-600">{errors[`${member.uid}_custom`]}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full px-4 py-2.5 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
  }`;
}

function inputSmCls(hasError: boolean) {
  return `w-full px-3 py-2 rounded-lg border text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
  }`;
}
