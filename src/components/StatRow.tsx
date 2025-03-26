'use client';

type StatRowProps = {
    icon: string;
    label: string;
    value: string | number;
  };
  
export default function StatRow({ icon, label, value }: StatRowProps) {
    return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-gray-700">
        <span className="text-lg">{icon}</span>
        <span>{label}:</span>
      </span>
      <span className="font-semibold text-lg tabular-nums">{value}</span>
    </div>
  )
}