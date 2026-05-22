import type { PrismaClient } from "@prisma/client";

type MealInput = {
  slug: string;
  title: string;
  slot: "BREAKFAST" | "SNACK_AM" | "LUNCH" | "SNACK_PM" | "DINNER" | "POST_WORKOUT";
  budget: "BASIC" | "MODERATE" | "PREMIUM";
  dietPref: "VEGETARIAN" | "NON_VEGETARIAN" | "VEGAN" | "EGGETARIAN";
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  instructions: string;
  items: { food: string; grams: number }[];
};

const MEALS: MealInput[] = [
  // BASIC + VEG
  {
    slug: "basic-veg-oats-banana",
    title: "Oats + Banana + Peanuts",
    slot: "BREAKFAST",
    budget: "BASIC",
    dietPref: "VEGETARIAN",
    calories: 520, proteinG: 22, carbsG: 78, fatG: 14,
    instructions: "Cook 80g oats in milk. Slice 1 banana on top, sprinkle 15g roasted peanuts.",
    items: [{ food: "oats-basic", grams: 80 }, { food: "milk", grams: 200 }, { food: "banana", grams: 120 }, { food: "peanuts", grams: 15 }],
  },
  {
    slug: "basic-veg-dal-rice",
    title: "Dal + Rice + Roti",
    slot: "LUNCH",
    budget: "BASIC",
    dietPref: "VEGETARIAN",
    calories: 620, proteinG: 26, carbsG: 105, fatG: 9,
    instructions: "Bowl of dal, 1 cup rice, 2 rotis. Add a glass of buttermilk if available.",
    items: [{ food: "dal", grams: 200 }, { food: "rice", grams: 150 }, { food: "roti", grams: 80 }],
  },
  {
    slug: "basic-veg-soy-rice",
    title: "Soy Chunk Curry + Brown Rice",
    slot: "DINNER",
    budget: "BASIC",
    dietPref: "VEGETARIAN",
    calories: 560, proteinG: 38, carbsG: 78, fatG: 6,
    instructions: "Pressure cook 60g soy chunks in tomato gravy. Serve with 180g brown rice.",
    items: [{ food: "soy-chunks", grams: 150 }, { food: "brown-rice", grams: 180 }],
  },
  // BASIC + EGG / NON-VEG
  {
    slug: "basic-egg-rice",
    title: "Egg Bhurji + Roti",
    slot: "BREAKFAST",
    budget: "BASIC",
    dietPref: "EGGETARIAN",
    calories: 540, proteinG: 35, carbsG: 56, fatG: 18,
    instructions: "3 whole eggs scrambled with onion + tomato. 2 rotis on the side.",
    items: [{ food: "egg", grams: 150 }, { food: "roti", grams: 80 }],
  },
  {
    slug: "basic-eggs-banana-milk",
    title: "4 Eggs + Banana + Milk",
    slot: "POST_WORKOUT",
    budget: "BASIC",
    dietPref: "EGGETARIAN",
    calories: 490, proteinG: 34, carbsG: 38, fatG: 22,
    instructions: "2 whole + 2 whites scrambled, banana, glass of milk.",
    items: [{ food: "egg", grams: 100 }, { food: "egg-whites", grams: 80 }, { food: "banana", grams: 120 }, { food: "milk", grams: 250 }],
  },
  // MODERATE + VEG
  {
    slug: "moderate-veg-paneer-roti",
    title: "Paneer Bhurji + Roti",
    slot: "DINNER",
    budget: "MODERATE",
    dietPref: "VEGETARIAN",
    calories: 590, proteinG: 38, carbsG: 52, fatG: 24,
    instructions: "100g paneer bhurji with onion/capsicum, 2 rotis.",
    items: [{ food: "paneer", grams: 120 }, { food: "roti", grams: 80 }],
  },
  {
    slug: "moderate-veg-curd-oats",
    title: "Curd + Steel Cut Oats Bowl",
    slot: "BREAKFAST",
    budget: "MODERATE",
    dietPref: "VEGETARIAN",
    calories: 480, proteinG: 28, carbsG: 62, fatG: 11,
    instructions: "60g steel cut oats with 150g greek curd, banana, peanuts.",
    items: [{ food: "oats-moderate", grams: 60 }, { food: "curd", grams: 150 }, { food: "banana", grams: 100 }, { food: "peanuts", grams: 10 }],
  },
  // MODERATE + NON-VEG
  {
    slug: "moderate-nonveg-chicken-rice",
    title: "Grilled Chicken + Rice + Salad",
    slot: "LUNCH",
    budget: "MODERATE",
    dietPref: "NON_VEGETARIAN",
    calories: 620, proteinG: 55, carbsG: 60, fatG: 14,
    instructions: "150g grilled chicken breast, 180g rice, side salad with olive oil.",
    items: [{ food: "chicken-breast", grams: 150 }, { food: "rice", grams: 180 }],
  },
  {
    slug: "moderate-nonveg-chicken-roti",
    title: "Chicken Curry + Roti",
    slot: "DINNER",
    budget: "MODERATE",
    dietPref: "NON_VEGETARIAN",
    calories: 580, proteinG: 50, carbsG: 48, fatG: 18,
    instructions: "150g chicken curry, 2 rotis.",
    items: [{ food: "chicken-breast", grams: 150 }, { food: "roti", grams: 80 }],
  },
  // PREMIUM
  {
    slug: "premium-salmon-rice",
    title: "Salmon + Brown Rice + Avocado",
    slot: "DINNER",
    budget: "PREMIUM",
    dietPref: "NON_VEGETARIAN",
    calories: 690, proteinG: 44, carbsG: 60, fatG: 26,
    instructions: "180g salmon (pan-seared), 150g brown rice, ½ avocado, lemon-pepper.",
    items: [{ food: "salmon", grams: 180 }, { food: "brown-rice", grams: 150 }, { food: "avocado", grams: 80 }],
  },
  {
    slug: "premium-whey-banana",
    title: "Whey + Banana + Almonds",
    slot: "POST_WORKOUT",
    budget: "PREMIUM",
    dietPref: "VEGETARIAN",
    calories: 380, proteinG: 33, carbsG: 35, fatG: 12,
    instructions: "30g whey in water, banana, 15g almonds.",
    items: [{ food: "whey", grams: 30 }, { food: "banana", grams: 120 }, { food: "almonds", grams: 15 }],
  },
  // Snacks
  {
    slug: "snack-curd-banana",
    title: "Curd + Banana",
    slot: "SNACK_PM",
    budget: "MODERATE",
    dietPref: "VEGETARIAN",
    calories: 230, proteinG: 16, carbsG: 28, fatG: 6,
    instructions: "150g greek curd, sliced banana, drizzle of honey.",
    items: [{ food: "curd", grams: 150 }, { food: "banana", grams: 100 }],
  },
  {
    slug: "snack-peanuts-banana",
    title: "Peanuts + Banana",
    slot: "SNACK_AM",
    budget: "BASIC",
    dietPref: "VEGETARIAN",
    calories: 280, proteinG: 9, carbsG: 30, fatG: 14,
    instructions: "Handful of peanuts (25g) and a banana.",
    items: [{ food: "peanuts", grams: 25 }, { food: "banana", grams: 120 }],
  },
];

export async function seedMeals(prisma: PrismaClient) {
  for (const m of MEALS) {
    const created = await prisma.meal.upsert({
      where: { slug: m.slug },
      update: {
        title: m.title, slot: m.slot, budget: m.budget, dietPref: m.dietPref,
        calories: m.calories, proteinG: m.proteinG, carbsG: m.carbsG, fatG: m.fatG,
        instructions: m.instructions,
      },
      create: {
        slug: m.slug, title: m.title, slot: m.slot, budget: m.budget, dietPref: m.dietPref,
        calories: m.calories, proteinG: m.proteinG, carbsG: m.carbsG, fatG: m.fatG,
        instructions: m.instructions,
      },
    });
    await prisma.mealItem.deleteMany({ where: { mealId: created.id } });
    for (const item of m.items) {
      const food = await prisma.foodItem.findUnique({ where: { slug: item.food } });
      if (!food) throw new Error(`Food '${item.food}' missing while seeding meal '${m.slug}'`);
      await prisma.mealItem.create({
        data: { mealId: created.id, foodId: food.id, grams: item.grams },
      });
    }
  }
  return MEALS.length;
}

export const MEAL_SLUGS = MEALS.map((m) => m.slug);
