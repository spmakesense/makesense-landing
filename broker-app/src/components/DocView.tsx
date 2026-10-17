import type { Block } from "@/lib/templates";

/** Renders template blocks as HTML (same blocks the PDF is drawn from). */
export function DocView({ blocks, signers }: { blocks: Block[]; signers: { name: string; id_number: string; phone: string | null }[] }) {
  return (
    <div className="doc">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h":
            return <h4 key={i}>{b.text}</h4>;
          case "p":
            return <p key={i}>{b.text}</p>;
          case "note":
            return (
              <p key={i} className="note">
                {b.text}
              </p>
            );
          case "kv":
            return (
              <table key={i}>
                <tbody>
                  {b.rows.map(([k, v], j) => (
                    <tr key={j}>
                      <td>{k}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "checks":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j} className={it.on ? "" : "off"}>
                    <b>{it.on ? "☑" : "☐"}</b>
                    <span>{it.label}</span>
                  </li>
                ))}
              </ul>
            );
          case "signers":
            return (
              <table key={i}>
                <tbody>
                  {signers.map((s, j) => (
                    <tr key={j}>
                      <td>{s.name}</td>
                      <td>{s.id_number ? `ת״ז ${s.id_number}` : "ת״ז תמולא בחתימה"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
        }
      })}
    </div>
  );
}
