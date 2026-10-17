import Link from "next/link";
import { Icon } from "@/components/Icon";
import { VerifyForm } from "./VerifyForm";

export const metadata = { title: "אימות מסמך חתום" };

export default function VerifyPage() {
  return (
    <main className="page plain">
      <header className="hdr">
        <Link href="/" className="ib" aria-label="חזרה">
          <Icon name="back" />
        </Link>
        <h1>אימות מסמך</h1>
        <span className="spacer" />
      </header>
      <p className="s" style={{ marginBottom: 14 }}>
        העלו קובץ PDF שנחתם בחותמים. נבדוק שהוא זהה בדיוק לקובץ שנחתם ונשמר – בלי שום שינוי.
      </p>
      <VerifyForm />
    </main>
  );
}
