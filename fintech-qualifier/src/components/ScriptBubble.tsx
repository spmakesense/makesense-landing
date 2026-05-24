"use client";

interface Props {
  script: string;
  tip?: string;
  agentName?: string;
}

export default function ScriptBubble({ script, tip, agentName }: Props) {
  const displayScript = agentName
    ? script.replace("{agentName}", agentName)
    : script;

  return (
    <div className="mx-4 mb-4">
      {/* Label */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: "#0d21a1" }}
        >
          א
        </div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          מה לומר ללקוח
        </span>
      </div>

      {/* Script bubble */}
      <div
        className="rounded-2xl rounded-tr-sm p-4 text-right"
        style={{
          background: "linear-gradient(135deg, #0d21a1, #1a33c8)",
          color: "#ffffff",
          fontSize: "17px",
          lineHeight: "1.6",
          fontWeight: 500,
          boxShadow: "0 4px 20px rgba(13,33,161,0.25)",
        }}
      >
        {displayScript}
      </div>

      {/* Tip */}
      {tip && (
        <div
          className="mt-2.5 rounded-xl p-3 text-right flex items-start gap-2"
          style={{ background: "#fff8e1", border: "1px solid #FF9D0040" }}
        >
          <span className="text-lg flex-shrink-0 mt-0.5">💡</span>
          <span className="text-sm text-amber-800 font-medium leading-snug">
            {tip}
          </span>
        </div>
      )}
    </div>
  );
}
