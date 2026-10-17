import { Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/sms";
import { SettingsForm } from "./SettingsForm";

export default async function Settings() {
  const { user, office } = await requireCtx();
  return (
    <main className="page">
      <Header title="הגדרות" back="/more" />
      {DEMO_MODE ? <div className="demo">מצב הדגמה: לא הוגדר ספק SMS (SMS_WEBHOOK_URL). קודים והודעות מוצגים על המסך ונרשמים ביומן השרת.</div> : null}
      <SettingsForm
        isManager={user.role === "manager"}
        user={{ name: user.name ?? "", license: user.license ?? "", email: user.email ?? "", phone: user.phone, signature: user.signature }}
        office={{ name: office.name, company_id: office.company_id ?? "", address: office.address ?? "", fee: office.default_fee_pct, vat: Boolean(office.fee_includes_vat), auto: Boolean(office.auto_send_copy) }}
      />
    </main>
  );
}
