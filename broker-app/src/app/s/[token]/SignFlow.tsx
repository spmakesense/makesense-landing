"use client";

import { useEffect, useState, useTransition } from "react";
import { DocView } from "@/components/DocView";
import { Icon } from "@/components/Icon";
import { SignaturePad } from "@/components/SignaturePad";
import { ANNEX_CONSENTS, getTemplate, type Block, type Values } from "@/lib/templates";
import { FieldInput } from "@/components/FieldInput";
import { markViewed, requestSignCode, signAnnex, submitSignature } from "./actions";

interface Props {
  token: string;
  inPerson: boolean;
  backTo: string | null;
  templateKey: string;
  title: string;
  docTitle: string;
  office: string;
  agent: string;
  status: string;
  signerStatus: string;
  signerName: string;
  isPrimary: boolean;
  blocks: Block[];
  signers: { name: string; id_number: string; phone: string | null }[];
  annex: Block[] | null;
  shareToken: string | null;
}

export function SignFlow(p: Props) {
  const t = getTemplate(p.templateKey)!;
  const [step, setStep] = useState<"annex" | "doc" | "done">(p.signerStatus === "signed" ? "done" : p.annex ? "annex" : "doc");
  const [annexChecks, setAnnexChecks] = useState(ANNEX_CONSENTS.map(() => false));
  const [annexSig, setAnnexSig] = useState("");
  const [identity, setIdentity] = useState({ name: p.signerName, id_number: "", address: "" });
  const [primary, setPrimary] = useState<Values>({});
  const [checks, setChecks] = useState(t.consents.map(() => false));
  const [signature, setSignature] = useState("");
  const [otp, setOtp] = useState<{ sent: boolean; demo?: string; phone?: string }>({ sent: false });
  const [code, setCode] = useState("");
  const [geo, setGeo] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  useEffect(() => {
    if (p.signerStatus !== "signed" && !p.inPerson) markViewed(p.token);
    // Location is optional evidence; the signer can refuse.
    navigator.geolocation?.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy }),
      () => setGeo(null),
      { timeout: 8000, maximumAge: 300000 },
    );
  }, [p.token, p.signerStatus, p.inPerson]);

  if (p.status === "cancelled") {
    return (
      <div className="empty card" style={{ marginTop: 40 }}>
        <Icon name="x" size="lg" />
        <p>המסמך בוטל על ידי המתווך.</p>
      </div>
    );
  }

  const header = (
    <div className="row" style={{ margin: "6px 0 16px" }}>
      <div className="av" style={{ background: "var(--navy)", color: "#fff" }}>
        {p.office.slice(0, 2)}
      </div>
      <div className="grow">
        <div className="t">{p.office}</div>
        <div className="s">{p.agent}</div>
      </div>
    </div>
  );

  if (step === "done") {
    return (
      <div style={{ paddingTop: 30 }}>
        {header}
        <div className="center card" style={{ padding: 24 }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#dcfce7", color: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Icon name="check" size="lg" />
          </div>
          <h2 style={{ fontSize: 22 }}>תודה, החתימה התקבלה</h2>
          <p className="s" style={{ margin: "6px 0 16px" }}>{p.docTitle}</p>
          {p.shareToken ? (
            <a className="btn bp" href={`/d/${p.shareToken}`}>
              <Icon name="dl" />
              הורדת העתק חתום (PDF)
            </a>
          ) : (
            <p className="s">כשכל החותמים יסיימו, יישלח אליך העתק חתום ב-SMS.</p>
          )}
          {p.inPerson ? (
            <>
              <p className="demo" style={{ marginTop: 14 }}>מחזירים את הטלפון למתווך 🙂</p>
              {p.backTo ? (
                <a className="btn bn sm" href={p.backTo}>
                  חזרה למסמך (למתווך)
                </a>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    );
  }

  if (step === "annex" && p.annex) {
    const submitAnnex = () =>
      start(async () => {
        setError(undefined);
        const r = await signAnnex(p.token, annexSig, annexChecks);
        if (r.error) setError(r.error);
        else setStep("doc");
      });
    return (
      <>
        {header}
        <div className="steps">
          <i className="on" />
          <i />
        </div>
        <h2 style={{ fontSize: 21, marginBottom: 4 }}>שלום {p.signerName},</h2>
        <p className="s" style={{ marginBottom: 12 }}>
          לפני המסמך, המתווך חייב לגלות לך שיש לו עניין אישי בנכס. נא לקרוא ולחתום על הנספח.
        </p>
        <DocView blocks={p.annex} signers={p.signers} />
        <div className="card" style={{ marginTop: 12 }}>
          {ANNEX_CONSENTS.map((c, i) => (
            <label key={i} className="chk">
              <input type="checkbox" checked={annexChecks[i]} onChange={(e) => setAnnexChecks(annexChecks.map((v, j) => (j === i ? e.target.checked : v)))} />
              <span>{c}</span>
            </label>
          ))}
          <div style={{ marginTop: 8 }}>
            <SignaturePad onChange={setAnnexSig} label="חתימה על הנספח" />
          </div>
        </div>
        {error ? <div className="err" style={{ marginTop: 12 }}>{error}</div> : null}
        <button className="btn bp" style={{ marginTop: 14 }} disabled={pending} onClick={submitAnnex}>
          {pending ? "שומר…" : "חתמתי – המשך למסמך"}
        </button>
      </>
    );
  }

  const ask = () =>
    start(async () => {
      setError(undefined);
      const r = await requestSignCode(p.token);
      if (r.error) return setError(r.error);
      setOtp({ sent: true, demo: r.demoCode, phone: r.phone });
    });

  const submit = () =>
    start(async () => {
      setError(undefined);
      const r = await submitSignature(p.token, { identity, primary, consents: checks, signature, code, geo });
      if (r.error) setError(r.error);
      else {
        setStep("done");
        window.scrollTo(0, 0);
      }
    });

  const sections = p.isPrimary ? t.primarySections ?? [] : [];

  return (
    <>
      {header}
      <h2 style={{ fontSize: 21 }}>שלום {p.signerName}, נא לחתום על</h2>
      <h2 style={{ fontSize: 21, color: "var(--teal-d)", marginBottom: 12 }}>{p.title}</h2>
      <DocView blocks={p.blocks} signers={p.signers} />

      {sections.map((s) => (
        <div key={s.title} className="card" style={{ marginTop: 12 }}>
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>{s.title}</h3>
          {s.fields
            .filter((f) => !f.showIf || f.showIf(primary))
            .map((f) => (
              <FieldInput key={f.key} field={f} data={primary} onChange={(k, v) => setPrimary((d) => ({ ...d, [k]: v }))} />
            ))}
        </div>
      ))}

      <div className="card" style={{ marginTop: 12 }}>
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>הפרטים שלך</h3>
        <label className="f">
          <span>שם מלא</span>
          <input className="inp" value={identity.name} onChange={(e) => setIdentity({ ...identity, name: e.target.value })} autoComplete="name" />
        </label>
        <label className="f">
          <span>מספר תעודת זהות</span>
          <input className="inp ltr" inputMode="numeric" maxLength={9} value={identity.id_number} onChange={(e) => setIdentity({ ...identity, id_number: e.target.value.replace(/\D/g, "") })} />
        </label>
        <label className="f">
          <span>כתובת מגורים{t.signerAddressRequired ? "" : " (לא חובה)"}</span>
          <input className="inp" value={identity.address} onChange={(e) => setIdentity({ ...identity, address: e.target.value })} autoComplete="street-address" />
        </label>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        {t.consents.map((c, i) => (
          <label key={i} className="chk">
            <input type="checkbox" checked={checks[i]} onChange={(e) => setChecks(checks.map((v, j) => (j === i ? e.target.checked : v)))} />
            <span>{c}</span>
          </label>
        ))}
        <div style={{ marginTop: 8 }}>
          <SignaturePad onChange={setSignature} />
        </div>
      </div>

      {error ? <div className="err" style={{ marginTop: 12 }}>{error}</div> : null}

      {!otp.sent ? (
        <button className="btn bp" style={{ marginTop: 14 }} disabled={pending || !signature || checks.some((c) => !c)} onClick={ask}>
          {pending ? "שולח קוד…" : "חתימה ואישור בקוד SMS"}
        </button>
      ) : (
        <div className="card" style={{ marginTop: 14 }}>
          {otp.demo ? <div className="demo">מצב הדגמה: הקוד הוא <b>{otp.demo}</b></div> : null}
          <label className="f">
            <span>הקוד שנשלח לטלפון המסתיים ב-{otp.phone}</span>
            <input className="inp ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} autoFocus />
          </label>
          <button className="btn bp" disabled={pending || code.length !== 6} onClick={submit}>
            {pending ? "חותם…" : "אישור וחתימה"}
          </button>
          <button className="btn bo sm" style={{ marginTop: 8 }} disabled={pending} onClick={ask}>
            שליחת קוד חדש
          </button>
        </div>
      )}
      <p className="row xs" style={{ justifyContent: "center", marginTop: 14, gap: 6 }}>
        <Icon name="shield" size="sm" />
        חתימה אלקטרונית מאובטחת · ללא התקנה
      </p>
    </>
  );
}
