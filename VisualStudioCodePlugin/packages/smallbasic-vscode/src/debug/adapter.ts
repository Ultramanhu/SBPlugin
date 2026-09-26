import { DebugSession } from "@vscode/debugadapter";
import { NodeDebugSourceAccessor } from "./node-source-accessor";
import { SmallBasicDebugSession } from "./session";

class NodeSmallBasicDebugSession extends SmallBasicDebugSession {
  public constructor() {
    super(new NodeDebugSourceAccessor());
  }
}

DebugSession.run(NodeSmallBasicDebugSession);
