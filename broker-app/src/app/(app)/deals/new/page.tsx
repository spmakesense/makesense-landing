import { Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { all } from "@/lib/db";
import { DealForm } from "./DealForm";

export default async function NewDeal() {
  const { office, user } = await requireCtx();
  const properties = all<{ id: string; address: string; price: number | null }>("SELECT id, address, price FROM properties WHERE office_id = ? AND status = 'active' ORDER BY created_at DESC", office.id);
  const clients = all<{ id: string; name: string }>("SELECT id, name FROM clients WHERE office_id = ? ORDER BY name", office.id);
  const agents = all<{ id: string; name: string | null }>("SELECT id, name FROM users WHERE office_id = ? ORDER BY name", office.id);
  return (
    <main className="page">
      <Header title="עסקה חדשה" back="/deals" />
      <DealForm properties={properties} clients={clients} agents={agents} me={user.id} feePct={office.default_fee_pct} />
    </main>
  );
}
