"use client";

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full px-4 pt-2 pb-1">
      <div className="flex justify-between text-xs text-gray-400 mb-1 font-medium">
        <span>שלב {current} מתוך ~{total}</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #0d21a1, #3BBDD4)",
          }}
        />
      </div>
    </div>
  );
}
