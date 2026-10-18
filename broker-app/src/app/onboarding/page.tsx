import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { get } from "@/lib/db";
import type { Office } from "@/lib/types";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const office = user.office_id ? await get<Office>("SELECT * FROM offices WHERE id = ?", user.office_id) : undefined;
  return (
    <main className="page plain">
      <header className="hdr">
        <h1 className="start">ברוכים הבאים</h1>
      </header>
      <p className="s" style={{ marginBottom: 16 }}>
        עוד רגע מתחילים. הפרטים האלה יופיעו אוטומטית בכל מסמך שתחתימו, כפי שהחוק דורש.
      </p>
      <OnboardingForm name={user.name ?? ""} license={user.license ?? ""} email={user.email ?? ""} officeName={office?.name} />
    </main>
  );
}
