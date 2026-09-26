import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const extensionDirectory = path.resolve(scriptDirectory, "..");
const repositoryRoot = path.resolve(extensionDirectory, "..", "..", "..");
const configurations = ["Release", "Debug"];
const targetFrameworks = ["net48", "net8.0-windows"];

let sourceDirectory;
for (const configuration of configurations) {
  for (const targetFramework of targetFrameworks) {
    const candidate = path.join(
      repositoryRoot,
      "VisualStudioPlugin",
      "src",
      "SmallBasic.RunHost",
      "bin",
      configuration,
      targetFramework
    );
    if (fs.existsSync(path.join(candidate, "SmallBasic.RunHost.exe"))) {
      sourceDirectory = candidate;
      break;
    }
  }

  if (sourceDirectory) {
    break;
  }
}

if (!sourceDirectory) {
  throw new Error(
    "SmallBasic.RunHost.exe was not found. Build VisualStudioPlugin/src/SmallBasic.RunHost first."
  );
}

const destinationDirectory = path.join(extensionDirectory, "RunHost");
fs.rmSync(destinationDirectory, { recursive: true, force: true });
fs.mkdirSync(destinationDirectory, { recursive: true });
fs.cpSync(sourceDirectory, destinationDirectory, { recursive: true, force: true });
console.log(`Staged C# run host from ${sourceDirectory}`);
