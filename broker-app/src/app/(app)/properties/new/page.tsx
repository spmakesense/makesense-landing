import { Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { all } from "@/lib/db";
import { PropertyForm } from "../PropertyForm";

export default async function NewProperty({ searchParams }: { searchParams: Promise<{ back?: string; owner?: string }> }) {
  const { office } = await requireCtx();
  const { back } = await searchParams;
  const owners = all<{ id: string; name: string }>("SELECT id, name FROM clients WHERE office_id = ? AND kind IN ('seller','landlord') ORDER BY name", office.id);
  return (
    <main className="page">
      <Header title="נכס חדש" back={back ?? "/properties"} />
      <PropertyForm owners={owners} back={back} />
    </main>
  );
}
