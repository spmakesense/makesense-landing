import { Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";
import { driveConfigured } from "@/lib/gdrive";
import { DEMO_MODE } from "@/lib/sms";
import { DriveCard } from "./DriveCard";
import { SettingsForm } from "./SettingsForm";

const DRIVE_MSG: Record<string, { cls: string; text: string }> = {
  connected: { cls: "okmsg", text: "Google Drive חובר. הסכמים חתומים יישמרו בו אוטומטית." },
  denied: { cls: "err", text: "החיבור ל-Google Drive בוטל." },
  failed: { cls: "err", text: "החיבור ל-Google Drive נכשל. נסו שוב." },
  not_configured: { cls: "err", text: "חיבור Google Drive עוד לא הוגדר בשרת (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET). ראו README." },
};

export default async function Settings({ searchParams }: { searchParams: Promise<{ drive?: string }> }) {
  const { user, office } = await requireCtx();
  const { drive } = await searchParams;
  const msg = drive ? DRIVE_MSG[drive] : undefined;
  return (
    <main className="page">
      <Header title="הגדרות" back="/more" />
      {DEMO_MODE ? <div className="demo">מצב הדגמה: לא הוגדר ספק SMS (SMS_WEBHOOK_URL). קודים והודעות מוצגים על המסך ונרשמים ביומן השרת.</div> : null}
      {msg ? <div className={msg.cls}>{msg.text}</div> : null}
      <DriveCard configured={driveConfigured()} email={user.google_email} auto={Boolean(user.drive_auto)} />
      <SettingsForm
        isManager={user.role === "manager"}
        user={{ name: user.name ?? "", license: user.license ?? "", email: user.email ?? "", phone: user.phone, signature: user.signature }}
        office={{ name: office.name, company_id: office.company_id ?? "", address: office.address ?? "", fee: office.default_fee_pct, vat: Boolean(office.fee_includes_vat), auto: Boolean(office.auto_send_copy) }}
      />
    </main>
  );
}
