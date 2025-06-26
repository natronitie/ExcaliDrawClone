import { PrismaClient, Prisma } from "./generated/prisma/index.js";

export const dbClient = new PrismaClient();

export {Prisma}