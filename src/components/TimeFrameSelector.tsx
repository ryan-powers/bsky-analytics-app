"use client";

interface TimeOption {
  label: string;
  value: number;
}

interface TimeFrameSelectorProps {
  timeOptions: TimeOption[];
  daysBack: number;
  setDaysBack: (days: number) => void;
}

export default function TimeFrameSelector({
  timeOptions,
  daysBack,
  setDaysBack,
}: TimeFrameSelectorProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {timeOptions.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setDaysBack(value)}
          className={`px-3 py-1 rounded border ${
            daysBack === value ? "bg-blue-500 text-white" : "bg-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
} 