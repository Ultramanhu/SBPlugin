import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig([
  {
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
    noExternal: ["smallbasic-lang-core"]
  },
  {
    // VS Code for the Web executes this single-file bundle in a WebWorker. The
    // inline debug adapter keeps execution in that browser extension host.
    entry: {
      "web/extension": "src/web/extension.ts"
    },
    format: "cjs",
    target: "es2022",
    platform: "browser",
    clean: false,
    external: ["vscode"],
    noExternal: [
      "smallbasic-lang-core",
      "@vscode/debugadapter",
      "@vscode/debugprotocol",
      "buffer",
      "events",
      "process",
      "url"
    ],
    esbuildOptions(options) {
      options.inject = [path.resolve(__dirname, "src", "web", "polyfills.ts")];
    }
  }
]);
