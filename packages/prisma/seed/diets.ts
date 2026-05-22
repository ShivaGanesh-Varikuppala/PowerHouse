import type { PrismaClient } from "@prisma/client";

type DietPlanInput = {
  slug: string;
  title: string;
  summary: string;
  goal: "FAT_LOSS" | "MUSCLE_GAIN" | "STRENGTH" | "ENDURANCE" | "ATHLETIC_PERFORMANCE" | "DISCIPLINE" | "BOXING_FITNESS" | "GENERAL_FITNESS";
  budget: "BASIC" | "MODERATE" | "PREMIUM";
  dietPref: "VEGETARIAN" | "NON_VEGETARIAN" | "VEGAN" | "EGGETARIAN";
  dailyKcal: number;
  dailyProteinG: number;
  weeklyMeals: string[]; // meal slugs for day 0 (we repeat across days)
};

const DIET_PLANS: DietPlanInput[] = [
  {
    slug: "fat-loss-basic-veg",
    title: "Fat Loss — Basic Budget Veg",
    summary: "1800 kcal vegetarian fat-loss plan on a basic budget. High protein from dal, soy, milk.",
    goal: "FAT_LOSS",
    budget: "BASIC",
    dietPref: "VEGETARIAN",
    dailyKcal: 1800,
    dailyProteinG: 130,
    weeklyMeals: ["basic-veg-oats-banana", "snack-peanuts-banana", "basic-veg-dal-rice", "snack-curd-banana", "basic-veg-soy-rice"],
  },
  {
    slug: "fat-loss-moderate-nonveg",
    title: "Fat Loss — Moderate Non-Veg",
    summary: "1900 kcal cut for non-vegetarians, paneer + chicken anchored.",
    goal: "FAT_LOSS",
    budget: "MODERATE",
    dietPref: "NON_VEGETARIAN",
    dailyKcal: 1900,
    dailyProteinG: 160,
    weeklyMeals: ["moderate-veg-curd-oats", "snack-peanuts-banana", "moderate-nonveg-chicken-rice", "snack-curd-banana", "moderate-nonveg-chicken-roti"],
  },
  {
    slug: "muscle-gain-basic-egg",
    title: "Muscle Gain — Basic Eggetarian",
    summary: "2600 kcal lean bulk on basic budget using eggs, milk, dal, roti.",
    goal: "MUSCLE_GAIN",
    budget: "BASIC",
    dietPref: "EGGETARIAN",
    dailyKcal: 2600,
    dailyProteinG: 170,
    weeklyMeals: ["basic-egg-rice", "snack-peanuts-banana", "basic-veg-dal-rice", "basic-eggs-banana-milk", "basic-veg-soy-rice"],
  },
  {
    slug: "muscle-gain-moderate-veg",
    title: "Muscle Gain — Moderate Veg",
    summary: "2700 kcal vegetarian lean bulk with paneer, curd, oats.",
    goal: "MUSCLE_GAIN",
    budget: "MODERATE",
    dietPref: "VEGETARIAN",
    dailyKcal: 2700,
    dailyProteinG: 175,
    weeklyMeals: ["moderate-veg-curd-oats", "snack-peanuts-banana", "basic-veg-dal-rice", "snack-curd-banana", "moderate-veg-paneer-roti"],
  },
  {
    slug: "muscle-gain-premium-nonveg",
    title: "Muscle Gain — Premium Non-Veg",
    summary: "2900 kcal performance plan with salmon, whey, almonds.",
    goal: "MUSCLE_GAIN",
    budget: "PREMIUM",
    dietPref: "NON_VEGETARIAN",
    dailyKcal: 2900,
    dailyProteinG: 200,
    weeklyMeals: ["moderate-veg-curd-oats", "premium-whey-banana", "moderate-nonveg-chicken-rice", "snack-curd-banana", "premium-salmon-rice"],
  },
  {
    slug: "maintenance-basic-veg",
    title: "Maintenance — Basic Veg",
    summary: "2200 kcal balanced maintenance.",
    goal: "GENERAL_FITNESS",
    budget: "BASIC",
    dietPref: "VEGETARIAN",
    dailyKcal: 2200,
    dailyProteinG: 130,
    weeklyMeals: ["basic-veg-oats-banana", "snack-peanuts-banana", "basic-veg-dal-rice", "snack-curd-banana", "basic-veg-soy-rice"],
  },
];

export async function seedDiets(prisma: PrismaClient) {
  for (const p of DIET_PLANS) {
    const plan = await prisma.dietPlan.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title, summary: p.summary, goal: p.goal, budget: p.budget,
        dietPref: p.dietPref, dailyKcal: p.dailyKcal, dailyProteinG: p.dailyProteinG,
      },
      create: {
        slug: p.slug, title: p.title, summary: p.summary, goal: p.goal, budget: p.budget,
        dietPref: p.dietPref, dailyKcal: p.dailyKcal, dailyProteinG: p.dailyProteinG,
      },
    });
    await prisma.dietPlanMeal.deleteMany({ where: { planId: plan.id } });
    for (let day = 0; day < 7; day++) {
      for (const slug of p.weeklyMeals) {
        const meal = await prisma.meal.findUnique({ where: { slug } });
        if (!meal) throw new Error(`Meal '${slug}' missing while seeding diet '${p.slug}'`);
        await prisma.dietPlanMeal.create({
          data: { planId: plan.id, mealId: meal.id, dayOfWeek: day },
        });
      }
    }
  }
  return DIET_PLANS.length;
}
