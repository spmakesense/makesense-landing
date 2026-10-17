import { TabBar } from "@/components/TabBar";
import { requireCtx } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireCtx();
  return (
    <>
      {children}
      <TabBar />
    </>
  );
}
