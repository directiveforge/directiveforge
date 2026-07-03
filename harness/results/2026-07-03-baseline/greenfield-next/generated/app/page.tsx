import { SessionList, type PracticeSession } from "@/components/session-list";

const SEED_SESSIONS: PracticeSession[] = [
  { id: "s1", label: "Paradiddle warm-up", bpm: 90, minutes: 12 },
  { id: "s2", label: "Single-stroke roll", bpm: 128, minutes: 18 },
  { id: "s3", label: "Double bass burst", bpm: 172, minutes: 9 },
];

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Tempo Deck";

export function HomePage() {
  const totalMinutes = SEED_SESSIONS.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-beat">{APP_NAME}</h1>
        <p className="text-beat-soft">
          {totalMinutes} minutes on the click this week. Keep the tempo climbing.
        </p>
      </header>

      <SessionList sessions={SEED_SESSIONS} />
    </main>
  );
}

export default HomePage;
