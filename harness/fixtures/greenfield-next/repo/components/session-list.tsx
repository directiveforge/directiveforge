import { BeatCounter } from "@/components/beat-counter";

export type PracticeSession = {
  id: string;
  label: string;
  bpm: number;
  minutes: number;
};

export function SessionList({ sessions }: { sessions: PracticeSession[] }) {
  if (sessions.length === 0) {
    return (
      <p className="rounded-card bg-stage-raised px-gutter py-6 text-center text-beat-soft">
        No sessions logged yet. Start the metronome and set your first tempo.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {sessions.map((session) => (
        <li key={session.id}>
          <BeatCounter label={session.label} bpm={session.bpm} minutes={session.minutes} />
        </li>
      ))}
    </ul>
  );
}
