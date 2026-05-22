import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { seedExercises } from "./exercises.js";
import { seedWorkouts } from "./workouts.js";
import { seedBoxing } from "./boxing.js";
import { seedFoods } from "./foods.js";
import { seedMeals } from "./meals.js";
import { seedDiets } from "./diets.js";
import { seedDiscipline } from "./discipline.js";
import { seedAchievements } from "./achievements.js";
import { seedDemoUsers } from "./users.js";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PowerHouse database...");

  const exercises = await seedExercises(prisma);
  console.log(`  exercises:   ${exercises}`);

  const workouts = await seedWorkouts(prisma);
  console.log(`  workouts:    ${workouts}`);

  const boxing = await seedBoxing(prisma);
  console.log(`  boxing:      ${boxing}`);

  const foods = await seedFoods(prisma);
  console.log(`  foods:       ${foods}`);

  const meals = await seedMeals(prisma);
  console.log(`  meals:       ${meals}`);

  const diets = await seedDiets(prisma);
  console.log(`  diets:       ${diets}`);

  const discipline = await seedDiscipline(prisma);
  console.log(`  discipline:  ${discipline}`);

  const achievements = await seedAchievements(prisma);
  console.log(`  achievements:${achievements}`);

  const users = await seedDemoUsers(prisma);
  console.log(`  demo users:  ${users}  (alex@powerhouse.dev + jordan@powerhouse.dev / demopass123)`);

  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
