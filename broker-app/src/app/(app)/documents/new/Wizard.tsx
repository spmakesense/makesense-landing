"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { createDocumentAction, type WizardSigner } from "@/app/actions/documents";
import { FieldInput } from "@/components/FieldInput";
import { Icon } from "@/components/Icon";
import { KIND_LABEL, money, normalizePhone, prettyPhone } from "@/lib/format";
import { getTemplate, interestLabel, missingFields, TEMPLATES, type DefaultsCtx, type Interest, type Values } from "@/lib/templates";

export interface WizardProperty {
  id: string;
  address: string;
  city: string | null;
  parcel: string | null;
  kind: string;
  rooms: number | null;
  sqm: number | null;
  floor: string | null;
  price: number | null;
  deal_type: "sale" | "rent";
  exclusive_to: string | null;
  owner_client_id: string | null;
  interest: Interest | null;
  disclosure: Values | null;
}

type ClientLite = { id: string; name: string; phone: string | null; kind: string };

interface Props {
  properties: WizardProperty[];
  clients: ClientLite[];
  feePct: number;
  feeIncludesVat: boolean;
  initial: { template: string | null; propertyId: string | null; clientId: string | null };
}

export function Wizard(p: Props) {
  const initialClient = p.clients.find((c) => c.id === p.initial.clientId);
  const [step, setStep] = useState(p.initial.template && getTemplate(p.initial.template) ? 2 : 1);
  const [templateKey, setTemplateKey] = useState<string | null>(p.initial.template && getTemplate(p.initial.template) ? p.initial.template : null);
  const [propertyId, setPropertyId] = useState<string | null>(p.properties.some((x) => x.id === p.initial.propertyId) ? p.initial.propertyId : null);
  const [signers, setSigners] = useState<WizardSigner[]>(() => {
    if (initialClient) return [{ clientId: initialClient.id, name: initialClient.name, phone: initialClient.phone ?? "" }];
    // Opened from a property for a seller document: the owner is the natural signer.
    const tt = p.initial.template ? getTemplate(p.initial.template) : null;
    const prop = p.properties.find((x) => x.id === p.initial.propertyId);
    const owner = tt?.audience === "seller" && prop?.owner_client_id ? p.clients.find((c) => c.id === prop.owner_client_id) : undefined;
    return owner ? [{ clientId: owner.id, name: owner.name, phone: owner.phone ?? "" }] : [];
  });
  const [data, setData] = useState<Values>({});
  const [propQuery, setPropQuery] = useState("");
  const [pickClient, setPickClient] = useState("");
  const [quick, setQuick] = useState({ name: "", phone: "" });
  const [error, setError] = useState<string>();
  const [pending, start] = useTransition();

  const t = templateKey ? getTemplate(templateKey)! : null;
  const property = p.properties.find((x) => x.id === propertyId) ?? null;
  const dctx: DefaultsCtx = { feePct: p.feePct, feeIncludesVat: p.feeIncludesVat, property };
  const backHref = `/documents/new?t=${templateKey ?? ""}${propertyId ? `&property=${propertyId}` : ""}`;

  const filteredProps = useMemo(
    () => p.properties.filter((x) => !propQuery || `${x.address} ${x.city ?? ""}`.includes(propQuery)).slice(0, 8),
    [p.properties, propQuery],
  );

  const chooseTemplate = (key: string) => {
    setTemplateKey(key);
    setStep(2);
    setError(undefined);
  };

  const choosePropertyAndOwner = (id: string) => {
    setPropertyId(id);
    const tt = templateKey ? getTemplate(templateKey) : null;
    const prop = p.properties.find((x) => x.id === id);
    // For seller documents the property owner is the natural signer.
    if (tt?.audience === "seller" && prop?.owner_client_id && signers.length === 0) {
      const o = p.clients.find((c) => c.id === prop.owner_client_id);
      if (o) setSigners([{ clientId: o.id, name: o.name, phone: o.phone ?? "" }]);
    }
  };

  const addExisting = (id: string) => {
    const c = p.clients.find((x) => x.id === id);
    if (c && !signers.some((s) => s.clientId === id)) setSigners([...signers, { clientId: c.id, name: c.name, phone: c.phone ?? "" }]);
    setPickClient("");
  };

  const addQuick = () => {
    if (!quick.name.trim()) return setError("נא למלא שם");
    if (!normalizePhone(quick.phone)) return setError("מספר טלפון לא תקין");
    setSigners([...signers, { clientId: null, name: quick.name.trim(), phone: quick.phone }]);
    setQuick({ name: "", phone: "" });
    setError(undefined);
  };

  const fromContacts = async () => {
    type ContactsNav = Navigator & { contacts?: { select: (props: string[], opts: { multiple: boolean }) => Promise<{ name?: string[]; tel?: string[] }[]> } };
    const nav = navigator as ContactsNav;
    if (!nav.contacts) return setError("הדפדפן לא תומך בבחירה מאנשי קשר. הקלידו שם וטלפון.");
    try {
      const picked = await nav.contacts.select(["name", "tel"], { multiple: true });
      setSigners((cur) => [...cur, ...picked.filter((c) => c.tel?.[0]).map((c) => ({ clientId: null, name: c.name?.[0] ?? "", phone: c.tel![0] }))]);
    } catch {
      /* user cancelled */
    }
  };

  const toFields = () => {
    if (!t) return;
    if (t.needsProperty && !property) return setError("נא לבחור נכס");
    if (signers.length === 0) return setError("נא להוסיף חותם");
    const bad = signers.find((s) => !normalizePhone(s.phone));
    if (bad) return setError(`חסר מספר טלפון תקין עבור ${bad.name}`);
    if (!t.multiSigner && signers.length > 1) return setError("תבנית זו מיועדת לחותם אחד");
    setData({ ...t.defaults(dctx) });
    setError(undefined);
    setStep(3);
  };

  const submit = () => {
    if (!t) return;
    const missing = missingFields(t.fields, data);
    if (missing.length) return setError(`חסר: ${missing.map((f) => f.label).join(", ")}`);
    const invalid = t.validate?.(data, dctx);
    if (invalid) return setError(invalid);
    start(async () => {
      const r = await createDocumentAction({ template: t.key, propertyId, data, signers });
      if (r?.error) setError(r.error);
    });
  };

  const annex = t && property?.interest && t.buyerSide(data) ? property.interest : null;

  return (
    <main className="page nobar">
      <header className="hdr">
        {step > 1 ? (
          <button className="ib" onClick={() => (setStep(step - 1), setError(undefined))} aria-label="חזרה">
            <Icon name="back" />
          </button>
        ) : (
          <Link href="/" className="ib" aria-label="סגירה">
            <Icon name="x" />
          </Link>
        )}
        <h1>{t && step > 1 ? t.title : "מסמך חדש"}</h1>
        <span className="spacer" />
      </header>
      <div className="steps">
        {[1, 2, 3].map((n) => (
          <i key={n} className={step >= n ? "on" : ""} />
        ))}
      </div>
      <div className="s" style={{ marginBottom: 4 }}>
        שלב {step} מתוך 3
      </div>

      {error ? <div className="err">{error}</div> : null}

      {step === 1 && (
        <>
          <h2 style={{ fontSize: 22, marginBottom: 14 }}>מה מחתימים?</h2>
          <div className="stack">
            {TEMPLATES.map((x, i) => (
              <button key={x.key} className={`card row ${i === 0 ? "sel" : ""}`} style={{ width: "100%", textAlign: "start" }} onClick={() => chooseTemplate(x.key)}>
                <div className={`av c-${x.tone}`}>
                  <Icon name={x.icon} />
                </div>
                <div className="grow">
                  <div className="t">{x.title}</div>
                  <div className="s">{x.short}</div>
                </div>
                {i === 0 ? <span className="chip c-teal">הכי בשימוש</span> : <Icon name="chev" style={{ color: "var(--mute)" }} />}
              </button>
            ))}
          </div>
          <div className="row" style={{ marginTop: 16, background: "#e8f7f4", borderRadius: 14, padding: 12, color: "#0f766e", fontSize: 13, gap: 8 }}>
            <Icon name="shield" />
            <span>התבניות כוללות את שדות החובה לפי חוק המתווכים ותקנותיו (טיוטה – לאישור עו״ד לפני שימוש).</span>
          </div>
        </>
      )}

      {step === 2 && t && (
        <>
          <div className="lbl" style={{ marginTop: 8 }}>
            הנכס
          </div>
          {property ? (
            <div className="card row" style={{ marginBottom: 14 }}>
              <div className="thumb" />
              <div className="grow">
                <div className="t">
                  {property.address}
                  {property.city ? `, ${property.city}` : ""}
                </div>
                <div className="s">{[property.rooms ? `${property.rooms} חד׳` : "", property.sqm ? `${property.sqm} מ״ר` : "", money(property.price)].filter(Boolean).join(" · ")}</div>
              </div>
              <button className="link" onClick={() => setPropertyId(null)}>
                שינוי
              </button>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: 14 }}>
              <input className="inp" placeholder="חיפוש נכס לפי כתובת" value={propQuery} onChange={(e) => setPropQuery(e.target.value)} />
              <div className="list-in" style={{ marginTop: 6 }}>
                {filteredProps.map((x) => (
                  <button key={x.id} className="row" style={{ width: "100%", textAlign: "start" }} onClick={() => choosePropertyAndOwner(x.id)}>
                    <div className="grow">
                      <div className="t">{x.address}</div>
                      <div className="s">{[x.city, money(x.price, true)].filter(Boolean).join(" · ")}</div>
                    </div>
                    <Icon name="chev" style={{ color: "var(--mute)" }} />
                  </button>
                ))}
              </div>
              <Link href={`/properties/new?back=${encodeURIComponent(backHref)}`} className="btn bo sm" style={{ marginTop: 8 }}>
                <Icon name="plus" size="sm" />
                נכס חדש
              </Link>
            </div>
          )}

          {annex ? (
            <div className="card warn row top" style={{ marginBottom: 14, fontSize: 13, color: "#92400e" }}>
              <Icon name="shield" style={{ color: "var(--amber)" }} />
              <div>
                <b>נספח גילוי נאות יצורף אוטומטית</b>
                <br />
                {interestLabel(annex.type)} · {annex.relation}
              </div>
            </div>
          ) : null}

          <div className="row between" style={{ marginBottom: 8 }}>
            <div className="lbl" style={{ margin: 0 }}>
              {t.audience === "seller" ? "בעלי הנכס" : "חותמים"} ({signers.length})
            </div>
            {t.multiSigner && signers.length > 1 ? <span className="chip c-teal">החתמה קבוצתית</span> : null}
          </div>
          {signers.length ? (
            <div className="card list-in" style={{ padding: "4px 14px", marginBottom: 10 }}>
              {signers.map((s, i) => (
                <div key={i} className="row">
                  <div className="av c-navy">{s.name.slice(0, 2)}</div>
                  <div className="grow">
                    <div className="t">{s.name}</div>
                    <div className="s" style={{ direction: "ltr", textAlign: "right" }}>
                      {normalizePhone(s.phone) ? prettyPhone(normalizePhone(s.phone)) : "חסר מספר טלפון"}
                    </div>
                  </div>
                  <button className="link" style={{ color: "var(--red)" }} onClick={() => setSigners(signers.filter((_, j) => j !== i))} aria-label="הסרה">
                    <Icon name="x" size="sm" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {t.multiSigner || signers.length === 0 ? (
            <div className="card">
              {p.clients.length ? (
                <select className="inp" value={pickClient} onChange={(e) => addExisting(e.target.value)} style={{ marginBottom: 10 }}>
                  <option value="">בחירה מהלקוחות…</option>
                  {p.clients
                    .filter((c) => !signers.some((s) => s.clientId === c.id))
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} · {KIND_LABEL[c.kind]}
                      </option>
                    ))}
                </select>
              ) : null}
              <div className="grid2">
                <input className="inp" placeholder="שם מלא" value={quick.name} onChange={(e) => setQuick({ ...quick, name: e.target.value })} />
                <input className="inp ltr" placeholder="טלפון" inputMode="tel" value={quick.phone} onChange={(e) => setQuick({ ...quick, phone: e.target.value })} />
              </div>
              <div className="grid2" style={{ marginTop: 8 }}>
                <button className="btn bo sm" onClick={addQuick}>
                  <Icon name="plus" size="sm" />
                  הוספה
                </button>
                <button className="btn bo sm" onClick={fromContacts}>
                  <Icon name="uplus" size="sm" />
                  מאנשי קשר
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}

      {step === 3 && t && (
        <>
          <div className="card" style={{ marginTop: 8 }}>
            {t.fields.length === 0 ? <p className="s">אין שדות למילוי – בעל הנכס ימלא את השאלון בעצמו בעת החתימה.</p> : null}
            {t.fields
              .filter((f) => !f.showIf || f.showIf(data))
              .map((f) => (
                <FieldInput key={f.key} field={f} data={data} onChange={(k, v) => setData((d) => ({ ...d, [k]: v }))} />
              ))}
          </div>
          <div className="card flat" style={{ marginTop: 12 }}>
            <div className="s">
              {signers.length} חותמים · {property?.address}
              {annex ? " · כולל נספח גילוי נאות" : ""}
            </div>
            <div className="s">כל חותם יזוהה בקוד SMS. חותמת זמן ומיקום (בהסכמה) נשמרות אוטומטית.</div>
          </div>
        </>
      )}

      {step > 1 ? (
        <div className="bottom">
          {step === 2 ? (
            <button className="btn bp" onClick={toFields}>
              המשך לפרטי המסמך
            </button>
          ) : (
            <button className="btn bp" onClick={submit} disabled={pending}>
              <Icon name="send" />
              {pending ? "יוצר מסמך…" : "יצירת המסמך"}
            </button>
          )}
        </div>
      ) : null}
    </main>
  );
}
