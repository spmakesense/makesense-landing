import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Icon } from "@/components/Icon";
import { Avatar, Header } from "@/components/ui";
import { requireCtx } from "@/lib/auth";

export default async function More() {
  const { user, office } = await requireCtx();
  const items = [
    { href: "/documents", icon: "file", label: "מסמכים", sub: "ארכיון, סטטוסים והעתקים חתומים" },
    { href: "/deals", icon: "case", label: "עסקאות ועמלות", sub: "מליד ועד תשלום" },
    { href: "/team", icon: "chart", label: user.role === "manager" ? "המשרד שלי" : "הצוות", sub: "סוכנים וביצועים" },
    { href: "/verify", icon: "shield", label: "אימות מסמך", sub: "בדיקה שקובץ PDF לא שונה" },
    { href: "/settings", icon: "gear", label: "הגדרות", sub: "פרופיל, חתימה, עמלות ושליחת העתקים" },
  ];
  return (
    <main className="page">
      <Header title="עוד" start />
      <div className="card row" style={{ marginBottom: 14 }}>
        <Avatar name={user.name} tone="c-navy" />
        <div className="grow">
          <div className="t">{user.name}</div>
          <div className="s">
            {office.name} · רישיון {user.license}
          </div>
        </div>
      </div>
      <div className="stack">
        {items.map((i) => (
          <Link key={i.href} href={i.href} className="card row">
            <div className="av c-navy">
              <Icon name={i.icon} />
            </div>
            <div className="grow">
              <div className="t">{i.label}</div>
              <div className="s">{i.sub}</div>
            </div>
            <Icon name="chev" style={{ color: "var(--mute)" }} />
          </Link>
        ))}
      </div>
      <form action={logout}>
        <button className="btn bo" style={{ marginTop: 20 }}>
          <Icon name="logout" />
          יציאה
        </button>
      </form>
    </main>
  );
}
