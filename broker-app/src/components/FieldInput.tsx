"use client";

import type { Field, Values } from "@/lib/templates";

/** Input for one template field (used in the document wizard and on the signing page). */
export function FieldInput({ field: f, data, onChange }: { field: Field; data: Values; onChange: (key: string, value: Values[string]) => void }) {
  const v = data[f.key];
  const label = `${f.label}${f.required ? "" : ""}`;
  switch (f.type) {
    case "select":
      return (
        <label className="f">
          <span>{label}</span>
          <select className="inp" value={String(v ?? "")} onChange={(e) => onChange(f.key, e.target.value)}>
            <option value="">בחירה…</option>
            {f.options!.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {f.help ? <small className="hint">{f.help}</small> : null}
        </label>
      );
    case "bool":
      return (
        <label className="chk">
          <input type="checkbox" checked={Boolean(v)} onChange={(e) => onChange(f.key, e.target.checked)} />
          <span>{f.label}</span>
        </label>
      );
    case "multi": {
      const arr = Array.isArray(v) ? (v as string[]) : [];
      return (
        <div className="f" style={{ marginBottom: 12 }}>
          <span className="lbl">{label}</span>
          {f.options!.map((o) => (
            <label key={o.value} className="chk">
              <input type="checkbox" checked={arr.includes(o.value)} onChange={(e) => onChange(f.key, e.target.checked ? [...arr, o.value] : arr.filter((x) => x !== o.value))} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      );
    }
    case "issue": {
      const yes = v === "yes";
      return (
        <div className="f" style={{ marginBottom: 12 }}>
          <span className="lbl">{f.label}</span>
          <div className="seg">
            <button type="button" className={!yes ? "on" : ""} onClick={() => onChange(f.key, "no")}>
              לא ידוע לי על כך
            </button>
            <button type="button" className={yes ? "on" : ""} onClick={() => onChange(f.key, "yes")}>
              כן
            </button>
          </div>
          {yes ? (
            <input className="inp" style={{ marginTop: 8 }} placeholder="פירוט (מה, איפה, האם תוקן ומתי)" value={String(data[`${f.key}_details`] ?? "")} onChange={(e) => onChange(`${f.key}_details`, e.target.value)} />
          ) : null}
        </div>
      );
    }
    case "textarea":
      return (
        <label className="f">
          <span>{label}</span>
          <textarea className="inp" value={String(v ?? "")} onChange={(e) => onChange(f.key, e.target.value)} />
        </label>
      );
    default: {
      const numeric = f.type === "number" || f.type === "money" || f.type === "percent";
      return (
        <label className="f">
          <span>{label}</span>
          <input
            className={`inp ${numeric || f.type === "date" ? "ltr" : ""}`}
            type={f.type === "date" ? "date" : "text"}
            inputMode={numeric ? "decimal" : undefined}
            value={String(v ?? "")}
            onChange={(e) => onChange(f.key, numeric ? e.target.value.replace(/[^\d.]/g, "") : e.target.value)}
          />
          {f.help ? <small className="hint">{f.help}</small> : null}
        </label>
      );
    }
  }
}
