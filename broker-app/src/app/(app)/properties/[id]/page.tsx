import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { STATUS_CHIP } from "@/components/ui";
import { toggleMarketing } from "@/app/actions/crm";
import { requireCtx } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { daysBetween, dateHe, money, todayIso } from "@/lib/format";
import { MARKETING_ACTIONS } from "@/lib/templates";
import type { Client, Doc, Property } from "@/lib/types";
import { InterestForm } from "./InterestForm";

export default async function PropertyCard({ params }: { params: Promise<{ id: string }> }) {
  const { office } = await requireCtx();
  const { id } = await params;
  const p = get<Property>("SELECT * FROM properties WHERE id = ? AND office_id = ?", id, office.id);
  if (!p) notFound();
  const owner = p.owner_client_id ? get<Client>("SELECT * FROM clients WHERE id = ?", p.owner_client_id) : undefined;
  const docs = all<Doc>("SELECT * FROM documents WHERE property_id = ? ORDER BY created_at DESC", id);
  const showings = docs.filter((d) => d.template === "showing_form");
  const showingSigners = showings.length
    ? get<{ n: number }>(`SELECT COUNT(*) AS n FROM signers WHERE status = 'signed' AND document_id IN (${showings.map(() => "?").join(",")})`, ...showings.map((d) => d.id))!.n
    : 0;
  const today = todayIso();
  const excl = p.exclusive_from && p.exclusive_to;
  const total = excl ? daysBetween(p.exclusive_from!, p.exclusive_to!) : 0;
  const left = excl ? daysBetween(today, p.exclusive_to!) : 0;
  const marketing = JSON.parse(p.marketing || "{}") as Record<string, boolean>;
  const plannedActions = MARKETING_ACTIONS.filter((a) => a.value in marketing);
  const doneActions = plannedActions.filter((a) => marketing[a.value]).length;
  const thirdPassed = excl && daysBetween(p.exclusive_from!, today) > total / 3;
  const disclosure = p.disclosure ? JSON.parse(p.disclosure) : null;

  return (
    <main className="page" style={{ paddingTop: 0 }}>
      <div style={{ margin: "0 -18px", height: 210, background: "linear-gradient(180deg,rgba(16,20,42,.45),transparent 45%),linear-gradient(160deg,#7f96d6,#3d4f9c 60%,#1e2a5a)", padding: "12px 18px" }}>
        <div className="row between">
          <Link href="/properties" className="ib" style={{ background: "rgba(255,255,255,.9)" }} aria-label="חזרה">
            <Icon name="back" />
          </Link>
          <Link href={`/properties/${id}/edit`} className="ib" style={{ background: "rgba(255,255,255,.9)" }} aria-label="עריכה">
            <Icon name="pen" />
          </Link>
        </div>
      </div>
      <div className="card" style={{ marginTop: -80, position: "relative", padding: 16 }}>
        <div className="row between">
          <div className="big" style={{ color: "var(--navy)", fontSize: 26 }}>
            {money(p.price)}
          </div>
          {excl && left >= 0 ? (
            <span className="chip c-amber">
              <Icon name="key" size="sm" />
              בלעדי
            </span>
          ) : null}
        </div>
        <div className="t">
          {p.address}
          {p.city ? `, ${p.city}` : ""}
        </div>
        <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
          <span className="chip c-gray">{p.kind}</span>
          <span className="chip c-gray">{p.deal_type === "rent" ? "להשכרה" : "למכירה"}</span>
          {p.rooms ? <span className="chip c-gray">{p.rooms} חד׳</span> : null}
          {p.sqm ? <span className="chip c-gray">{p.sqm} מ״ר</span> : null}
          {p.floor ? <span className="chip c-gray">קומה {p.floor}</span> : null}
        </div>
        {owner ? (
          <Link href={`/clients/${owner.id}`} className="row s" style={{ marginTop: 10 }}>
            <Icon name="users" size="sm" />
            בעלים: {owner.name}
          </Link>
        ) : null}
      </div>

      <div style={{ marginTop: 10 }}>
        <InterestForm propertyId={p.id} interest={p.interest ? JSON.parse(p.interest) : null} />
      </div>

      {excl ? (
        <div className="card" style={{ marginTop: 10 }}>
          <div className="row between">
            <div className="t">בלעדיות עד {dateHe(p.exclusive_to)}</div>
            <span className={`chip ${left < 0 ? "c-gray" : left <= 30 ? "c-amber" : "c-teal"}`}>{left < 0 ? "הסתיימה" : `נותרו ${left} ימים`}</span>
          </div>
          <div className="bar" style={{ margin: "10px 0 12px" }}>
            <i style={{ width: `${Math.min(100, Math.max(0, ((total - left) / Math.max(total, 1)) * 100))}%` }} />
          </div>
          <div className="lbl">
            פעולות שיווק לפי ההסכם ({doneActions}/{plannedActions.length})
          </div>
          {plannedActions.map((a) => (
            <form key={a.value} action={toggleMarketing.bind(null, p.id, a.value)}>
              <button className="chk" style={{ width: "100%", textAlign: "start" }}>
                <Icon name={marketing[a.value] ? "check" : "task"} size="sm" style={{ color: marketing[a.value] ? "var(--green)" : "var(--mute)", marginTop: 3 }} />
                <span style={{ color: marketing[a.value] ? undefined : "var(--mute)" }}>{a.label}</span>
              </button>
            </form>
          ))}
          {doneActions < 2 && thirdPassed && left >= 0 ? (
            <div className="err" style={{ marginTop: 8, marginBottom: 0 }}>
              עבר שליש מתקופת הבלעדיות ובוצעו פחות מ-2 פעולות שיווק – לפי החוק הבלעדיות עלולה להסתיים.
            </div>
          ) : null}
        </div>
      ) : (
        <Link href={`/documents/new?t=exclusivity&property=${p.id}`} className="card row" style={{ marginTop: 10 }}>
          <div className="av c-amber">
            <Icon name="key" />
          </div>
          <div className="grow">
            <div className="t">אין בלעדיות</div>
            <div className="s">החתמת בעל הנכס על הסכם בלעדיות</div>
          </div>
          <Icon name="chev" style={{ color: "var(--mute)" }} />
        </Link>
      )}

      <Link
        href={disclosure ? `/documents/new?t=buyer_info_sheet&property=${p.id}` : `/documents/new?t=seller_questionnaire&property=${p.id}`}
        className="card row"
        style={{ marginTop: 10 }}
      >
        <div className={`av ${disclosure ? "c-green" : "c-gray"}`}>
          <Icon name={disclosure ? "info" : "list"} />
        </div>
        <div className="grow">
          <div className="t">{disclosure ? "שאלון מוכר חתום ✓" : "אין עדיין שאלון מוכר"}</div>
          <div className="s">{disclosure ? "שליחת דף מידע על הנכס לקונה" : "שליחת שאלון גילוי נאות לבעל הנכס"}</div>
        </div>
        <Icon name="chev" style={{ color: "var(--mute)" }} />
      </Link>

      <div className="grid3" style={{ marginTop: 10 }}>
        <div className="card center" style={{ padding: "12px 4px" }}>
          <div className="big" style={{ fontSize: 22, color: "var(--navy)" }}>{showings.length}</div>
          <div className="s">סיורים</div>
        </div>
        <div className="card center" style={{ padding: "12px 4px" }}>
          <div className="big" style={{ fontSize: 22, color: "var(--green)" }}>{showingSigners}</div>
          <div className="s">טפסי הצגה חתומים</div>
        </div>
        <div className="card center" style={{ padding: "12px 4px" }}>
          <div className="big" style={{ fontSize: 22, color: "var(--teal-d)" }}>{docs.length}</div>
          <div className="s">מסמכים</div>
        </div>
      </div>

      <Link href={`/documents/new?t=showing_form&property=${p.id}`} className="btn bp" style={{ marginTop: 12 }}>
        <Icon name="eye" />
        טופס הצגת נכס
      </Link>

      <div className="sec">
        <h3>מסמכים</h3>
      </div>
      {docs.length === 0 ? (
        <div className="card s center">עוד אין מסמכים לנכס</div>
      ) : (
        <div className="stack">
          {docs.map((d) => (
            <Link key={d.id} href={`/documents/${d.id}`} className="card row">
              <div className="grow">
                <div className="t ellipsis">{d.title.split(" · ")[0]}</div>
                <div className="s">{dateHe(d.created_at)}</div>
              </div>
              <span className={`chip ${STATUS_CHIP[d.status].cls}`}>{STATUS_CHIP[d.status].label}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
