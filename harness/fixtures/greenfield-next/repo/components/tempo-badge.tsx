export function TempoBadge({ bpm }: { bpm: number }) {
  const tone =
    bpm >= 160 ? "bg-beat text-white" : bpm >= 100 ? "bg-beat-soft text-beat-deep" : "bg-stage-raised text-accent";

  return (
    <span className={`inline-flex items-center rounded-card px-3 py-1 text-sm font-semibold ${tone}`}>
      {bpm} BPM
    </span>
  );
}
