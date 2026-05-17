export const MEMBER_TYPES = [
  "Sunday School",
  "Secretary",
  "Youth",
  "Elder",
  "Regular Attender",
  "Other",
] as const;

export type MemberTypeEnum = (typeof MEMBER_TYPES)[number];

export const FAMILY_ROLES = [
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Grandfather",
  "Grandmother",
  "Guardian",
  "Dependent",
  "Other",
] as const;

export interface Member {
  id: number;
  family_id: number;
  full_name: string;
  phone: string;
  role: string;
  email: string | null;
  member_type: string;
  custom_member_type: string | null;
}

export interface Family {
  id: number;
  surname: string;
  address: string;
  created_at: string;
  members: Member[];
  member_count: number;
}

export interface NewMemberInput {
  full_name: string;
  phone: string;
  role: string;
  email?: string;
  member_type: string;
  custom_member_type?: string;
}

export interface SubmitFamilyPayload {
  surname: string;
  address: string;
  members: NewMemberInput[];
}

export interface AdminOverview {
  summary: {
    totalFamilies: number;
    totalMembers: number;
    membersByType: Record<string, number>;
  };
  families: Family[];
}
