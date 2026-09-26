import { defineConfig } from "tsup";

export default defineConfig({
  // "debug/adapter" keeps the historical dist/debug/adapter.js layout: both the
  // extension (src/debug/factory.ts) and the Visual Studio VSIX packaging script
  // (VisualStudioPlugin/build/Package-Vsix.ps1) reference that exact path.
  entry: {
    extension: "src/extension.ts",
    "debug/adapter": "src/debug/adapter.ts",
    runhost: "src/runhost/main.ts"
  },
  format: "cjs",
  target: "node20",
  platform: "node",
  clean: true,
  external: ["vscode"],
  // The workspace package is compiled into the bundle; the packaged VSIX ships
  // no node_modules, so it must never stay external.
  noExternal: ["smallbasic-lang-core"]
});
