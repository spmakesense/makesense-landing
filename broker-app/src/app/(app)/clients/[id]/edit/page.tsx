import { notFound } from "next/navigation";
import { Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { get } from "@/lib/db";
import type { Client } from "@/lib/types";
import { ClientForm } from "../../ClientForm";

export default async function EditClient({ params }: { params: Promise<{ id: string }> }) {
  const { office } = await requireCtx();
  const { id } = await params;
  const c = await get<Client>("SELECT * FROM clients WHERE id = ? AND office_id = ?", id, office.id);
  if (!c) notFound();
  return (
    <main className="page">
      <Header title="עריכת לקוח" back={`/clients/${id}`} />
      <ClientForm c={c} />
    </main>
  );
}
