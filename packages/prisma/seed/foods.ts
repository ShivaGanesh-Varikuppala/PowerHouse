import type { PrismaClient } from "@prisma/client";

type FoodInput = {
  slug: string;
  name: string;
  caloriesPer100: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  budget: "BASIC" | "MODERATE" | "PREMIUM";
  vegFriendly: boolean;
  veganFriendly: boolean;
};

const FOODS: FoodInput[] = [
  // Basic budget
  { slug: "egg", name: "Whole Eggs", caloriesPer100: 155, proteinPer100: 13, carbsPer100: 1.1, fatPer100: 11, budget: "BASIC", vegFriendly: false, veganFriendly: false },
  { slug: "egg-whites", name: "Egg Whites", caloriesPer100: 52, proteinPer100: 11, carbsPer100: 0.7, fatPer100: 0.2, budget: "BASIC", vegFriendly: false, veganFriendly: false },
  { slug: "rice", name: "Cooked White Rice", caloriesPer100: 130, proteinPer100: 2.7, carbsPer100: 28, fatPer100: 0.3, budget: "BASIC", vegFriendly: true, veganFriendly: true },
  { slug: "brown-rice", name: "Cooked Brown Rice", caloriesPer100: 112, proteinPer100: 2.6, carbsPer100: 24, fatPer100: 0.9, budget: "BASIC", vegFriendly: true, veganFriendly: true },
  { slug: "dal", name: "Cooked Dal (Lentils)", caloriesPer100: 116, proteinPer100: 9, carbsPer100: 20, fatPer100: 0.4, budget: "BASIC", vegFriendly: true, veganFriendly: true },
  { slug: "milk", name: "Toned Milk", caloriesPer100: 56, proteinPer100: 3.2, carbsPer100: 4.7, fatPer100: 3, budget: "BASIC", vegFriendly: true, veganFriendly: false },
  { slug: "banana", name: "Banana", caloriesPer100: 89, proteinPer100: 1.1, carbsPer100: 23, fatPer100: 0.3, budget: "BASIC", vegFriendly: true, veganFriendly: true },
  { slug: "peanuts", name: "Roasted Peanuts", caloriesPer100: 567, proteinPer100: 26, carbsPer100: 16, fatPer100: 49, budget: "BASIC", vegFriendly: true, veganFriendly: true },
  { slug: "roti", name: "Whole Wheat Roti", caloriesPer100: 270, proteinPer100: 9, carbsPer100: 50, fatPer100: 4, budget: "BASIC", vegFriendly: true, veganFriendly: true },
  { slug: "soy-chunks", name: "Soy Chunks (Cooked)", caloriesPer100: 173, proteinPer100: 32, carbsPer100: 9, fatPer100: 0.5, budget: "BASIC", vegFriendly: true, veganFriendly: true },
  { slug: "oats-basic", name: "Plain Rolled Oats", caloriesPer100: 389, proteinPer100: 17, carbsPer100: 66, fatPer100: 7, budget: "BASIC", vegFriendly: true, veganFriendly: true },
  // Moderate budget
  { slug: "paneer", name: "Paneer", caloriesPer100: 296, proteinPer100: 21, carbsPer100: 4, fatPer100: 22, budget: "MODERATE", vegFriendly: true, veganFriendly: false },
  { slug: "curd", name: "Greek Curd", caloriesPer100: 97, proteinPer100: 10, carbsPer100: 3.6, fatPer100: 5, budget: "MODERATE", vegFriendly: true, veganFriendly: false },
  { slug: "chicken-breast", name: "Grilled Chicken Breast", caloriesPer100: 165, proteinPer100: 31, carbsPer100: 0, fatPer100: 3.6, budget: "MODERATE", vegFriendly: false, veganFriendly: false },
  { slug: "oats-moderate", name: "Steel Cut Oats", caloriesPer100: 379, proteinPer100: 13, carbsPer100: 68, fatPer100: 6.5, budget: "MODERATE", vegFriendly: true, veganFriendly: true },
  { slug: "tofu", name: "Firm Tofu", caloriesPer100: 144, proteinPer100: 17, carbsPer100: 3, fatPer100: 8, budget: "MODERATE", vegFriendly: true, veganFriendly: true },
  // Premium budget
  { slug: "salmon", name: "Atlantic Salmon", caloriesPer100: 208, proteinPer100: 20, carbsPer100: 0, fatPer100: 13, budget: "PREMIUM", vegFriendly: false, veganFriendly: false },
  { slug: "whey", name: "Whey Protein Scoop", caloriesPer100: 380, proteinPer100: 75, carbsPer100: 8, fatPer100: 5, budget: "PREMIUM", vegFriendly: true, veganFriendly: false },
  { slug: "almonds", name: "Almonds", caloriesPer100: 579, proteinPer100: 21, carbsPer100: 22, fatPer100: 50, budget: "PREMIUM", vegFriendly: true, veganFriendly: true },
  { slug: "avocado", name: "Avocado", caloriesPer100: 160, proteinPer100: 2, carbsPer100: 9, fatPer100: 15, budget: "PREMIUM", vegFriendly: true, veganFriendly: true },
];

export async function seedFoods(prisma: PrismaClient) {
  for (const f of FOODS) {
    await prisma.foodItem.upsert({ where: { slug: f.slug }, update: f, create: f });
  }
  return FOODS.length;
}

export const FOOD_SLUGS = FOODS.map((f) => f.slug);
