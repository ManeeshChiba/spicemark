import * as fs from "node:fs";
import * as path from "node:path";

export const GENERIC_MATCHER = /\{%([\s\S]*?)%\}/gi;

export function loadFile(filePath) {
  const resolvedPath = path.resolve(filePath);
  return fs.readFileSync(resolvedPath, "utf-8", (error) => {
    console.error("Error reading file: ", error);
  });
}

export function writeFile(filePath, data) {
  const resolvedPath = path.resolve(filePath);
  fs.writeFileSync(resolvedPath, data, "utf-8");
}
