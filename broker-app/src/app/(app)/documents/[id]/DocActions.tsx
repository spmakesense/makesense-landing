"use client";

import { useState, useTransition } from "react";
import { cancelDocument, logShare, sendCopySms, sendSigningSms } from "@/app/actions/documents";
import { Icon } from "@/components/Icon";
import { intlPhone, normalizePhone } from "@/lib/format";

const waUrl = (phone: string | null, text: string) => `https://wa.me/${phone ? intlPhone(phone) : ""}?text=${encodeURIComponent(text)}`;

export function SignerActions(p: { docId: string; signer: { id: string; name: string; phone: string | null }; link: string; inPersonHref: string; message: string }) {
  const [msg, setMsg] = useState<string>();
  const [pending, start] = useTransition();
  const sms = () =>
    start(async () => {
      const r = await sendSigningSms(p.docId, p.signer.id);
      setMsg(r.error ?? (r.demo ? "מצב הדגמה: ה-SMS נרשם ביומן השרת" : "נשלח ב-SMS"));
    });
  const copy = async () => {
    await navigator.clipboard?.writeText(p.link);
    setMsg("הקישור הועתק");
  };
  return (
    <div style={{ marginTop: 8 }}>
      <div className="grid2">
        <a className="btn bp sm" href={p.inPersonHref}>
          <Icon name="phone2" size="sm" />
          החתמה במקום
        </a>
        <a className="btn wa sm" href={waUrl(p.signer.phone, p.message)} target="_blank" rel="noreferrer" onClick={() => logShare(p.docId, "shared_whatsapp", p.signer.name)}>
          <Icon name="msg" size="sm" />
          WhatsApp
        </a>
      </div>
      <div className="row" style={{ marginTop: 6, gap: 14 }}>
        <button className="link" onClick={sms} disabled={pending}>
          {pending ? "שולח…" : "שליחה / תזכורת ב-SMS"}
        </button>
        <button className="link" onClick={copy}>
          העתקת קישור
        </button>
      </div>
      {msg ? <div className="xs" style={{ marginTop: 4 }}>{msg}</div> : null}
    </div>
  );
}

export function CancelButton({ docId }: { docId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      className="btn bd sm"
      style={{ marginTop: 16 }}
      disabled={pending}
      onClick={() => {
        if (confirm("לבטל את המסמך? הקישורים לחתימה יפסיקו לעבוד.")) start(() => cancelDocument(docId));
      }}
    >
      ביטול המסמך
    </button>
  );
}

interface SharePayload {
  docId: string;
  title: string;
  office: string;
  link: string;
  signers: { id: string; name: string; phone: string | null; email: string | null }[];
}

export function ShareSheetButton({ payload }: { payload: SharePayload }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn bp" onClick={() => setOpen(true)}>
        <Icon name="send" />
        שליחת העתק
      </button>
      {open ? <ShareSheet p={payload} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ShareSheet({ p, onClose }: { p: SharePayload; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(p.signers.map((s) => s.id));
  const [extra, setExtra] = useState("");
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});
  const [pending, start] = useTransition();
  const text = `העתק חתום של "${p.title}" מאת ${p.office}:\n${p.link}`;
  const chosen = p.signers.filter((s) => selected.includes(s.id));
  const extraPhone = normalizePhone(extra);

  const sms = () =>
    start(async () => {
      const r = await sendCopySms(p.docId, selected, extra);
      setMsg(r.error ? { err: r.error } : { ok: `נשלח ב-SMS ל-${r.sent} נמענים${r.demo ? " (מצב הדגמה)" : ""}` });
    });

  const whatsapp = (to: { name: string; phone: string | null }) => {
    logShare(p.docId, "copy_whatsapp", to.name);
    window.open(waUrl(to.phone, text), "_blank");
  };

  const email = () => {
    const to = chosen.map((s) => s.email).filter(Boolean).join(",");
    logShare(p.docId, "copy_email", to || "מייל");
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(`העתק חתום: ${p.title}`)}&body=${encodeURIComponent(text)}`;
  };

  const copyLink = async () => {
    await navigator.clipboard?.writeText(p.link);
    logShare(p.docId, "copy_link");
    setMsg({ ok: "הקישור הועתק (בתוקף 30 יום)" });
  };

  // Native share sheet: lets the agent save the PDF to Files / Google Drive / any app on the phone.
  const nativeShare = async () => {
    try {
      const res = await fetch(`/api/documents/${p.docId}/pdf`);
      const blob = await res.blob();
      const name = decodeURIComponent((res.headers.get("content-disposition") ?? "").split("''")[1] ?? "document.pdf");
      const file = new File([blob], name, { type: "application/pdf" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: p.title });
        logShare(p.docId, "pdf_shared");
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        logShare(p.docId, "pdf_saved");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <>
      <div className="sheet-bg" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label="שליחת העתק ושמירת PDF">
        <div className="grab" />
        <div className="row" style={{ marginBottom: 14 }}>
          <div style={{ width: 48, height: 60, borderRadius: 8, background: "#fee2e2", color: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rubik", fontWeight: 700, fontSize: 13 }}>
            PDF
          </div>
          <div className="grow">
            <div className="t">{p.title}</div>
            <div className="s">כולל תעודת חתימה</div>
          </div>
        </div>
        {msg.err ? <div className="err">{msg.err}</div> : null}
        {msg.ok ? <div className="okmsg">{msg.ok}</div> : null}

        <div className="lbl">שליחת העתק חתום אל</div>
        <div className="card flat" style={{ padding: "4px 14px" }}>
          {p.signers.map((s) => (
            <label key={s.id} className="chk" style={{ alignItems: "center" }}>
              <input type="checkbox" checked={selected.includes(s.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, s.id] : selected.filter((x) => x !== s.id))} />
              <span className="grow">{s.name}</span>
              <button type="button" className="btn wa xs" onClick={(e) => (e.preventDefault(), whatsapp(s))} aria-label={`WhatsApp ל${s.name}`}>
                <Icon name="msg" size="sm" />
              </button>
            </label>
          ))}
          <div className="row" style={{ padding: "8px 0" }}>
            <input className="inp ltr grow" placeholder="נמען נוסף – טלפון (עו״ד, בן/בת זוג…)" inputMode="tel" value={extra} onChange={(e) => setExtra(e.target.value)} />
            {extraPhone ? (
              <button type="button" className="btn wa xs" onClick={() => whatsapp({ name: extraPhone, phone: extraPhone })} aria-label="WhatsApp לנמען הנוסף">
                <Icon name="msg" size="sm" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid4" style={{ margin: "14px 0" }}>
          <button className="center" onClick={sms} disabled={pending}>
            <div className="av c-amber" style={{ margin: "0 auto 4px", width: 52, height: 52, borderRadius: 16 }}>
              <Icon name="sms" />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{pending ? "שולח…" : "SMS"}</div>
          </button>
          <button className="center" onClick={() => chosen[0] && whatsapp(chosen[0])}>
            <div className="av" style={{ margin: "0 auto 4px", width: 52, height: 52, borderRadius: 16, background: "#25d366", color: "#fff" }}>
              <Icon name="msg" />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>WhatsApp</div>
          </button>
          <button className="center" onClick={email}>
            <div className="av c-navy" style={{ margin: "0 auto 4px", width: 52, height: 52, borderRadius: 16 }}>
              <Icon name="mail" />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>מייל</div>
          </button>
          <button className="center" onClick={copyLink}>
            <div className="av c-gray" style={{ margin: "0 auto 4px", width: 52, height: 52, borderRadius: 16 }}>
              <Icon name="link" />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>העתקת קישור</div>
          </button>
        </div>

        <div className="lbl">שמירת PDF</div>
        <div className="grid2">
          <a className="btn bo sm" href={`/api/documents/${p.docId}/pdf?download=1`} onClick={() => logShare(p.docId, "pdf_saved")}>
            <Icon name="dl" size="sm" />
            לטלפון
          </a>
          <button className="btn bo sm" onClick={nativeShare}>
            <Icon name="share" size="sm" />
            Drive / שיתוף…
          </button>
        </div>
        <div className="row xs" style={{ marginTop: 12, gap: 6 }}>
          <Icon name="lock" size="sm" />
          קישור מאובטח, בתוקף 30 יום · המסמך נשמר בארכיון ולא ניתן למחיקה
        </div>
      </div>
    </>
  );
}
