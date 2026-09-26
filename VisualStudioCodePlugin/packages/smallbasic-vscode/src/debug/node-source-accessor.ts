import fs from "node:fs";
import path from "node:path";
import type { DebugSourceAccessor } from "./session";

export class NodeDebugSourceAccessor implements DebugSourceAccessor {
  public resolvePath(filePath: string): string {
    return path.resolve(filePath);
  }

  public basename(filePath: string): string {
    return path.basename(filePath);
  }

  public readFile(filePath: string): string {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      throw new Error(`Debug target is a directory: ${filePath}`);
    }

    return fs.readFileSync(filePath, "utf8");
  }
}
