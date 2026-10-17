import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Header, STATUS_CHIP } from "@/components/ui";
import { requestMeta, requireCtx } from "@/lib/auth";
import { loadDoc } from "@/lib/documents";
import { dateTimeHe, timeHe } from "@/lib/format";
import { getTemplate, interestLabel } from "@/lib/templates";
import { CancelButton, DriveStatus, ShareSheetButton, SignerActions } from "./DocActions";

const ACTION_LABEL: Record<string, string> = {
  created: "המסמך נוצר",
  sent_sms: "נשלח ב-SMS",
  reminder_sms: "תזכורת ב-SMS",
  shared_whatsapp: "נשלח ב-WhatsApp",
  viewed: "נפתח",
  otp_sent: "נשלח קוד אימות",
  annex_signed: "חתם/ה על נספח הגילוי",
  signed: "חתם/ה",
  completed: "נחתם על ידי כולם – PDF נחתם ונשמר",
  copy_sent: "נשלח העתק חתום",
  copy_whatsapp: "נשלח העתק ב-WhatsApp",
  copy_email: "נשלח העתק במייל",
  copy_link: "הועתק קישור להעתק",
  pdf_saved: "PDF נשמר במכשיר",
  pdf_shared: "PDF שותף",
  copy_downloaded: "הלקוח הוריד את ההעתק",
  drive_saved: "נשמר ב-Google Drive",
  drive_failed: "השמירה ל-Google Drive נכשלה",
  cancelled: "המסמך בוטל",
};

export default async function DocPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> }) {
  const { office, user } = await requireCtx();
  const { id } = await params;
  const sp = await searchParams;
  const f = loadDoc(id);
  if (!f || f.doc.office_id !== office.id) notFound();
  const t = getTemplate(f.doc.template)!;
  const { origin } = await requestMeta();
  const signed = f.doc.status === "signed";
  const signedCount = f.signers.filter((s) => s.status === "signed").length;
  const sharePayload = {
    docId: f.doc.id,
    title: f.doc.title,
    office: f.office.name,
    link: `${origin}/d/${f.doc.share_token}`,
    signers: f.signers.map((s) => ({ id: s.id, name: s.name, phone: s.phone, email: s.email })),
    driveConnected: Boolean(user.google_refresh),
    driveLink: f.doc.drive_link,
  };

  return (
    <main className="page">
      <Header title="סטטוס מסמך" back="/documents" />

      {signed ? (
        <div className="center" style={{ margin: "6px 0 18px" }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#dcfce7", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 0 0 10px #f0fdf4" }}>
            <Icon name="check" size="lg" />
          </div>
          <h2 style={{ fontSize: 24 }}>{f.signers.length > 1 ? "נחתם על ידי כולם" : "המסמך נחתם"}</h2>
          <div className="s">{f.doc.title}</div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="row between">
            <div className="grow">
              <div className="s">{t.title}</div>
              <div className="t">{f.doc.title.split(" · ")[1] ?? f.doc.title}</div>
            </div>
            <span className={`chip ${STATUS_CHIP[f.doc.status].cls}`}>{STATUS_CHIP[f.doc.status].label}</span>
          </div>
          {f.doc.status !== "cancelled" ? (
            <>
              <div className="bar" style={{ marginTop: 12 }}>
                <i style={{ width: `${(signedCount / f.signers.length) * 100}%` }} />
              </div>
              <div className="xs" style={{ marginTop: 6 }}>
                {signedCount} מתוך {f.signers.length} חתמו
              </div>
            </>
          ) : null}
        </div>
      )}

      {sp.new && !signed ? <div className="okmsg">המסמך מוכן. בחרו לכל חותם: החתמה במקום על הטלפון שלך, או שליחה אליו.</div> : null}
      {f.annex ? (
        <div className="card warn row top" style={{ marginBottom: 12, fontSize: 13, color: "#92400e" }}>
          <Icon name="shield" style={{ color: "var(--amber)" }} />
          <div>
            <b>כולל נספח גילוי נאות</b> – {interestLabel(f.annex.type)} · {f.annex.relation}
          </div>
        </div>
      ) : null}

      <div className="card">
        {f.signers.map((s, i) => (
          <div key={s.id} className="row top" style={{ gap: 12, paddingBottom: i < f.signers.length - 1 ? 12 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch" }}>
              <span className="dot" style={{ width: 12, height: 12, marginTop: 5, background: s.status === "signed" ? "var(--green)" : s.status === "viewed" ? "var(--amber)" : "#c9d0e2" }} />
              {i < f.signers.length - 1 ? <span style={{ width: 2, flex: 1, background: "var(--line)", marginTop: 4 }} /> : null}
            </div>
            <div className="grow">
              <div className="row between">
                <div className="t">{s.name}</div>
                <span className={`chip ${STATUS_CHIP[s.status].cls}`}>
                  {s.status === "signed" ? `נחתם ${timeHe(s.signed_at)}` : s.status === "viewed" ? `נצפה ${timeHe(s.viewed_at)}` : "לא נפתח"}
                </span>
              </div>
              <div className="s">
                {s.status === "signed" ? `אומת ב-SMS${s.geo ? " · כולל מיקום" : ""}` : s.annex_signed_at ? "חתם/ה על הנספח" : ""}
              </div>
              {s.status !== "signed" && f.doc.status !== "cancelled" ? (
                <SignerActions
                  docId={f.doc.id}
                  signer={{ id: s.id, name: s.name, phone: s.phone }}
                  link={`${origin}/s/${s.token}`}
                  inPersonHref={`/s/${s.token}?inperson=1&back=${f.doc.id}`}
                  message={`שלום ${s.name}, ${f.agent.name} מ${f.office.name} שלח/ה לך מסמך לחתימה: "${f.doc.title}".\nלחתימה מהטלפון: ${origin}/s/${s.token}`}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {signed ? (
        <>
          <div className="grid2" style={{ marginTop: 14 }}>
            <a className="btn bo" href={`/api/documents/${f.doc.id}/pdf?download=1`}>
              <Icon name="dl" />
              שמירת PDF
            </a>
            <ShareSheetButton payload={sharePayload} />
          </div>
          {f.office.auto_send_copy ? (
            <div className="row xs" style={{ justifyContent: "center", gap: 6, marginTop: 10, color: "var(--green)" }}>
              <Icon name="check" size="sm" />
              העתק חתום נשלח אוטומטית לכל החותמים
            </div>
          ) : null}
          <DriveStatus docId={f.doc.id} link={f.doc.drive_link} connected={Boolean(user.google_refresh)} />
          <Link href={`/api/documents/${f.doc.id}/pdf`} target="_blank" className="btn bo sm" style={{ marginTop: 10 }}>
            <Icon name="eye" size="sm" />
            צפייה במסמך החתום
          </Link>
        </>
      ) : null}

      <div className="sec">
        <h3>תיעוד ראייתי</h3>
      </div>
      <div className="card timeline" style={{ fontSize: 13.5 }}>
        {f.audit.map((a) => {
          const meta = a.meta ? JSON.parse(a.meta) : {};
          return (
            <div key={a.id} className="row between">
              <span>
                <b>{a.actor}</b> · {ACTION_LABEL[a.action] ?? a.action}
                {meta.to && a.actor !== meta.to ? ` ← ${meta.to}` : ""}
              </span>
              <span className="xs" style={{ whiteSpace: "nowrap" }}>
                {dateTimeHe(a.at)}
              </span>
            </div>
          );
        })}
        {f.doc.pdf_sha256 ? (
          <div className="row between">
            <span className="s">טביעת PDF</span>
            <span style={{ direction: "ltr", fontFamily: "monospace", fontSize: 12 }}>
              {f.doc.pdf_sha256.slice(0, 6)}…{f.doc.pdf_sha256.slice(-6)}
            </span>
          </div>
        ) : null}
      </div>

      {!signed && f.doc.status !== "cancelled" ? <CancelButton docId={f.doc.id} /> : null}
    </main>
  );
}
