"use client";

import { useTransition } from "react";
import { disconnectDriveAction, setDriveAuto } from "@/app/actions/documents";
import { Icon } from "@/components/Icon";

export function DriveCard({ configured, email, auto }: { configured: boolean; email: string | null; auto: boolean }) {
  const [pending, start] = useTransition();
  return (
    <>
      <div className="lbl">Google Drive</div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row">
          <div className="av" style={{ background: email ? "#dcfce7" : "#eef0f5", color: email ? "#15803d" : "var(--mute)" }}>
            <Icon name="cloud" />
          </div>
          <div className="grow">
            <div className="t">{email ? "מחובר ל-Google Drive" : "שמירת הסכמים ב-Google Drive"}</div>
            <div className="s ellipsis" style={{ direction: email ? "ltr" : undefined, textAlign: "right" }}>
              {email ?? "כל הסכם חתום יישמר בתיקייה לפי נכס"}
            </div>
          </div>
        </div>
        {email ? (
          <>
            <label className="chk" style={{ marginTop: 8 }}>
              <input type="checkbox" checked={auto} disabled={pending} onChange={(e) => start(() => setDriveAuto(e.target.checked))} />
              <span>שמירה אוטומטית של כל הסכם חתום בתיקייה &quot;חותמים – הסכמים חתומים&quot;</span>
            </label>
            <button className="btn bd xs" style={{ marginTop: 6 }} disabled={pending} onClick={() => confirm("לנתק את Google Drive? הקבצים שכבר נשמרו יישארו ב-Drive.") && start(() => disconnectDriveAction())}>
              ניתוק
            </button>
          </>
        ) : (
          <a className="btn bo sm" style={{ marginTop: 10 }} href="/api/google/connect" aria-disabled={!configured}>
            <Icon name="cloud" size="sm" />
            חיבור Google Drive
          </a>
        )}
      </div>
    </>
  );
}
