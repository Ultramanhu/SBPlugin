import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const extensionDirectory = path.resolve(scriptDirectory, "..");
const repositoryRoot = path.resolve(extensionDirectory, "..", "..", "..");
const configurations = ["Release", "Debug"];
const hostRoot = path.join(repositoryRoot, "visual_studio_plugin", "src", "SmallBasic.RunHost", "bin");

function findHost(targetFramework, fileName) {
  for (const configuration of configurations) {
    const candidate = path.join(hostRoot, configuration, targetFramework);
    if (fs.existsSync(path.join(candidate, fileName))) {
      return candidate;
    }
  }

  throw new Error(
    `${targetFramework}/${fileName} was not found. Build visual_studio_plugin/src/SmallBasic.RunHost first.`
  );
}

const windowsSource = findHost("net8.0-windows", "SmallBasic.RunHost.exe");
const portableSource = findHost("net8.0", "SmallBasic.RunHost.dll");

const destinationDirectory = path.join(extensionDirectory, "runhost");
fs.rmSync(destinationDirectory, { recursive: true, force: true });
const windowsDestination = path.join(destinationDirectory, "windows");
const portableDestination = path.join(destinationDirectory, "portable");
fs.mkdirSync(windowsDestination, { recursive: true });
fs.mkdirSync(portableDestination, { recursive: true });
fs.cpSync(windowsSource, windowsDestination, { recursive: true, force: true });
fs.cpSync(portableSource, portableDestination, { recursive: true, force: true });
console.log(`Staged Windows C# run host from ${windowsSource}`);
console.log(`Staged portable C# run host from ${portableSource}`);
