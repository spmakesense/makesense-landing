import { notFound } from "next/navigation";
import { Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { all, get } from "@/lib/db";
import type { Property } from "@/lib/types";
import { PropertyForm } from "../../PropertyForm";

export default async function EditProperty({ params }: { params: Promise<{ id: string }> }) {
  const { office } = await requireCtx();
  const { id } = await params;
  const p = get<Property>("SELECT * FROM properties WHERE id = ? AND office_id = ?", id, office.id);
  if (!p) notFound();
  const owners = all<{ id: string; name: string }>("SELECT id, name FROM clients WHERE office_id = ? AND (kind IN ('seller','landlord') OR id = ?) ORDER BY name", office.id, p.owner_client_id);
  return (
    <main className="page">
      <Header title="עריכת נכס" back={`/properties/${id}`} />
      <PropertyForm p={p} owners={owners} />
    </main>
  );
}
