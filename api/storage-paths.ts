import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd());
const dataRoot = process.env.DATA_ROOT?.trim()
  ? path.resolve(process.env.DATA_ROOT)
  : rootDir;

export const dataDir = path.join(dataRoot, "data");
export const uploadsDir = path.join(dataRoot, "uploads");
export const distDir = path.join(rootDir, "dist");

export function ensureStorageDirs(): void {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(uploadsDir, { recursive: true });
}
