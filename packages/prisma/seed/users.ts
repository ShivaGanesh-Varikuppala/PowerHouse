import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Two pre-seeded accounts so the README can point at real credentials.
//
//   alex@powerhouse.dev / demopass123  — fully onboarded, has 1 push session,
//                                        1 boxing session, 3 discipline logs,
//                                        2 diet logs (good for screenshots).
//   jordan@powerhouse.dev / demopass123 — fresh account, no onboarding yet
//                                        (good for testing the onboarding flow).
//
// Passwords are bcrypt-hashed on seed.

const DEMO_PASSWORD = "demopass123";

export async function seedDemoUsers(prisma: PrismaClient) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // 1. Fresh user — onboarding intentionally not completed.
  await prisma.user.upsert({
    where: { email: "jordan@powerhouse.dev" },
    update: {},
    create: {
      email: "jordan@powerhouse.dev",
      passwordHash,
      name: "Jordan Fresh",
      streak: { create: {} },
    },
  });

  // 2. Fully onboarded user with rich history.
  const alex = await prisma.user.upsert({
    where: { email: "alex@powerhouse.dev" },
    update: {},
    create: {
      email: "alex@powerhouse.dev",
      passwordHash,
      name: "Alex Demo",
      onboardedAt: new Date(),
      streak: { create: {} },
    },
  });

  await prisma.profile.upsert({
    where: { userId: alex.id },
    update: {},
    create: {
      userId: alex.id,
      age: 29,
      gender: "MALE",
      heightCm: 178,
      weightKg: 76,
      fitnessLevel: "INTERMEDIATE",
      bodyType: "MESOMORPH",
      trainingLocation: "HYBRID",
      budgetLevel: "MODERATE",
      dietPreference: "NON_VEGETARIAN",
      boxingExperience: "BEGINNER",
      sleepQuality: 7,
      dailyFreeMinutes: 75,
      goals: ["MUSCLE_GAIN", "BOXING_FITNESS", "DISCIPLINE"],
      equipment: ["BODYWEIGHT", "MAT", "DUMBBELL", "BARBELL", "BENCH", "JUMP_ROPE", "PUNCHING_BAG"],
    },
  });

  // Idempotent history: only seed sessions if Alex has none.
  const existingSessions = await prisma.workoutSession.count({ where: { userId: alex.id } });
  if (existingSessions === 0) {
    const pushPlan = await prisma.workoutPlan.findUnique({ where: { slug: "gym-push-day" } });
    if (pushPlan) {
      const session = await prisma.workoutSession.create({
        data: {
          userId: alex.id,
          planId: pushPlan.id,
          startedAt: new Date(),
          completedAt: new Date(),
          durationSec: 3300,
          totalVolumeKg: 1440,
          caloriesBurned: 420,
          xpEarned: 98,
        },
      });

      const benchExId = (await prisma.exercise.findUnique({ where: { slug: "barbell-bench-press" } }))?.id;
      const dbBenchId = (await prisma.exercise.findUnique({ where: { slug: "dumbbell-bench-press" } }))?.id;

      if (benchExId && dbBenchId) {
        for (let i = 1; i <= 3; i++) {
          await prisma.sessionExercise.create({
            data: { sessionId: session.id, exerciseId: benchExId, setIndex: i, reps: 8, weightKg: 60 },
          });
          await prisma.sessionExercise.create({
            data: { sessionId: session.id, exerciseId: dbBenchId, setIndex: i, reps: 10, weightKg: 22 },
          });
        }
      }
    }

    await prisma.boxingSession.create({
      data: {
        userId: alex.id,
        rounds: 4,
        roundSec: 180,
        restSec: 60,
        focus: "jab-cross + footwork",
        startedAt: new Date(),
        completedAt: new Date(),
        xpEarned: 80,
      },
    });

    // Streak bookkeeping (1 day + total xp from the two sessions above)
    await prisma.streak.update({
      where: { userId: alex.id },
      data: { currentDays: 1, longestDays: 1, totalXp: 178, transformationScore: 132, level: 1 },
    });

    // Diet logs for today
    await prisma.dietLog.create({ data: { userId: alex.id, calories: 680, proteinG: 48, waterMl: 1200 } });
    await prisma.dietLog.create({ data: { userId: alex.id, calories: 520, proteinG: 42, waterMl: 900 } });

    // Discipline logs for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const slug of ["hydrate-3l", "meditate-10", "cold-shower"]) {
      const task = await prisma.disciplineTask.findUnique({ where: { slug } });
      if (task) {
        await prisma.habitLog.upsert({
          where: { userId_taskId_date: { userId: alex.id, taskId: task.id, date: today } },
          update: {},
          create: { userId: alex.id, taskId: task.id, date: today },
        });
      }
    }
  }

  return 2;
}

export const DEMO_CREDENTIALS = [
  { email: "alex@powerhouse.dev", password: DEMO_PASSWORD, note: "fully onboarded with workout/boxing/diet history" },
  { email: "jordan@powerhouse.dev", password: DEMO_PASSWORD, note: "fresh account — use to test the onboarding flow" },
];
