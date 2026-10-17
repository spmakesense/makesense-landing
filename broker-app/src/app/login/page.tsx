import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const user = await currentUser();
  if (user) redirect(user.office_id && user.name && user.license ? "/" : "/onboarding");
  return (
    <main className="page plain" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div className="center" style={{ marginBottom: 28 }}>
        <div className="av xl" style={{ background: "var(--navy)", color: "#fff", margin: "0 auto 14px" }}>
          ח
        </div>
        <h1 style={{ fontSize: 28 }}>חותמים</h1>
        <p className="s">החתמה דיגיטלית וניהול משרד למתווכים</p>
      </div>
      <LoginForm />
    </main>
  );
}
