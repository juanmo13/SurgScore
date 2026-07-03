import fs from "fs";
import path from "path";
import type { ScaleDefinition } from "./types";

const SCALES_DIR = path.join(process.cwd(), "data/scales");

function readScaleFile(filePath: string): ScaleDefinition {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as ScaleDefinition;
}

export function getAllScales(): ScaleDefinition[] {
  const files = fs
    .readdirSync(SCALES_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort();

  return files.map((file) => readScaleFile(path.join(SCALES_DIR, file)));
}

export function getScaleById(id: string): ScaleDefinition | undefined {
  const filePath = path.join(SCALES_DIR, `${id}.json`);

  if (!fs.existsSync(filePath)) return undefined;

  return readScaleFile(filePath);
}

export function getScaleIds(): string[] {
  return getAllScales().map((scale) => scale.id);
}
