import getConfig from "../config.js";
import { initPrisma, getPrisma } from "@kizo/db";

const config = getConfig();
initPrisma(config.databaseUrl);

export const prisma = getPrisma();
