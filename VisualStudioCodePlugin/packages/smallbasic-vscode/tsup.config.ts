import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/extension.ts", "src/debug/adapter.ts"],
  format: "cjs",
  target: "node20",
  platform: "node",
  clean: true,
  external: ["vscode"],
  // The workspace package is compiled into the bundle; the packaged VSIX ships
  // no node_modules, so it must never stay external.
  noExternal: ["smallbasic-lang-core"]
});
