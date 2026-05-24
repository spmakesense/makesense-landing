"use client";

interface Props {
  score: number;
  size?: number;
}

export default function LeadScoreRing({ score, size = 120 }: Props) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70 ? "#16a34a" : score >= 45 ? "#FF9D00" : "#dc2626";

  const label =
    score >= 70 ? "גבוה" : score >= 45 ? "בינוני" : "נמוך";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={10}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-gray-400 font-semibold">{label}</span>
        </div>
      </div>
      <span className="text-sm text-gray-500 mt-1 font-medium">ציון ליד</span>
    </div>
  );
}
