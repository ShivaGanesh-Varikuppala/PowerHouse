import { PrismaClient } from "@prisma/client";

declare global {

  var __powerhousePrisma: PrismaClient | undefined;
}

export const prisma =
  global.__powerhousePrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__powerhousePrisma = prisma;
}

export * from "@prisma/client";
