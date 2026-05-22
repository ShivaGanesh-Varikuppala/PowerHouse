import type { PrismaClient } from "@prisma/client";

type PlanInput = {
  slug: string;
  title: string;
  summary: string;
  category:
    | "STRENGTH" | "HYPERTROPHY" | "CONDITIONING" | "MOBILITY" | "BOXING"
    | "CALISTHENICS" | "FULL_BODY" | "UPPER" | "LOWER" | "PUSH" | "PULL" | "LEGS" | "CORE";
  location: "HOME" | "GYM" | "HYBRID";
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationMin: number;
  estimatedKcal: number;
  goalTags: ("FAT_LOSS" | "MUSCLE_GAIN" | "STRENGTH" | "ENDURANCE" | "ATHLETIC_PERFORMANCE" | "DISCIPLINE" | "BOXING_FITNESS" | "GENERAL_FITNESS")[];
  equipment: (
    | "BODYWEIGHT" | "DUMBBELL" | "BARBELL" | "RESISTANCE_BAND" | "PULL_UP_BAR"
    | "BENCH" | "KETTLEBELL" | "CABLE_MACHINE" | "SMITH_MACHINE"
    | "PUNCHING_BAG" | "JUMP_ROPE" | "BACKPACK" | "MAT"
  )[];
  isFeatured?: boolean;
  exercises: {
    slug: string;
    sets: number;
    reps: string;
    restSec: number;
    tempo?: string;
    notes?: string;
  }[];
};

const PLANS: PlanInput[] = [
  {
    slug: "home-full-body-foundation",
    title: "Foundation — Home Full Body",
    summary: "30-minute bodyweight foundation that hits every major pattern. Built for week one.",
    category: "FULL_BODY",
    location: "HOME",
    level: "BEGINNER",
    durationMin: 30,
    estimatedKcal: 240,
    goalTags: ["GENERAL_FITNESS", "DISCIPLINE", "FAT_LOSS"],
    equipment: ["BODYWEIGHT", "MAT"],
    isFeatured: true,
    exercises: [
      { slug: "jumping-jack", sets: 3, reps: "45s", restSec: 30 },
      { slug: "bodyweight-squat", sets: 4, reps: "12-15", restSec: 45 },
      { slug: "pushup", sets: 4, reps: "8-12", restSec: 60 },
      { slug: "lunge", sets: 3, reps: "10/leg", restSec: 45 },
      { slug: "plank", sets: 3, reps: "30-45s", restSec: 30 },
      { slug: "mountain-climber", sets: 3, reps: "30s", restSec: 30 },
    ],
  },
  {
    slug: "home-conditioning-hiit",
    title: "Burner — Home HIIT",
    summary: "20-minute high-intensity circuit for fat loss and conditioning.",
    category: "CONDITIONING",
    location: "HOME",
    level: "INTERMEDIATE",
    durationMin: 20,
    estimatedKcal: 280,
    goalTags: ["FAT_LOSS", "ENDURANCE", "ATHLETIC_PERFORMANCE"],
    equipment: ["BODYWEIGHT", "MAT"],
    exercises: [
      { slug: "burpee", sets: 5, reps: "10", restSec: 30 },
      { slug: "jump-squat", sets: 5, reps: "15", restSec: 30 },
      { slug: "mountain-climber", sets: 5, reps: "40s", restSec: 30 },
      { slug: "diamond-pushup", sets: 4, reps: "8-12", restSec: 45 },
      { slug: "side-plank", sets: 3, reps: "30s/side", restSec: 30 },
    ],
  },
  {
    slug: "home-backpack-strength",
    title: "Backpack Strength",
    summary: "Use a loaded backpack to mimic dumbbells. Excellent strength stimulus from home.",
    category: "STRENGTH",
    location: "HOME",
    level: "BEGINNER",
    durationMin: 35,
    estimatedKcal: 250,
    goalTags: ["STRENGTH", "MUSCLE_GAIN"],
    equipment: ["BACKPACK", "RESISTANCE_BAND"],
    exercises: [
      { slug: "backpack-goblet-squat", sets: 4, reps: "10-12", restSec: 75 },
      { slug: "backpack-row", sets: 4, reps: "10-12", restSec: 60 },
      { slug: "band-press", sets: 4, reps: "10-12", restSec: 60 },
      { slug: "band-pull-apart", sets: 3, reps: "15", restSec: 45 },
      { slug: "plank", sets: 3, reps: "45s", restSec: 30 },
    ],
  },
  {
    slug: "boxing-shadow-beginner",
    title: "Boxing — Shadow Beginner",
    summary: "Shadow boxing fundamentals: stance, jab-cross, lateral footwork.",
    category: "BOXING",
    location: "HOME",
    level: "BEGINNER",
    durationMin: 25,
    estimatedKcal: 220,
    goalTags: ["BOXING_FITNESS", "ATHLETIC_PERFORMANCE", "DISCIPLINE"],
    equipment: ["BODYWEIGHT", "JUMP_ROPE"],
    isFeatured: true,
    exercises: [
      { slug: "jump-rope", sets: 3, reps: "2min", restSec: 60 },
      { slug: "shadow-boxing", sets: 4, reps: "2min", restSec: 60 },
      { slug: "footwork-ladder", sets: 3, reps: "60s", restSec: 45 },
      { slug: "plank", sets: 3, reps: "45s", restSec: 30 },
    ],
  },
  {
    slug: "boxing-bag-conditioning",
    title: "Boxing — Bag Conditioning",
    summary: "Heavy bag rounds with footwork and core finishers. Builds power and stamina.",
    category: "BOXING",
    location: "HYBRID",
    level: "INTERMEDIATE",
    durationMin: 35,
    estimatedKcal: 360,
    goalTags: ["BOXING_FITNESS", "FAT_LOSS", "ENDURANCE"],
    equipment: ["PUNCHING_BAG", "JUMP_ROPE"],
    exercises: [
      { slug: "jump-rope", sets: 3, reps: "3min", restSec: 60 },
      { slug: "heavy-bag-rounds", sets: 6, reps: "3min", restSec: 60 },
      { slug: "footwork-ladder", sets: 3, reps: "60s", restSec: 30 },
      { slug: "hanging-knee-raise", sets: 3, reps: "10-12", restSec: 45 },
    ],
  },
  {
    slug: "gym-push-day",
    title: "Gym — Push Day",
    summary: "Chest, shoulders, triceps. Compound first, hypertrophy second.",
    category: "PUSH",
    location: "GYM",
    level: "INTERMEDIATE",
    durationMin: 60,
    estimatedKcal: 420,
    goalTags: ["MUSCLE_GAIN", "STRENGTH"],
    equipment: ["BARBELL", "DUMBBELL", "BENCH"],
    isFeatured: true,
    exercises: [
      { slug: "barbell-bench-press", sets: 4, reps: "5-8", restSec: 150 },
      { slug: "barbell-overhead-press", sets: 4, reps: "6-8", restSec: 120 },
      { slug: "dumbbell-bench-press", sets: 3, reps: "8-12", restSec: 90 },
      { slug: "diamond-pushup", sets: 3, reps: "AMRAP", restSec: 60 },
    ],
  },
  {
    slug: "gym-pull-day",
    title: "Gym — Pull Day",
    summary: "Back, biceps, posterior chain.",
    category: "PULL",
    location: "GYM",
    level: "INTERMEDIATE",
    durationMin: 60,
    estimatedKcal: 410,
    goalTags: ["MUSCLE_GAIN", "STRENGTH"],
    equipment: ["BARBELL", "DUMBBELL", "CABLE_MACHINE", "PULL_UP_BAR"],
    exercises: [
      { slug: "barbell-deadlift", sets: 4, reps: "5", restSec: 180, notes: "Reset bar each rep" },
      { slug: "pull-up", sets: 4, reps: "6-10", restSec: 120 },
      { slug: "barbell-row", sets: 4, reps: "8-10", restSec: 90 },
      { slug: "lat-pulldown", sets: 3, reps: "10-12", restSec: 75 },
      { slug: "dumbbell-curl", sets: 3, reps: "10-12", restSec: 60 },
    ],
  },
  {
    slug: "gym-leg-day",
    title: "Gym — Leg Day",
    summary: "Squat-dominant leg session for size and strength.",
    category: "LEGS",
    location: "GYM",
    level: "INTERMEDIATE",
    durationMin: 65,
    estimatedKcal: 480,
    goalTags: ["MUSCLE_GAIN", "STRENGTH"],
    equipment: ["BARBELL", "DUMBBELL", "SMITH_MACHINE"],
    exercises: [
      { slug: "barbell-back-squat", sets: 5, reps: "5", restSec: 180 },
      { slug: "dumbbell-rdl", sets: 4, reps: "8-10", restSec: 90 },
      { slug: "leg-press", sets: 3, reps: "10-12", restSec: 90 },
      { slug: "lunge", sets: 3, reps: "12/leg", restSec: 60 },
      { slug: "plank", sets: 3, reps: "60s", restSec: 45 },
    ],
  },
  {
    slug: "gym-conditioning-finisher",
    title: "Conditioning Finisher",
    summary: "Short, brutal conditioning block for end-of-session work.",
    category: "CONDITIONING",
    location: "GYM",
    level: "INTERMEDIATE",
    durationMin: 18,
    estimatedKcal: 240,
    goalTags: ["FAT_LOSS", "ENDURANCE"],
    equipment: ["KETTLEBELL", "JUMP_ROPE"],
    exercises: [
      { slug: "kettlebell-swing", sets: 5, reps: "20", restSec: 45 },
      { slug: "jump-rope", sets: 4, reps: "90s", restSec: 30 },
      { slug: "burpee", sets: 4, reps: "10", restSec: 45 },
    ],
  },
  {
    slug: "mobility-reset",
    title: "Mobility Reset",
    summary: "Active recovery session for stiff days.",
    category: "MOBILITY",
    location: "HOME",
    level: "BEGINNER",
    durationMin: 15,
    estimatedKcal: 80,
    goalTags: ["GENERAL_FITNESS", "DISCIPLINE"],
    equipment: ["MAT", "RESISTANCE_BAND"],
    exercises: [
      { slug: "band-pull-apart", sets: 3, reps: "15", restSec: 30 },
      { slug: "plank", sets: 2, reps: "30s", restSec: 30 },
      { slug: "side-plank", sets: 2, reps: "20s/side", restSec: 30 },
      { slug: "jumping-jack", sets: 2, reps: "30s", restSec: 30 },
    ],
  },
];

export async function seedWorkouts(prisma: PrismaClient) {
  for (const plan of PLANS) {
    const created = await prisma.workoutPlan.upsert({
      where: { slug: plan.slug },
      update: {
        title: plan.title,
        summary: plan.summary,
        category: plan.category,
        location: plan.location,
        level: plan.level,
        durationMin: plan.durationMin,
        estimatedKcal: plan.estimatedKcal,
        goalTags: plan.goalTags,
        equipment: plan.equipment,
        isFeatured: plan.isFeatured ?? false,
      },
      create: {
        slug: plan.slug,
        title: plan.title,
        summary: plan.summary,
        category: plan.category,
        location: plan.location,
        level: plan.level,
        durationMin: plan.durationMin,
        estimatedKcal: plan.estimatedKcal,
        goalTags: plan.goalTags,
        equipment: plan.equipment,
        isFeatured: plan.isFeatured ?? false,
      },
    });

    // Reset and re-attach exercises in order.
    await prisma.workoutExercise.deleteMany({ where: { planId: created.id } });
    for (let i = 0; i < plan.exercises.length; i++) {
      const item = plan.exercises[i]!;
      const exercise = await prisma.exercise.findUnique({ where: { slug: item.slug } });
      if (!exercise) {
        throw new Error(`Exercise '${item.slug}' missing while seeding plan '${plan.slug}'`);
      }
      await prisma.workoutExercise.create({
        data: {
          planId: created.id,
          exerciseId: exercise.id,
          position: i + 1,
          sets: item.sets,
          reps: item.reps,
          restSec: item.restSec,
          tempo: item.tempo,
          notes: item.notes,
        },
      });
    }
  }
  return PLANS.length;
}
