import { requireCtx } from "@/lib/auth";
import { all } from "@/lib/db";
import type { Client, Property } from "@/lib/types";
import { Wizard, type WizardProperty } from "./Wizard";

export default async function NewDocument({ searchParams }: { searchParams: Promise<{ t?: string; property?: string; client?: string }> }) {
  const { office } = await requireCtx();
  const sp = await searchParams;
  const properties: WizardProperty[] = (await all<Property>("SELECT * FROM properties WHERE office_id = ? AND status = 'active' ORDER BY created_at DESC", office.id)).map((p) => ({
    id: p.id,
    address: p.address,
    city: p.city,
    parcel: p.parcel,
    kind: p.kind,
    rooms: p.rooms,
    sqm: p.sqm,
    floor: p.floor,
    price: p.price,
    deal_type: p.deal_type,
    exclusive_to: p.exclusive_to,
    owner_client_id: p.owner_client_id,
    interest: p.interest ? JSON.parse(p.interest) : null,
    disclosure: p.disclosure ? JSON.parse(p.disclosure) : null,
  }));
  const clients = await all<Pick<Client, "id" | "name" | "phone" | "kind">>("SELECT id, name, phone, kind FROM clients WHERE office_id = ? ORDER BY name", office.id);
  return (
    <Wizard
      properties={properties}
      clients={clients}
      feePct={office.default_fee_pct}
      feeIncludesVat={Boolean(office.fee_includes_vat)}
      initial={{ template: sp.t ?? null, propertyId: sp.property ?? null, clientId: sp.client ?? null }}
    />
  );
}
