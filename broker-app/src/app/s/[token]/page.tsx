import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { get } from "@/lib/db";
import { loadDoc, renderCtx } from "@/lib/documents";
import { maskId } from "@/lib/format";
import { annexBlocks, getTemplate } from "@/lib/templates";
import type { Signer } from "@/lib/types";
import { SignFlow } from "./SignFlow";

export const metadata: Metadata = { title: "חתימה על מסמך", robots: { index: false } };

export default async function SignPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ inperson?: string; back?: string }> }) {
  const { token } = await params;
  const sp = await searchParams;
  const signer = await get<Signer>("SELECT * FROM signers WHERE token = ?", token);
  if (!signer) notFound();
  const f = (await loadDoc(signer.document_id))!;
  const t = getTemplate(f.doc.template)!;
  const ctx = renderCtx(f);
  // Other signers' ID numbers are masked on this public page.
  const signersView = ctx.signers.map((s, i) => ({ ...s, id_number: f.signers[i].id === signer.id ? s.id_number : maskId(s.id_number) }));
  const isPrimary = signer.position === 0 && Boolean(t.primarySections);
  let blocks = t.build({ ...ctx, signers: signersView });
  if (isPrimary) {
    const titles = new Set(t.primarySections!.map((s) => s.title));
    blocks = blocks.filter((b, i) => !(b.t === "h" && titles.has(b.text)) && !(b.t === "kv" && blocks[i - 1]?.t === "h" && titles.has((blocks[i - 1] as { text: string }).text)));
  }
  const values = JSON.parse(signer.values_json);

  return (
    <main className="page plain">
      <SignFlow
        token={token}
        inPerson={sp.inperson === "1"}
        backTo={sp.inperson === "1" && sp.back === f.doc.id ? `/documents/${f.doc.id}` : null}
        templateKey={t.key}
        title={t.title}
        docTitle={f.doc.title}
        office={f.office.name}
        agent={`${f.agent.name ?? ""} · רישיון ${f.agent.license ?? ""}`}
        status={f.doc.status}
        signerStatus={signer.status}
        signerName={String(values.name || signer.name)}
        isPrimary={isPrimary}
        blocks={blocks}
        signers={signersView}
        annex={f.annex && !signer.annex_signed_at ? annexBlocks(f.annex, ctx) : null}
        shareToken={f.doc.status === "signed" ? f.doc.share_token : null}
      />
    </main>
  );
}
