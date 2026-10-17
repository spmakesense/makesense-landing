import Link from "next/link";
import { initials } from "@/lib/format";
import { Icon } from "./Icon";

export function Header({ title, back, action, start }: { title: string; back?: string; action?: React.ReactNode; start?: boolean }) {
  return (
    <header className="hdr">
      {back ? (
        <Link href={back} className="ib" aria-label="חזרה">
          <Icon name="back" />
        </Link>
      ) : start ? null : (
        <span className="spacer" />
      )}
      <h1 className={start ? "start" : ""}>{title}</h1>
      {action ?? (start ? null : <span className="spacer" />)}
    </header>
  );
}

const TONES = ["c-navy", "c-teal", "c-amber", "c-green", "c-gray"];

export function Avatar({ name, tone, xl }: { name: string | null; tone?: string; xl?: boolean }) {
  const t = tone ?? TONES[(name ?? "").length % TONES.length];
  return <div className={`av ${t} ${xl ? "xl" : ""}`}>{initials(name)}</div>;
}

export function Empty({ icon, text, children }: { icon: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="empty card">
      <Icon name={icon} size="lg" />
      <p style={{ margin: "8px 0 12px" }}>{text}</p>
      {children}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="f">
      <span>{label}</span>
      {children}
      {hint ? <small className="hint">{hint}</small> : null}
    </label>
  );
}

export const STATUS_CHIP: Record<string, { label: string; cls: string }> = {
  sent: { label: "נשלח", cls: "c-gray" },
  partial: { label: "נחתם חלקית", cls: "c-amber" },
  signed: { label: "נחתם", cls: "c-green" },
  cancelled: { label: "בוטל", cls: "c-red" },
  pending: { label: "לא נפתח", cls: "c-gray" },
  viewed: { label: "נצפה", cls: "c-amber" },
};
