# 03 VS Code 插件设计

落地目录：`visual_studio_code_plugin/`。目标：发布到 VS Code Marketplace 的扩展，支持 `.sb` 文件创建、着色、IntelliSense、运行、调试。

> **2026-09-26 现状校准**
>
> - 当前仓库已实际落地的包名是 `packages/smallbasic-lang-core` 与 `packages/smallbasic-vscode`；独立 `sb-debug` 包仍是后续可拆分形态，并未单独存在。
> - 当前已实现：`.sb` 关联与着色、诊断、悬停、一级/二级补全、`TextWindow` 文本运行、基础 JS 调试器、`Text`/`Array` 等核心运行库、库事件绑定语义（如 `GraphicsWindow.KeyDown = HandleKey` 可正确编译）、以及 **Windows 下的 C# 运行后端接入**。
> - 当前后端选择改为**显式模式**：
>   - 运行：`smallbasic.run` 固定走 JS 后端；`smallbasic.runCSharp` 固定走 C# 后端；
>   - 调试/启动：在 `launch.json` 中显式选择 `backend = "javascript"` 或 `backend = "csharp"`。
> - 当前未实现：`GraphicsWindow/Controls/Turtle` 的 **JS 图形宿主**。因此图形程序（如 `tetris.sb`）的图形支持，当前依赖 **Windows + C# 后端**；在非 Windows 或选择 JS 后端时，会得到明确能力提示，而不是继续抛出底层异常。

## 1. 工程结构

采用 monorepo（npm workspaces + esbuild 打包 + vitest 测试）：

```
visual_studio_code_plugin/
├── package.json                  # workspace 根
├── tsconfig.base.json
├── packages/
│   ├── smallbasic-lang-core/     # 语言核心（拷贝升级自 SmallBasicOnline/src/compiler，见 §2）
│   │   ├── src/
│   │   │   ├── syntax/  binding/  emitting/  runtime/  services/  utils/
│   │   │   └── index.ts          # 公共出口：Compilation/ExecutionEngine/services/元数据
│   │   ├── tests/                # 移植自 SmallBasicOnline/tests/compiler（jasmine→vitest）
│   │   └── package.json          # 零依赖纯 TS 包
│   ├── smallbasic-vscode/        # VS Code 扩展本体（当前包含调试适配器代码）
│   │   ├── package.json          # 扩展清单（contributes 见 §3）
│   │   ├── src/
│   │   │   ├── extension.ts      # activate/deactivate
│   │   │   ├── language/         # 补全/悬停/诊断/语义着色/定义跳转
│   │   │   ├── editing/          # 新建文件命令、snippet
│   │   │   ├── run/              # 运行（非调试）宿主
│   │   │   ├── debug/            # 当前内嵌的 DAP 调试适配器实现
│   │   │   └── util/             # 坐标转换、防抖、编译缓存
│   │   ├── syntaxes/smallbasic.tmLanguage.json   # TextMate 语法
│   │   ├── language-configuration.json           # 括号/注释/缩进规则
│   │   ├── snippets/smallbasic.json
│   │   ├── data/library-docs.json                # 由 SmallBasicLibrary.xml 生成
│   │   └── media/                # 图标
│   └── sb-debug/                 # （规划中）未来可拆分出的独立 DAP 调试适配器
├── scripts/
│   └── generate-library-docs.mjs # SmallBasicLibrary.xml → library-docs.json
└── conformance/                  # 一致性测试集（与 VS 侧共享，见 07）
```

## 2. sb-lang-core 拷贝与升级

**消费方式**：将 `SmallBasicOnline` 的源码**拷贝**到本包并脱离上游独立维护（ADR-4），不用子模块/npm 外链。目录内记录 `UPSTREAM.md`（来源仓库、提交哈希、拷贝日期、本地改动摘要）。

**拷贝范围**：

| 拷贝 | 不拷贝 |
|---|---|
| `src/compiler/**`（syntax/binding/emitting/runtime/services/utils） | `src/app`（React/Monaco UI）、`electron/`、`build/`、webpack/gulp 配置 |
| `tests/compiler/**` | app 相关测试无（测试仅覆盖 compiler） |

**升级清单**（适配最新编译器与运行时）：

| 项 | 从 | 到 |
|---|---|---|
| TypeScript | 2.5.3 | **5.x**，`module: NodeNext`/`ESNext`，`tsc` 声明产物 + esbuild 打包 |
| 模块系统 | namespace + webpack 3 | ESM 包（扩展打包时由 esbuild 转 CJS 单文件） |
| 运行时基线 | Node 8 时代 | **Node 20 LTS**（VS Code 1.96+ 扩展宿主内置） |
| 测试 | jasmine 2.8 + webpack bundle | **vitest**（`describe/it/expect` 平移，断言兼容） |
| 依赖 | pubsub-js | 保留或替换为 Node `EventEmitter`（30 行内，决策点记录在 UPSTREAM.md） |
| 代码质量 | tslint 5.7 | **eslint 9（flat config）+ prettier** |
| 严格模式 | 无 | 第一阶段 `strict: false` 保编译 → 测试全绿 → 渐进开 `strict`，逐目录收敛 |

**验收**：`tests/compiler` 全部用例在 vitest 下通过（该套件覆盖 scanner/parser/binder/runtime/services，是回归安全网）；升级阶段**零语义改动**。

**对外 API 冻结层**（`index.ts`）：`Compilation`、`ExecutionEngine`、`ExecutionMode/State`、`CompletionService`、`HoverService`、`LibrariesMetadata`、`Diagnostic/CompilerPosition/CompilerRange`、`ITextWindowLibraryPlugin` 等宿主接口。扩展与适配器只依赖此出口。

## 3. 扩展清单（package.json contributes）

```jsonc
{
  "main": "./dist/extension.js",
  "engines": { "vscode": "^1.96.0" },
  "activationEvents": ["onLanguage:smallbasic"],
  "contributes": {
    "languages": [{
      "id": "smallbasic",
      "aliases": ["Small Basic", "smallbasic"],
      "extensions": [".sb"],
      "configuration": "./language-configuration.json",
      "icon": { "light": "./media/sb.svg", "dark": "./media/sb.svg" }
    }],
    "grammars": [{
      "language": "smallbasic",
      "scopeName": "source.smallbasic",
      "path": "./syntaxes/smallbasic.tmLanguage.json"
    }],
    "snippets": [{ "language": "smallbasic", "path": "./snippets/smallbasic.json" }],
    "commands": [
      { "command": "smallbasic.newFile", "title": "Small Basic: New File" },
      { "command": "smallbasic.run",     "title": "Small Basic: Run", "icon": "$(play)" }
    ],
    "menus": {
      "editor/title/run": [{ "command": "smallbasic.run", "when": "resourceLangId == smallbasic" }],
      "explorer/context": [{ "command": "smallbasic.newFile", "when": "explorerResourceIsFolder" }]
    },
    "debuggers": [{ "type": "smallbasic", ... }],   // 详见 05 文档
    "configuration": { "properties": {
      "smallbasic.diagnostics.debounceMs": { "type": "number", "default": 150 },
      "smallbasic.csharp.runHostPath": { "type": "string", "default": "",
        "description": "SmallBasic.RunHost.exe 路径；为空时按常见构建输出或扩展内置 runhost 目录自动搜索" }
    }}
  }
}
```

`language-configuration.json`：注释 `'`，括号配对，缩进规则（`If/For/While/Sub` 增、`EndIf/EndFor/EndWhile/EndSub/Else/ElseIf` 减），`wordPattern`（SB 标识符支持非 ASCII，数组用 `arr["k"]`）。

## 4. 语法着色（双层）

**第 1 层 TextMate**（`smallbasic.tmLanguage.json`，新建，零运行时成本）：

| scope | 模式 |
|---|---|
| `keyword.control.smallbasic` | If Then Else ElseIf EndIf For To Step EndFor While EndWhile Sub EndSub Goto And Or Not |
| `string.quoted.double.smallbasic` | `"..."`（SB 无转义，`""` 表引号） |
| `constant.numeric.smallbasic` | 数字字面量 |
| `comment.line.apostrophe.smallbasic` | `' ...` |
| `support.class.library.smallbasic` | 20 个库对象名（从 library-docs.json 生成名单） |
| `entity.name.function.sub.smallbasic` | Sub 定义名 |

**第 2 层语义令牌**（`DocumentSemanticTokensProvider`，基于 `Compilation.tokens` 的 `TokenKind` 映射）：区分**变量 vs 库对象 vs 子程序调用**（TextMate 无法区分上下文），并高亮未绑定标识符。映射表：`Identifier→variable`、`ObjectAccessExpression 头部→class`、`SubModule→function`、标签→`label`。

性能：语义令牌以文档版本缓存 Compilation，与诊断共享同一份编译结果（见 §7）。

## 5. IntelliSense 映射

| VS Code API | 实现来源 | 要点 |
|---|---|---|
| `CompletionItemProvider` | `CompletionService.provideCompletion(compilation, pos)` | 触发字符 `.`；库成员项附 `detail`=签名、`documentation`=library-docs.json 文案；`ResultKind{Class,Method,Property}→CompletionItemKind` |
| `HoverProvider` | `HoverService.provideHover(...)` | Markdown 输出；诊断处悬停优先展示错误 |
| `SignatureHelpProvider` | `LibrariesMetadata` + `getSyntaxNode` 定位 `ObjectAccessExpression` | 参数描述来自 library-docs.json 的 `<param>` |
| `DiagnosticCollection` | `compilation.diagnostics` | `CompilerRange`(0-based) → `vscode.Range` 直接映射；severity 全为 error（SB 编译器只产 error） |
| `DefinitionProvider`（二期） | binder 的 `VariablesAndSubModulesCollector` | 变量/子程序/标签跳转 |
| `DocumentSymbolProvider`（二期） | AST 遍历 Sub/标签 | Outline 视图 |

坐标转换统一封装在 `util/positions.ts`：compiler 0-based ↔ VS Code 0-based（**同基，仅类型转换**，比 Monaco 时代还简单）。

补全项渲染数据源：构建期 `scripts/generate-library-docs.mjs` 解析 HomeSite `SmallBasicLibrary.xml`（参考其 `documentation.service.ts` 的签名生成逻辑）产出 `data/library-docs.json`，支持按 VS Code `locale` 选择 zh-Hans/en 等文案。

## 6. 新建文件

- 命令 `smallbasic.newFile`：在资源管理器选中目录下创建 `Untitled-N.sb`/指定文件名，写入模板（`' My first Small Basic program` + `TextWindow.WriteLine("Hello World")`），打开并聚焦。
- snippets：`if/for/while/sub/try(无)/事件订阅` 模板。
- 欢迎页（Walkthrough，二期）：新建文件 → 运行 → 调试三步引导。

## 7. 编译缓存与防抖（性能关键路径）

```ts
// util/compilation-cache.ts 设计
class CompilationCache {
  private cache = new Map<string, { version: number; compilation: Compilation }>();
  get(doc: vscode.TextDocument): Compilation {
    const hit = this.cache.get(doc.uri.toString());
    if (hit && hit.version === doc.version) return hit.compilation;
    const c = new Compilation(doc.getText());   // 同步全量编译，SB 程序规模下 <10ms
    this.cache.set(doc.uri.toString(), { version: doc.version, compilation: c });
    return c;
  }
}
```

- **诊断**：`onDidChangeTextDocument` → 防抖 150ms → 全量重建 + 发布。
- **补全/悬停**：同步路径直接取缓存编译结果（通常命中，零等待）。
- **失效**：`onDidCloseTextDocument` 清条目，防止泄漏。
- 大文件（>5 万行，极端情况）二期迁 web worker；MVP 不测此路径。

## 8. 运行（非调试）

命令 `smallbasic.run`，按 `smallbasic.backend` 分流（ADR-5）：

**命令 `smallbasic.run`（内置 JS 引擎）**：

1. 保存文档，`new Compilation(text)`，若 `!isReadyToRun` → 诊断面板提示，不运行。
2. 创建 VS Code **Terminal**（` Pseudoterminal` 实现），实例化 `ExecutionEngine`，注入 `ITextWindowLibraryPlugin` 的终端实现：
   - `writeText` → PTY write
   - `inputIsNeeded/checkInputBuffer` → PTY 行缓冲读
3. 引擎 `execute(RunToEnd)` 在**独立 Node 子进程**（`run-host.ts`，即 CLI 契约的 `sb-run` 形态）执行，扩展进程通过 IPC 转发终端 I/O——避免死循环程序卡死扩展宿主；`terminate` 由终端关闭/超时按钮触发。
4. `compilation.kind` 探测到 GraphicsWindow 用法 → 给出明确能力提示，引导改用 C# 后端命令或 `launch.json` 中的 C# 启动项。

**命令 `smallbasic.runCSharp` / `launch.json` 的 `backend = "csharp"`（.NET 引擎，当前桌面图形后端）**：

1. 解析 `smallbasic.dotnetBackend.path` 或按需下载 `SB.RunHost.exe`（net8.0 自包含单文件，与 VS 侧同一构建产物）。
2. 终端中执行 `SB.RunHost.exe run --file "<path>.sb" --pause`，其 `ConsoleTextWindowLibrary` 直接读写该终端；若程序使用 `GraphicsWindow/Shapes`，则由宿主内置的官方 `Microsoft.SmallBasic.Library` 图形窗口负责渲染。
3. 下载策略：首次切换时从发布渠道拉取对应 RID 的单文件，缓存于扩展全局存储；校验 SHA-256。

## 9. 调试接入

`contributes.debuggers` 声明 `type: "smallbasic"`，`program` 指向 `packages/sb-debug/dist/adapter.js`（`adapter` 类型 debug adapter，`vscode-debugadapter` 库实现 DAP 服务端）。launch.json 形态：

```jsonc
{ "type": "smallbasic", "request": "launch", "name": "SmallBasic: Launch current file (JS debugger)",
  "program": "${file}", "backend": "javascript", "stopOnEntry": false }

{ "type": "smallbasic", "request": "launch", "name": "SmallBasic: Run current file with C# backend",
  "program": "${file}", "backend": "csharp", "stopOnEntry": false }
```

**后端分流**：`backend` 缺省取 `smallbasic.backend` 设置。`"dotnet"` 时扩展改为以可执行文件方式启动 `SB.DebugAdapter.exe`（stdio DAP，`DebugAdapterExecutable` 描述符），协议语义与 TS 适配器字段级对齐（见 05 §5），IDE 侧调试 UI 无差异。

适配器内部结构与断点实现见 [05-调试架构设计.md](./05-调试架构设计.md)。

## 10. 打包与发布

- esbuild 将扩展 + 适配器分别打成单文件（`dist/extension.js`、`dist/adapter.js`），外部仅留 `vscode`。
- `@vscode/vsce package` 产出 vsix；CI（GitHub Actions）：lint → typecheck → vitest（含一致性测试）→ 打包 → （手动）publish。
- 体积预算：扩展 + 语言核心 + 适配器合计 < 1.5 MB。

## 11. 与 VS 侧的差异说明

VS Code 侧**不需要** MEF/分类器等概念，语言特性全部走 VS Code 声明式 API；TextMate 语法与语义令牌互补，语义令牌补齐 TextMate 做不到的上下文区分。调试适配器独立 npm 包便于未来被其他 DAP 客户端复用。
