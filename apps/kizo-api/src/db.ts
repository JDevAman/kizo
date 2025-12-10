// 1. Import the singleton from your shared package
import { prisma } from "@kizo/db";

// 2. Re-export it so your repositories can keep using "import { prisma } from '../db'"
export { prisma };