import { promises as fs } from "fs";
import path from "path";
import type { DBShape } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function readDB(): Promise<DBShape> {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as DBShape;
}

export async function writeDB(db: DBShape): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
