import { Header } from "@/components/ui";
import { ClientForm } from "../ClientForm";

export default async function NewClient({ searchParams }: { searchParams: Promise<{ back?: string }> }) {
  const { back } = await searchParams;
  return (
    <main className="page">
      <Header title="לקוח חדש" back={back ?? "/clients"} />
      <ClientForm back={back} />
    </main>
  );
}
