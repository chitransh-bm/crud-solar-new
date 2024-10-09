import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import { createConnection } from "mysql2";

const DB_URL = process.env.DATABASE_URL as string;

function initilizeDatabase() {
  const queryClient = createConnection(DB_URL);
  return drizzle(queryClient, { schema, mode: "default" });
}
export const db = initilizeDatabase();

