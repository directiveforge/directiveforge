import { TempoBadge } from "@/components/tempo-badge";

export function BeatCounter({
  label,
  bpm,
  minutes,
}: {
  label: string;
  bpm: number;
  minutes: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-card bg-stage-raised px-gutter py-4">
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-beat-soft">{minutes} min practiced</p>
      </div>
      <TempoBadge bpm={bpm} />
    </div>
  );
}
