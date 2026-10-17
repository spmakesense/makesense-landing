"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const TABS = [
  { href: "/", label: "בית", icon: "home" },
  { href: "/clients", label: "לקוחות", icon: "users" },
  { href: "/documents/new", label: "", icon: "plus", fab: true },
  { href: "/properties", label: "נכסים", icon: "bld" },
  { href: "/more", label: "עוד", icon: "menu" },
];

const MORE = ["/more", "/documents", "/deals", "/team", "/settings", "/tasks"];

export function TabBar() {
  const path = usePathname();
  const active = (href: string) => {
    if (href === "/") return path === "/";
    if (href === "/more") return MORE.some((p) => path === p || (path.startsWith(p + "/") && !path.startsWith("/documents/new")));
    return path.startsWith(href);
  };
  return (
    <nav className="tab" aria-label="ניווט ראשי">
      {TABS.map((t) =>
        t.fab ? (
          <Link key={t.href} href={t.href} className="fab" aria-label="החתמה חדשה">
            <Icon name="plus" size="lg" />
          </Link>
        ) : (
          <Link key={t.href} href={t.href} className={active(t.href) ? "on" : ""}>
            <Icon name={t.icon} />
            {t.label}
          </Link>
        ),
      )}
    </nav>
  );
}
