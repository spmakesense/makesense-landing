import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { Avatar, Header, STATUS_CHIP } from "@/components/ui";
import { addTask, toggleTask } from "@/app/actions/crm";
import { requireCtx } from "@/lib/auth";
import { all, get } from "@/lib/db";
import { dateHe, intlPhone, KIND_LABEL, prettyPhone, TEMP_LABEL } from "@/lib/format";
import type { Client, Doc, Task } from "@/lib/types";

export default async function ClientCard({ params }: { params: Promise<{ id: string }> }) {
  const { office } = await requireCtx();
  const { id } = await params;
  const c = await get<Client>("SELECT * FROM clients WHERE id = ? AND office_id = ?", id, office.id);
  if (!c) notFound();
  const docs = await all<Doc>(
    "SELECT d.* FROM documents d JOIN signers s ON s.document_id = d.id WHERE s.client_id = ? GROUP BY d.id ORDER BY d.created_at DESC",
    id,
  );
  const owned = await all<{ id: string; address: string; price: number | null }>("SELECT id, address, price FROM properties WHERE owner_client_id = ?", id);
  const tasks = await all<Task>("SELECT * FROM tasks WHERE client_id = ? ORDER BY done, due", id);
  const tone = c.temperature === "hot" ? "c-red" : c.temperature === "cold" ? "c-gray" : "c-amber";

  return (
    <main className="page">
      <Header
        title="כרטיס לקוח"
        back="/clients"
        action={
          <Link href={`/clients/${id}/edit`} className="ib" aria-label="עריכה">
            <Icon name="pen" />
          </Link>
        }
      />
      <div className="card center" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Avatar name={c.name} tone="c-navy" xl />
        </div>
        <h2 style={{ fontSize: 21 }}>{c.name}</h2>
        <div className="row" style={{ justifyContent: "center", gap: 6, margin: "8px 0 14px" }}>
          <span className="chip c-navy">{KIND_LABEL[c.kind]}</span>
          <span className={`chip ${tone}`}>{TEMP_LABEL[c.temperature]}</span>
          {c.source ? <span className="chip c-gray">מקור: {c.source}</span> : null}
        </div>
        <div className="grid3">
          {c.phone ? (
            <a className="btn bo sm" href={`tel:${c.phone}`}>
              <Icon name="phone" size="sm" />
              חיוג
            </a>
          ) : null}
          {c.phone ? (
            <a className="btn wa sm" href={`https://wa.me/${intlPhone(c.phone)}`} target="_blank" rel="noreferrer">
              <Icon name="msg" size="sm" />
              WhatsApp
            </a>
          ) : null}
          <Link className="btn bp sm" href={`/documents/new?client=${c.id}`}>
            <Icon name="file" size="sm" />
            החתמה
          </Link>
        </div>
      </div>

      {c.wants || c.notes || c.phone ? (
        <div className="card" style={{ marginTop: 12 }}>
          {c.phone ? (
            <div className="row between" style={{ padding: "4px 0" }}>
              <span className="s">טלפון</span>
              <span style={{ direction: "ltr" }}>{prettyPhone(c.phone)}</span>
            </div>
          ) : null}
          {c.wants ? (
            <div className="row between" style={{ padding: "4px 0" }}>
              <span className="s">מחפש/ת</span>
              <span>{c.wants}</span>
            </div>
          ) : null}
          {c.notes ? <p className="s" style={{ marginTop: 6 }}>{c.notes}</p> : null}
        </div>
      ) : null}

      <div className="sec">
        <h3>משימות</h3>
      </div>
      <div className="card">
        {tasks.map((t) => (
          <form key={t.id} action={toggleTask.bind(null, t.id)} className="row" style={{ padding: "6px 0" }}>
            <button
              className="ib"
              style={{ width: 26, height: 26, borderRadius: 8, border: t.done ? 0 : "2px solid #fbbf24", background: t.done ? "var(--teal)" : "#fff", color: "#fff" }}
              aria-label="סימון"
            >
              {t.done ? <Icon name="check" size="sm" /> : null}
            </button>
            <div className="grow" style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--mute)" : undefined }}>
              <div className="t">{t.title}</div>
              {t.due ? <div className="s">{dateHe(t.due)}</div> : null}
            </div>
          </form>
        ))}
        <form action={addTask} className="row" style={{ marginTop: tasks.length ? 8 : 0 }}>
          <input type="hidden" name="client_id" value={c.id} />
          <input className="inp grow" name="title" placeholder="משימה חדשה" required />
          <input className="inp ltr" name="due" type="date" style={{ width: 130 }} />
          <button className="ib" style={{ background: "var(--teal)", color: "#fff" }} aria-label="הוספה">
            <Icon name="plus" />
          </button>
        </form>
      </div>

      {owned.length ? (
        <>
          <div className="sec">
            <h3>נכסים בבעלות</h3>
          </div>
          <div className="stack">
            {owned.map((p) => (
              <Link key={p.id} href={`/properties/${p.id}`} className="card row">
                <div className="thumb" />
                <div className="grow t">{p.address}</div>
                <Icon name="chev" style={{ color: "var(--mute)" }} />
              </Link>
            ))}
          </div>
        </>
      ) : null}

      <div className="sec">
        <h3>מסמכים ({docs.length})</h3>
      </div>
      {docs.length === 0 ? (
        <div className="card s center">עוד אין מסמכים</div>
      ) : (
        <div className="stack">
          {docs.map((d) => (
            <Link key={d.id} href={`/documents/${d.id}`} className="card row">
              <div className="av c-navy">
                <Icon name="file" />
              </div>
              <div className="grow">
                <div className="t ellipsis">{d.title}</div>
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
