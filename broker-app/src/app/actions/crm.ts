"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCtx } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { normalizePhone } from "@/lib/format";
import { newId, now } from "@/lib/ids";
import { INTEREST_TYPES } from "@/lib/templates";
import type { Client, Property } from "@/lib/types";
import { optNum, optStr, str } from "./util";

export type FormState = { error?: string } | undefined;

// ---------- clients ----------

function clientFields(fd: FormData) {
  const phoneRaw = str(fd, "phone");
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  return { phoneRaw, phone, name: str(fd, "name") };
}

export async function saveClient(_: FormState, fd: FormData): Promise<FormState> {
  const { office, user } = await requireCtx();
  const id = str(fd, "id");
  const { phoneRaw, phone, name } = clientFields(fd);
  if (!name) return { error: "נא למלא שם" };
  if (phoneRaw && !phone) return { error: "מספר טלפון לא תקין" };
  const values = [name, phone, optStr(fd, "email"), optStr(fd, "id_number"), optStr(fd, "address"), str(fd, "kind") || "buyer", str(fd, "temperature") || "warm", optStr(fd, "source"), optStr(fd, "wants"), optStr(fd, "notes")];
  if (id) {
    if (!await get("SELECT id FROM clients WHERE id = ? AND office_id = ?", id, office.id)) return { error: "לקוח לא נמצא" };
    await run("UPDATE clients SET name=?, phone=?, email=?, id_number=?, address=?, kind=?, temperature=?, source=?, wants=?, notes=? WHERE id = ?", ...values, id);
    revalidatePath(`/clients/${id}`);
    redirect(`/clients/${id}`);
  }
  const newClientId = newId();
  await run(
    "INSERT INTO clients (name, phone, email, id_number, address, kind, temperature, source, wants, notes, id, office_id, owner_id, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ...values,
    newClientId,
    office.id,
    user.id,
    now(),
  );
  const back = str(fd, "back");
  redirect(back ? `${back}${back.includes("?") ? "&" : "?"}client=${newClientId}` : `/clients/${newClientId}`);
}

export async function addTask(fd: FormData) {
  const { office, user } = await requireCtx();
  const title = str(fd, "title");
  if (!title) return;
  await run(
    "INSERT INTO tasks (id, office_id, user_id, client_id, property_id, title, due, created_at) VALUES (?,?,?,?,?,?,?,?)",
    newId(),
    office.id,
    user.id,
    optStr(fd, "client_id"),
    optStr(fd, "property_id"),
    title,
    optStr(fd, "due"),
    now(),
  );
  revalidatePath("/", "layout");
}

export async function toggleTask(id: string) {
  const { office } = await requireCtx();
  await run("UPDATE tasks SET done = 1 - done WHERE id = ? AND office_id = ?", id, office.id);
  revalidatePath("/", "layout");
}

// ---------- properties ----------

export async function saveProperty(_: FormState, fd: FormData): Promise<FormState> {
  const { office, user } = await requireCtx();
  const id = str(fd, "id");
  const address = str(fd, "address");
  if (!address) return { error: "נא למלא כתובת" };
  const owner = optStr(fd, "owner_client_id");
  if (owner && !await get<Client>("SELECT id FROM clients WHERE id = ? AND office_id = ?", owner, office.id)) return { error: "בעל הנכס לא נמצא" };
  const values = [
    address,
    optStr(fd, "city"),
    optStr(fd, "parcel"),
    str(fd, "kind") || "דירה",
    str(fd, "deal_type") === "rent" ? "rent" : "sale",
    optNum(fd, "rooms"),
    optNum(fd, "sqm"),
    optStr(fd, "floor"),
    optNum(fd, "price"),
    owner,
    str(fd, "status") || "active",
  ];
  if (id) {
    if (!await get("SELECT id FROM properties WHERE id = ? AND office_id = ?", id, office.id)) return { error: "נכס לא נמצא" };
    await run("UPDATE properties SET address=?, city=?, parcel=?, kind=?, deal_type=?, rooms=?, sqm=?, floor=?, price=?, owner_client_id=?, status=? WHERE id = ?", ...values, id);
    revalidatePath(`/properties/${id}`);
    redirect(`/properties/${id}`);
  }
  const pid = newId();
  await run(
    "INSERT INTO properties (address, city, parcel, kind, deal_type, rooms, sqm, floor, price, owner_client_id, status, id, office_id, agent_id, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ...values,
    pid,
    office.id,
    user.id,
    now(),
  );
  const back = str(fd, "back");
  redirect(back ? `${back}${back.includes("?") ? "&" : "?"}property=${pid}` : `/properties/${pid}`);
}

async function ownedProperty(id: string) {
  const { office } = await requireCtx();
  const p = await get<Property>("SELECT * FROM properties WHERE id = ? AND office_id = ?", id, office.id);
  if (!p) throw new Error("not found");
  return p;
}

export async function setInterest(_: FormState, fd: FormData): Promise<FormState> {
  const p = await ownedProperty(str(fd, "property_id"));
  const type = str(fd, "type");
  if (!INTEREST_TYPES.some((t) => t.value === type)) return { error: "נא לבחור סוג קשר" };
  const relation = str(fd, "relation");
  if (!relation) return { error: "נא לתאר את הקשר (למשל: המוכר הוא אחי)" };
  await run("UPDATE properties SET interest = ? WHERE id = ?", JSON.stringify({ type, relation, details: str(fd, "details") }), p.id);
  revalidatePath(`/properties/${p.id}`);
  return {};
}

export async function clearInterest(propertyId: string) {
  const p = await ownedProperty(propertyId);
  await run("UPDATE properties SET interest = NULL WHERE id = ?", p.id);
  revalidatePath(`/properties/${p.id}`);
}

export async function toggleMarketing(propertyId: string, key: string) {
  const p = await ownedProperty(propertyId);
  const m = JSON.parse(p.marketing || "{}") as Record<string, boolean>;
  m[key] = !m[key];
  await run("UPDATE properties SET marketing = ? WHERE id = ?", JSON.stringify(m), p.id);
  revalidatePath(`/properties/${p.id}`);
}

// ---------- deals ----------

export async function saveDeal(_: FormState, fd: FormData): Promise<FormState> {
  const { office, user } = await requireCtx();
  const title = str(fd, "title");
  if (!title) return { error: "נא לתת שם לעסקה" };
  const price = optNum(fd, "price");
  let commission = optNum(fd, "commission");
  const pct = optNum(fd, "pct");
  if (commission === null && price !== null && pct !== null) commission = Math.round((price * pct) / 100);
  await run(
    "INSERT INTO deals (id, office_id, agent_id, property_id, client_id, title, stage, price, commission, due_date, notes, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    newId(),
    office.id,
    str(fd, "agent_id") || user.id,
    optStr(fd, "property_id"),
    optStr(fd, "client_id"),
    title,
    str(fd, "stage") || "lead",
    price,
    commission,
    optStr(fd, "due_date"),
    optStr(fd, "notes"),
    now(),
  );
  revalidatePath("/deals");
  redirect("/deals");
}

export async function setDealStage(id: string, stage: string) {
  const { office } = await requireCtx();
  await run("UPDATE deals SET stage = ?, paid_at = CASE WHEN ? = 'paid' THEN ? ELSE NULL END WHERE id = ? AND office_id = ?", stage, stage, now(), id, office.id);
  revalidatePath("/deals");
  revalidatePath("/");
}

export async function deleteDeal(id: string) {
  const { office } = await requireCtx();
  await run("DELETE FROM deals WHERE id = ? AND office_id = ?", id, office.id);
  revalidatePath("/deals");
}

// ---------- team & settings ----------

export async function inviteAgent(_: FormState, fd: FormData): Promise<FormState> {
  const { office, user } = await requireCtx();
  if (user.role !== "manager") return { error: "רק מנהל משרד יכול להוסיף סוכנים" };
  const phone = normalizePhone(str(fd, "phone"));
  if (!phone) return { error: "מספר טלפון לא תקין" };
  const existing = await get<{ id: string; office_id: string | null }>("SELECT id, office_id FROM users WHERE phone = ?", phone);
  if (existing?.office_id) return { error: "המספר כבר רשום במשרד" };
  if (existing) await run("UPDATE users SET office_id = ?, role = 'agent', name = COALESCE(name, ?) WHERE id = ?", office.id, optStr(fd, "name"), existing.id);
  else await run("INSERT INTO users (id, office_id, role, name, phone, created_at) VALUES (?, ?, 'agent', ?, ?, ?)", newId(), office.id, optStr(fd, "name"), phone, now());
  revalidatePath("/team");
  return {};
}

export async function setRole(userId: string, role: "manager" | "agent") {
  const { office, user } = await requireCtx();
  if (user.role !== "manager" || userId === user.id) return;
  await run("UPDATE users SET role = ? WHERE id = ? AND office_id = ?", role, userId, office.id);
  revalidatePath("/team");
}

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  const { office, user } = await requireCtx();
  const name = str(fd, "name");
  const license = str(fd, "license");
  if (!name || !/^\d{3,10}$/.test(license)) return { error: "נא למלא שם ומספר רישיון תקין" };
  await run("UPDATE users SET name = ?, license = ?, email = ? WHERE id = ?", name, license, optStr(fd, "email"), user.id);
  const sig = str(fd, "signature");
  if (sig.startsWith("data:image/png")) await run("UPDATE users SET signature = ? WHERE id = ?", sig, user.id);
  if (user.role === "manager") {
    const fee = optNum(fd, "default_fee_pct");
    await run(
      "UPDATE offices SET name = ?, company_id = ?, address = ?, default_fee_pct = ?, fee_includes_vat = ?, auto_send_copy = ? WHERE id = ?",
      str(fd, "office_name") || office.name,
      optStr(fd, "company_id"),
      optStr(fd, "office_address"),
      fee ?? office.default_fee_pct,
      fd.get("fee_includes_vat") ? 1 : 0,
      fd.get("auto_send_copy") ? 1 : 0,
      office.id,
    );
  }
  revalidatePath("/", "layout");
  return {};
}
