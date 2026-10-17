export type Role = "manager" | "agent";

export interface Office {
  id: string;
  name: string;
  company_id: string | null;
  address: string | null;
  phone: string | null;
  default_fee_pct: number;
  fee_includes_vat: number;
  auto_send_copy: number;
  created_at: number;
}

export interface User {
  id: string;
  office_id: string | null;
  role: Role;
  name: string | null;
  phone: string;
  email: string | null;
  license: string | null;
  signature: string | null;
  created_at: number;
}

export type ClientKind = "buyer" | "seller" | "tenant" | "landlord";

export interface Client {
  id: string;
  office_id: string;
  owner_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  id_number: string | null;
  address: string | null;
  kind: ClientKind;
  temperature: "hot" | "warm" | "cold";
  source: string | null;
  wants: string | null;
  notes: string | null;
  created_at: number;
}

export interface PersonalInterest {
  type: string;
  relation: string;
  details: string;
}

export interface Property {
  id: string;
  office_id: string;
  agent_id: string | null;
  address: string;
  city: string | null;
  parcel: string | null;
  kind: string;
  deal_type: "sale" | "rent";
  rooms: number | null;
  sqm: number | null;
  floor: string | null;
  price: number | null;
  owner_client_id: string | null;
  exclusive_from: string | null;
  exclusive_to: string | null;
  marketing: string;
  interest: string | null;
  disclosure: string | null;
  status: "active" | "sold" | "rented" | "off";
  created_at: number;
}

export type DocStatus = "sent" | "partial" | "signed" | "cancelled";

export interface Doc {
  id: string;
  office_id: string;
  agent_id: string;
  template: string;
  title: string;
  property_id: string | null;
  data: string;
  annex: string | null;
  status: DocStatus;
  agent_signature: string | null;
  pdf_sha256: string | null;
  share_token: string | null;
  share_expires: number | null;
  created_at: number;
  completed_at: number | null;
  cancelled_at: number | null;
}

export interface Signer {
  id: string;
  document_id: string;
  client_id: string | null;
  position: number;
  name: string;
  phone: string | null;
  email: string | null;
  token: string;
  status: "pending" | "viewed" | "signed";
  values_json: string;
  signature: string | null;
  annex_signature: string | null;
  annex_signed_at: number | null;
  viewed_at: number | null;
  signed_at: number | null;
  otp_verified_at: number | null;
  ip: string | null;
  user_agent: string | null;
  geo: string | null;
}

export interface AuditRow {
  id: number;
  document_id: string;
  actor: string;
  action: string;
  meta: string | null;
  at: number;
}

export const DEAL_STAGES = [
  { key: "lead", label: "ליד" },
  { key: "showing", label: "סיור" },
  { key: "negotiation", label: "מו״מ" },
  { key: "memo", label: "זכ״ד" },
  { key: "contract", label: "חוזה" },
  { key: "paid", label: "שולם" },
] as const;
export type DealStage = (typeof DEAL_STAGES)[number]["key"];

export interface Deal {
  id: string;
  office_id: string;
  agent_id: string;
  property_id: string | null;
  client_id: string | null;
  title: string;
  stage: DealStage;
  price: number | null;
  commission: number | null;
  due_date: string | null;
  paid_at: number | null;
  notes: string | null;
  created_at: number;
}

export interface Task {
  id: string;
  office_id: string;
  user_id: string;
  client_id: string | null;
  property_id: string | null;
  title: string;
  due: string | null;
  done: number;
  created_at: number;
}
