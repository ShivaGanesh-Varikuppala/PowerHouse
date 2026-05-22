import type { PrismaClient } from "@prisma/client";

type TaskInput = {
  slug: string;
  title: string;
  description: string;
  category: "MIND" | "BODY" | "HABIT" | "MEDITATION" | "JOURNALING" | "RECOVERY" | "SLEEP" | "HYDRATION";
  xpReward: number;
  durationMin?: number;
};

const TASKS: TaskInput[] = [
  { slug: "wake-5-30", title: "Wake at 5:30 AM", description: "Build the discipline foundation with an early wake-up.", category: "HABIT", xpReward: 15 },
  { slug: "cold-shower", title: "Cold Shower (60s)", description: "60 seconds of cold exposure for resilience.", category: "RECOVERY", xpReward: 10, durationMin: 2 },
  { slug: "meditate-10", title: "10-Minute Meditation", description: "Focused breath awareness session.", category: "MEDITATION", xpReward: 15, durationMin: 10 },
  { slug: "breathing-box", title: "Box Breathing (4-4-4-4)", description: "4 minutes of box breathing for nervous-system control.", category: "MEDITATION", xpReward: 10, durationMin: 4 },
  { slug: "journal-evening", title: "Evening Journal Entry", description: "Reflect on wins, losses and tomorrow's intentions.", category: "JOURNALING", xpReward: 10, durationMin: 10 },
  { slug: "hydrate-3l", title: "Drink 3L Water", description: "Daily hydration target.", category: "HYDRATION", xpReward: 10 },
  { slug: "sleep-7h", title: "Sleep 7+ Hours", description: "Recovery comes from sleep.", category: "SLEEP", xpReward: 20 },
  { slug: "no-screens-1h", title: "No Screens 60min Before Bed", description: "Protect sleep quality.", category: "SLEEP", xpReward: 10 },
  { slug: "walk-30min", title: "30-Minute Walk", description: "Easy aerobic baseline.", category: "BODY", xpReward: 10, durationMin: 30 },
  { slug: "deep-work-90", title: "90-Minute Deep Work Block", description: "Single-task on the most important thing.", category: "MIND", xpReward: 25, durationMin: 90 },
];

export async function seedDiscipline(prisma: PrismaClient) {
  for (const t of TASKS) {
    await prisma.disciplineTask.upsert({ where: { slug: t.slug }, update: t, create: t });
  }
  return TASKS.length;
}
