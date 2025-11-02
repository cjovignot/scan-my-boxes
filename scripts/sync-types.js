import fs from "fs";
import path from "path";

const sharedSrc = path.resolve("shared/types");
const targets = ["frontend/src/types", "api/src/types"];

for (const target of targets) {
  const targetPath = path.resolve(target);
  fs.rmSync(targetPath, { recursive: true, force: true });
  fs.mkdirSync(targetPath, { recursive: true });

  fs.cpSync(sharedSrc, targetPath, { recursive: true });
  console.log(`✅ Types copied to ${target}`);
}
