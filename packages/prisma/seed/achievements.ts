import type { PrismaClient } from "@prisma/client";

type AchievementInput = {
  slug: string;
  title: string;
  description: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  iconKey: string;
  xpReward: number;
  rule: string;
};

export const ACHIEVEMENTS: AchievementInput[] = [
  { slug: "first-rep", title: "First Rep", description: "Complete your first workout session.", tier: "BRONZE", iconKey: "flame", xpReward: 50, rule: "sessions >= 1" },
  { slug: "week-warrior", title: "Week Warrior", description: "Train at least 3 days in one week.", tier: "BRONZE", iconKey: "trophy", xpReward: 75, rule: "sessions_in_week >= 3" },
  { slug: "10-sessions", title: "Iron Habit", description: "Complete 10 workout sessions.", tier: "SILVER", iconKey: "dumbbell", xpReward: 100, rule: "sessions >= 10" },
  { slug: "boxing-baptism", title: "Boxing Baptism", description: "Complete your first boxing session.", tier: "BRONZE", iconKey: "gloves", xpReward: 50, rule: "boxing_sessions >= 1" },
  { slug: "30-boxing", title: "Sharpened Reflexes", description: "Complete 30 boxing sessions.", tier: "GOLD", iconKey: "gloves", xpReward: 250, rule: "boxing_sessions >= 30" },
  { slug: "7-day-streak", title: "7-Day Streak", description: "Stay consistent for 7 days in a row.", tier: "SILVER", iconKey: "calendar", xpReward: 150, rule: "streak >= 7" },
  { slug: "30-day-streak", title: "30-Day Streak", description: "Lock in for 30 consecutive days.", tier: "GOLD", iconKey: "calendar", xpReward: 400, rule: "streak >= 30" },
  { slug: "100-day-streak", title: "Century", description: "100 days in a row. Discipline elite.", tier: "PLATINUM", iconKey: "crown", xpReward: 1000, rule: "streak >= 100" },
  { slug: "hydration-hero", title: "Hydration Hero", description: "Hit hydration goal 14 days in a row.", tier: "SILVER", iconKey: "droplet", xpReward: 120, rule: "hydration_streak >= 14" },
  { slug: "level-10", title: "Level 10", description: "Reach transformation level 10.", tier: "GOLD", iconKey: "shield", xpReward: 300, rule: "level >= 10" },
];

export async function seedAchievements(prisma: PrismaClient) {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({ where: { slug: a.slug }, update: a, create: a });
  }
  return ACHIEVEMENTS.length;
}
