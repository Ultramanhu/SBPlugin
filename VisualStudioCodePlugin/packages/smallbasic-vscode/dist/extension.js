"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/pubsub-js/src/pubsub.js
var require_pubsub = __commonJS({
  "../../node_modules/pubsub-js/src/pubsub.js"(exports2, module2) {
    "use strict";
    (function(root, factory) {
      "use strict";
      var PubSub2 = {};
      if (root.PubSub) {
        PubSub2 = root.PubSub;
        console.warn("PubSub already loaded, using existing version");
      } else {
        root.PubSub = PubSub2;
        factory(PubSub2);
      }
      if (typeof exports2 === "object") {
        if (module2 !== void 0 && module2.exports) {
          exports2 = module2.exports = PubSub2;
        }
        exports2.PubSub = PubSub2;
        module2.exports = exports2 = PubSub2;
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return PubSub2;
        });
      }
    })(typeof window === "object" && window || exports2 || global, function(PubSub2) {
      "use strict";
      var messages = {}, lastUid = -1, ALL_SUBSCRIBING_MSG = "*";
      function hasKeys(obj) {
        var key;
        for (key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return true;
          }
        }
        return false;
      }
      function throwException(ex) {
        return function reThrowException() {
          throw ex;
        };
      }
      function callSubscriberWithDelayedExceptions(subscriber, message, data) {
        try {
          subscriber(message, data);
        } catch (ex) {
          setTimeout(throwException(ex), 0);
        }
      }
      function callSubscriberWithImmediateExceptions(subscriber, message, data) {
        subscriber(message, data);
      }
      function deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
        var subscribers = messages[matchedMessage], callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions, s;
        if (!Object.prototype.hasOwnProperty.call(messages, matchedMessage)) {
          return;
        }
        for (s in subscribers) {
          if (Object.prototype.hasOwnProperty.call(subscribers, s)) {
            callSubscriber(subscribers[s], originalMessage, data);
          }
        }
      }
      function createDeliveryFunction(message, data, immediateExceptions) {
        return function deliverNamespaced() {
          var topic = String(message), position = topic.lastIndexOf(".");
          deliverMessage(message, message, data, immediateExceptions);
          while (position !== -1) {
            topic = topic.substr(0, position);
            position = topic.lastIndexOf(".");
            deliverMessage(message, topic, data, immediateExceptions);
          }
          deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);
        };
      }
      function hasDirectSubscribersFor(message) {
        var topic = String(message), found = Boolean(Object.prototype.hasOwnProperty.call(messages, topic) && hasKeys(messages[topic]));
        return found;
      }
      function messageHasSubscribers(message) {
        var topic = String(message), found = hasDirectSubscribersFor(topic) || hasDirectSubscribersFor(ALL_SUBSCRIBING_MSG), position = topic.lastIndexOf(".");
        while (!found && position !== -1) {
          topic = topic.substr(0, position);
          position = topic.lastIndexOf(".");
          found = hasDirectSubscribersFor(topic);
        }
        return found;
      }
      function publish2(message, data, sync, immediateExceptions) {
        message = typeof message === "symbol" ? message.toString() : message;
        var deliver = createDeliveryFunction(message, data, immediateExceptions), hasSubscribers = messageHasSubscribers(message);
        if (!hasSubscribers) {
          return false;
        }
        if (sync === true) {
          deliver();
        } else {
          setTimeout(deliver, 0);
        }
        return true;
      }
      PubSub2.publish = function(message, data) {
        return publish2(message, data, false, PubSub2.immediateExceptions);
      };
      PubSub2.publishSync = function(message, data) {
        return publish2(message, data, true, PubSub2.immediateExceptions);
      };
      PubSub2.subscribe = function(message, func) {
        if (typeof func !== "function") {
          return false;
        }
        message = typeof message === "symbol" ? message.toString() : message;
        if (!Object.prototype.hasOwnProperty.call(messages, message)) {
          messages[message] = {};
        }
        var token = "uid_" + String(++lastUid);
        messages[message][token] = func;
        return token;
      };
      PubSub2.subscribeAll = function(func) {
        return PubSub2.subscribe(ALL_SUBSCRIBING_MSG, func);
      };
      PubSub2.subscribeOnce = function(message, func) {
        var token = PubSub2.subscribe(message, function() {
          PubSub2.unsubscribe(token);
          func.apply(this, arguments);
        });
        return PubSub2;
      };
      PubSub2.clearAllSubscriptions = function clearAllSubscriptions() {
        messages = {};
      };
      PubSub2.clearSubscriptions = function clearSubscriptions(topic) {
        var m;
        for (m in messages) {
          if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
            delete messages[m];
          }
        }
      };
      PubSub2.countSubscriptions = function countSubscriptions(topic) {
        var m;
        var token;
        var count = 0;
        for (m in messages) {
          if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
            for (token in messages[m]) {
              count++;
            }
            break;
          }
        }
        return count;
      };
      PubSub2.getSubscriptions = function getSubscriptions(topic) {
        var m;
        var list = [];
        for (m in messages) {
          if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
            list.push(m);
          }
        }
        return list;
      };
      PubSub2.unsubscribe = function(value) {
        var descendantTopicExists = function(topic) {
          var m2;
          for (m2 in messages) {
            if (Object.prototype.hasOwnProperty.call(messages, m2) && m2.indexOf(topic) === 0) {
              return true;
            }
          }
          return false;
        }, isTopic = typeof value === "string" && (Object.prototype.hasOwnProperty.call(messages, value) || descendantTopicExists(value)), isToken = !isTopic && typeof value === "string", isFunction = typeof value === "function", result = false, m, message, t;
        if (isTopic) {
          PubSub2.clearSubscriptions(value);
          return;
        }
        for (m in messages) {
          if (Object.prototype.hasOwnProperty.call(messages, m)) {
            message = messages[m];
            if (isToken && message[value]) {
              delete message[value];
              result = value;
              break;
            }
            if (isFunction) {
              for (t in message) {
                if (Object.prototype.hasOwnProperty.call(message, t) && message[t] === value) {
                  delete message[t];
                  result = true;
                }
              }
            }
          }
        }
        return result;
      };
    });
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode8 = __toESM(require("vscode"));

// src/common/activation.ts
var vscode5 = __toESM(require("vscode"));

// src/debug/inline-values.ts
var vscode = __toESM(require("vscode"));
var identifierPattern = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
var keywords = /* @__PURE__ */ new Set([
  "and",
  "else",
  "elseif",
  "endfor",
  "endif",
  "endsub",
  "endwhile",
  "for",
  "goto",
  "if",
  "or",
  "step",
  "sub",
  "then",
  "to",
  "while"
]);
function registerSmallBasicInlineValues(context) {
  context.subscriptions.push(vscode.languages.registerInlineValuesProvider(
    { language: "smallbasic" },
    {
      provideInlineValues(document, viewPort, inlineContext) {
        if (vscode.debug.activeDebugSession?.type !== "smallbasic") {
          return [];
        }
        const values = [];
        const lastLine = Math.min(viewPort.end.line, inlineContext.stoppedLocation.end.line);
        for (let lineNumber = viewPort.start.line; lineNumber <= lastLine; lineNumber += 1) {
          const line = document.lineAt(lineNumber);
          identifierPattern.lastIndex = 0;
          for (let match = identifierPattern.exec(line.text); match; match = identifierPattern.exec(line.text)) {
            const identifier = match[0];
            if (keywords.has(identifier.toLowerCase())) {
              continue;
            }
            const previous = match.index > 0 ? line.text[match.index - 1] : "";
            const following = line.text.slice(match.index + identifier.length).trimStart()[0] ?? "";
            if (previous === "." || following === ".") {
              continue;
            }
            const range = new vscode.Range(
              lineNumber,
              match.index,
              lineNumber,
              match.index + identifier.length
            );
            values.push(new vscode.InlineValueVariableLookup(range, identifier, false));
          }
        }
        return values;
      }
    }
  ));
}

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/base-value.ts
var Constants;
((Constants2) => {
  Constants2.True = "True";
  Constants2.False = "False";
})(Constants || (Constants = {}));
var ValueKind = /* @__PURE__ */ ((ValueKind2) => {
  ValueKind2[ValueKind2["String"] = 0] = "String";
  ValueKind2[ValueKind2["Number"] = 1] = "Number";
  ValueKind2[ValueKind2["Array"] = 2] = "Array";
  return ValueKind2;
})(ValueKind || {});
var BaseValue = class {
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/ranges.ts
var CompilerPosition = class {
  constructor(line, column) {
    this.line = line;
    this.column = column;
  }
  line;
  column;
  equals(position) {
    return this.line === position.line && this.column === position.column;
  }
  before(position) {
    if (this.line > position.line) return false;
    if (this.line < position.line) return true;
    return this.column < position.column;
  }
  after(position) {
    if (this.line < position.line) return false;
    if (this.line > position.line) return true;
    return this.column > position.column;
  }
};
var CompilerRange = class _CompilerRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  start;
  end;
  static fromValues(startLine, startColumn, endLine, endColumn) {
    return new _CompilerRange(
      new CompilerPosition(startLine, startColumn),
      new CompilerPosition(endLine, endColumn)
    );
  }
  static fromPositions(start, end) {
    return new _CompilerRange(start, end);
  }
  static combine(start, end) {
    return new _CompilerRange(start.start, end.end);
  }
  // Spans ranges regardless of their document order: the result covers the
  // earliest start through the latest end. Unlike `combine`, this is safe for
  // child collections that may appear in any order (e.g. main statements
  // located after sub modules).
  static spanning(ranges) {
    if (ranges.length === 0) {
      return _CompilerRange.fromValues(0, 0, 0, 0);
    }
    let start = ranges[0].start;
    let end = ranges[0].end;
    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i].start.before(start)) {
        start = ranges[i].start;
      }
      if (end.before(ranges[i].end)) {
        end = ranges[i].end;
      }
    }
    return new _CompilerRange(start, end);
  }
  containsPosition(position) {
    return (this.start.before(position) || this.start.equals(position)) && (position.before(this.end) || position.equals(this.end));
  }
  containsRange(range) {
    return this.containsPosition(range.start) && this.containsPosition(range.end);
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/syntax-nodes.ts
var SyntaxKind = /* @__PURE__ */ ((SyntaxKind3) => {
  SyntaxKind3[SyntaxKind3["ParseTree"] = 0] = "ParseTree";
  SyntaxKind3[SyntaxKind3["SubModuleDeclaration"] = 1] = "SubModuleDeclaration";
  SyntaxKind3[SyntaxKind3["StatementBlock"] = 2] = "StatementBlock";
  SyntaxKind3[SyntaxKind3["IfHeader"] = 3] = "IfHeader";
  SyntaxKind3[SyntaxKind3["IfStatement"] = 4] = "IfStatement";
  SyntaxKind3[SyntaxKind3["WhileStatement"] = 5] = "WhileStatement";
  SyntaxKind3[SyntaxKind3["ForStatement"] = 6] = "ForStatement";
  SyntaxKind3[SyntaxKind3["IfCommand"] = 7] = "IfCommand";
  SyntaxKind3[SyntaxKind3["ElseCommand"] = 8] = "ElseCommand";
  SyntaxKind3[SyntaxKind3["ElseIfCommand"] = 9] = "ElseIfCommand";
  SyntaxKind3[SyntaxKind3["EndIfCommand"] = 10] = "EndIfCommand";
  SyntaxKind3[SyntaxKind3["ForStepClause"] = 11] = "ForStepClause";
  SyntaxKind3[SyntaxKind3["ForCommand"] = 12] = "ForCommand";
  SyntaxKind3[SyntaxKind3["EndForCommand"] = 13] = "EndForCommand";
  SyntaxKind3[SyntaxKind3["WhileCommand"] = 14] = "WhileCommand";
  SyntaxKind3[SyntaxKind3["EndWhileCommand"] = 15] = "EndWhileCommand";
  SyntaxKind3[SyntaxKind3["LabelCommand"] = 16] = "LabelCommand";
  SyntaxKind3[SyntaxKind3["GoToCommand"] = 17] = "GoToCommand";
  SyntaxKind3[SyntaxKind3["SubCommand"] = 18] = "SubCommand";
  SyntaxKind3[SyntaxKind3["EndSubCommand"] = 19] = "EndSubCommand";
  SyntaxKind3[SyntaxKind3["ExpressionCommand"] = 20] = "ExpressionCommand";
  SyntaxKind3[SyntaxKind3["CommentCommand"] = 21] = "CommentCommand";
  SyntaxKind3[SyntaxKind3["UnaryOperatorExpression"] = 22] = "UnaryOperatorExpression";
  SyntaxKind3[SyntaxKind3["BinaryOperatorExpression"] = 23] = "BinaryOperatorExpression";
  SyntaxKind3[SyntaxKind3["ObjectAccessExpression"] = 24] = "ObjectAccessExpression";
  SyntaxKind3[SyntaxKind3["ArrayAccessExpression"] = 25] = "ArrayAccessExpression";
  SyntaxKind3[SyntaxKind3["Argument"] = 26] = "Argument";
  SyntaxKind3[SyntaxKind3["InvocationExpression"] = 27] = "InvocationExpression";
  SyntaxKind3[SyntaxKind3["ParenthesisExpression"] = 28] = "ParenthesisExpression";
  SyntaxKind3[SyntaxKind3["IdentifierExpression"] = 29] = "IdentifierExpression";
  SyntaxKind3[SyntaxKind3["NumberLiteralExpression"] = 30] = "NumberLiteralExpression";
  SyntaxKind3[SyntaxKind3["StringLiteralExpression"] = 31] = "StringLiteralExpression";
  SyntaxKind3[SyntaxKind3["Token"] = 32] = "Token";
  return SyntaxKind3;
})(SyntaxKind || {});
var BaseSyntaxNode = class {
  constructor(kind, range) {
    this.kind = kind;
    this.range = range;
  }
  kind;
  range;
  _parentOpt;
  get parentOpt() {
    return this._parentOpt;
  }
  set parentOpt(parentOpt) {
    this._parentOpt = parentOpt;
  }
};
var ParseTreeSyntax = class extends BaseSyntaxNode {
  constructor(mainModule, subModules) {
    super(0 /* ParseTree */, CompilerRange.spanning(
      [mainModule.range, ...subModules.map((subModule) => subModule.range)]
    ));
    this.mainModule = mainModule;
    this.subModules = subModules;
  }
  mainModule;
  subModules;
  children() {
    return [this.mainModule, ...this.subModules];
  }
};
var SubModuleDeclarationSyntax = class extends BaseSyntaxNode {
  constructor(subCommand, statementsList, endSubCommand) {
    super(1 /* SubModuleDeclaration */, CompilerRange.combine(subCommand.range, endSubCommand.range));
    this.subCommand = subCommand;
    this.statementsList = statementsList;
    this.endSubCommand = endSubCommand;
  }
  subCommand;
  statementsList;
  endSubCommand;
  children() {
    return [this.subCommand, this.statementsList, this.endSubCommand];
  }
};
var BaseStatementSyntax = class extends BaseSyntaxNode {
  constructor(kind, range) {
    super(kind, range);
    this.kind = kind;
    this.range = range;
  }
  kind;
  range;
};
var StatementBlockSyntax = class extends BaseSyntaxNode {
  constructor(statements) {
    super(2 /* StatementBlock */, statements.length ? CompilerRange.combine(statements[0].range, statements[statements.length - 1].range) : CompilerRange.fromValues(0, 0, 0, 0));
    this.statements = statements;
  }
  statements;
  children() {
    return this.statements;
  }
};
var IfHeaderSyntax = class extends BaseSyntaxNode {
  constructor(headerCommand, statementsList) {
    super(3 /* IfHeader */, CompilerRange.combine(headerCommand.range, statementsList.range));
    this.headerCommand = headerCommand;
    this.statementsList = statementsList;
  }
  headerCommand;
  statementsList;
  children() {
    return [this.headerCommand, this.statementsList];
  }
};
var IfStatementSyntax = class extends BaseStatementSyntax {
  constructor(ifPart, elseIfParts, elsePartOpt, endIfCommand) {
    super(4 /* IfStatement */, CompilerRange.combine(ifPart.range, endIfCommand.range));
    this.ifPart = ifPart;
    this.elseIfParts = elseIfParts;
    this.elsePartOpt = elsePartOpt;
    this.endIfCommand = endIfCommand;
  }
  ifPart;
  elseIfParts;
  elsePartOpt;
  endIfCommand;
  children() {
    return this.elsePartOpt ? [this.ifPart, ...this.elseIfParts, this.elsePartOpt, this.endIfCommand] : [this.ifPart, ...this.elseIfParts, this.endIfCommand];
  }
};
var WhileStatementSyntax = class extends BaseStatementSyntax {
  constructor(whileCommand, statementsList, endWhileCommand) {
    super(5 /* WhileStatement */, CompilerRange.combine(whileCommand.range, endWhileCommand.range));
    this.whileCommand = whileCommand;
    this.statementsList = statementsList;
    this.endWhileCommand = endWhileCommand;
  }
  whileCommand;
  statementsList;
  endWhileCommand;
  children() {
    return [this.whileCommand, this.statementsList, this.endWhileCommand];
  }
};
var ForStatementSyntax = class extends BaseStatementSyntax {
  constructor(forCommand, statementsList, endForCommand) {
    super(6 /* ForStatement */, CompilerRange.combine(forCommand.range, endForCommand.range));
    this.forCommand = forCommand;
    this.statementsList = statementsList;
    this.endForCommand = endForCommand;
  }
  forCommand;
  statementsList;
  endForCommand;
  children() {
    return [this.forCommand, this.statementsList, this.endForCommand];
  }
};
var BaseCommandSyntax = class extends BaseSyntaxNode {
  constructor(kind, range) {
    super(kind, range);
    this.kind = kind;
    this.range = range;
  }
  kind;
  range;
};
var IfCommandSyntax = class extends BaseCommandSyntax {
  constructor(ifToken, expression, thenToken) {
    super(7 /* IfCommand */, CompilerRange.combine(ifToken.range, thenToken.range));
    this.ifToken = ifToken;
    this.expression = expression;
    this.thenToken = thenToken;
  }
  ifToken;
  expression;
  thenToken;
  children() {
    return [this.ifToken, this.expression, this.thenToken];
  }
};
var ElseCommandSyntax = class extends BaseCommandSyntax {
  constructor(elseToken) {
    super(8 /* ElseCommand */, elseToken.range);
    this.elseToken = elseToken;
  }
  elseToken;
  children() {
    return [this.elseToken];
  }
};
var ElseIfCommandSyntax = class extends BaseCommandSyntax {
  constructor(elseIfToken, expression, thenToken) {
    super(9 /* ElseIfCommand */, CompilerRange.combine(elseIfToken.range, thenToken.range));
    this.elseIfToken = elseIfToken;
    this.expression = expression;
    this.thenToken = thenToken;
  }
  elseIfToken;
  expression;
  thenToken;
  children() {
    return [this.elseIfToken, this.expression, this.thenToken];
  }
};
var EndIfCommandSyntax = class extends BaseCommandSyntax {
  constructor(endIfToken) {
    super(10 /* EndIfCommand */, endIfToken.range);
    this.endIfToken = endIfToken;
  }
  endIfToken;
  children() {
    return [this.endIfToken];
  }
};
var ForStepClauseSyntax = class extends BaseCommandSyntax {
  constructor(stepToken, expression) {
    super(11 /* ForStepClause */, CompilerRange.combine(stepToken.range, expression.range));
    this.stepToken = stepToken;
    this.expression = expression;
  }
  stepToken;
  expression;
  children() {
    return [this.stepToken, this.expression];
  }
};
var ForCommandSyntax = class extends BaseCommandSyntax {
  constructor(forToken, identifierToken, equalToken, fromExpression, toToken, toExpression, stepClauseOpt) {
    super(12 /* ForCommand */, CompilerRange.combine(
      forToken.range,
      stepClauseOpt ? stepClauseOpt.expression.range : toExpression.range
    ));
    this.forToken = forToken;
    this.identifierToken = identifierToken;
    this.equalToken = equalToken;
    this.fromExpression = fromExpression;
    this.toToken = toToken;
    this.toExpression = toExpression;
    this.stepClauseOpt = stepClauseOpt;
  }
  forToken;
  identifierToken;
  equalToken;
  fromExpression;
  toToken;
  toExpression;
  stepClauseOpt;
  children() {
    const children = [this.forToken, this.identifierToken, this.equalToken, this.fromExpression, this.toToken, this.toExpression];
    if (this.stepClauseOpt) {
      children.push(this.stepClauseOpt);
    }
    return children;
  }
};
var EndForCommandSyntax = class extends BaseCommandSyntax {
  constructor(endForToken) {
    super(13 /* EndForCommand */, endForToken.range);
    this.endForToken = endForToken;
  }
  endForToken;
  children() {
    return [this.endForToken];
  }
};
var WhileCommandSyntax = class extends BaseCommandSyntax {
  constructor(whileToken, expression) {
    super(14 /* WhileCommand */, CompilerRange.combine(whileToken.range, expression.range));
    this.whileToken = whileToken;
    this.expression = expression;
  }
  whileToken;
  expression;
  children() {
    return [this.whileToken, this.expression];
  }
};
var EndWhileCommandSyntax = class extends BaseCommandSyntax {
  constructor(endWhileToken) {
    super(15 /* EndWhileCommand */, endWhileToken.range);
    this.endWhileToken = endWhileToken;
  }
  endWhileToken;
  children() {
    return [this.endWhileToken];
  }
};
var LabelCommandSyntax = class extends BaseCommandSyntax {
  constructor(labelToken, colonToken) {
    super(16 /* LabelCommand */, CompilerRange.combine(labelToken.range, colonToken.range));
    this.labelToken = labelToken;
    this.colonToken = colonToken;
  }
  labelToken;
  colonToken;
  children() {
    return [this.labelToken, this.colonToken];
  }
};
var GoToCommandSyntax = class extends BaseCommandSyntax {
  constructor(goToToken, labelToken) {
    super(17 /* GoToCommand */, CompilerRange.combine(goToToken.range, labelToken.range));
    this.goToToken = goToToken;
    this.labelToken = labelToken;
  }
  goToToken;
  labelToken;
  children() {
    return [this.goToToken, this.labelToken];
  }
};
var SubCommandSyntax = class extends BaseCommandSyntax {
  constructor(subToken, nameToken) {
    super(18 /* SubCommand */, CompilerRange.combine(subToken.range, nameToken.range));
    this.subToken = subToken;
    this.nameToken = nameToken;
  }
  subToken;
  nameToken;
  children() {
    return [this.subToken, this.nameToken];
  }
};
var EndSubCommandSyntax = class extends BaseCommandSyntax {
  constructor(endSubToken) {
    super(19 /* EndSubCommand */, endSubToken.range);
    this.endSubToken = endSubToken;
  }
  endSubToken;
  children() {
    return [this.endSubToken];
  }
};
var ExpressionCommandSyntax = class extends BaseCommandSyntax {
  constructor(expression) {
    super(20 /* ExpressionCommand */, expression.range);
    this.expression = expression;
  }
  expression;
  children() {
    return [this.expression];
  }
};
var CommentCommandSyntax = class extends BaseCommandSyntax {
  constructor(commentToken) {
    super(21 /* CommentCommand */, commentToken.range);
    this.commentToken = commentToken;
  }
  commentToken;
  children() {
    return [this.commentToken];
  }
};
var MissingCommandSyntax = class extends BaseCommandSyntax {
  constructor(expectedKind, expectedRange) {
    super(expectedKind, expectedRange);
  }
  children() {
    return [];
  }
};
var BaseExpressionSyntax = class extends BaseSyntaxNode {
  constructor(kind, range) {
    super(kind, range);
    this.kind = kind;
    this.range = range;
  }
  kind;
  range;
};
var UnaryOperatorExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(operatorToken, expression) {
    super(22 /* UnaryOperatorExpression */, CompilerRange.combine(operatorToken.range, expression.range));
    this.operatorToken = operatorToken;
    this.expression = expression;
  }
  operatorToken;
  expression;
  children() {
    return [this.operatorToken, this.expression];
  }
};
var BinaryOperatorExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(leftExpression, operatorToken, rightExpression) {
    super(23 /* BinaryOperatorExpression */, CompilerRange.combine(leftExpression.range, rightExpression.range));
    this.leftExpression = leftExpression;
    this.operatorToken = operatorToken;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  operatorToken;
  rightExpression;
  children() {
    return [this.leftExpression, this.operatorToken, this.rightExpression];
  }
};
var ObjectAccessExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(baseExpression, dotToken, identifierToken) {
    super(24 /* ObjectAccessExpression */, CompilerRange.combine(baseExpression.range, identifierToken.range));
    this.baseExpression = baseExpression;
    this.dotToken = dotToken;
    this.identifierToken = identifierToken;
  }
  baseExpression;
  dotToken;
  identifierToken;
  children() {
    return [this.baseExpression, this.dotToken, this.identifierToken];
  }
};
var ArrayAccessExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(baseExpression, leftBracketToken, indexExpression, rightBracketToken) {
    super(25 /* ArrayAccessExpression */, CompilerRange.combine(baseExpression.range, rightBracketToken.range));
    this.baseExpression = baseExpression;
    this.leftBracketToken = leftBracketToken;
    this.indexExpression = indexExpression;
    this.rightBracketToken = rightBracketToken;
  }
  baseExpression;
  leftBracketToken;
  indexExpression;
  rightBracketToken;
  children() {
    return [this.baseExpression, this.leftBracketToken, this.indexExpression, this.rightBracketToken];
  }
};
var ArgumentSyntax = class extends BaseSyntaxNode {
  constructor(expression, commaOpt) {
    super(26 /* Argument */, commaOpt ? CompilerRange.combine(expression.range, commaOpt.range) : expression.range);
    this.expression = expression;
    this.commaOpt = commaOpt;
  }
  expression;
  commaOpt;
  children() {
    return this.commaOpt ? [this.expression, this.commaOpt] : [this.expression];
  }
};
var InvocationExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(baseExpression, leftParenToken, argumentsList, rightParenToken) {
    super(27 /* InvocationExpression */, CompilerRange.combine(baseExpression.range, rightParenToken.range));
    this.baseExpression = baseExpression;
    this.leftParenToken = leftParenToken;
    this.argumentsList = argumentsList;
    this.rightParenToken = rightParenToken;
  }
  baseExpression;
  leftParenToken;
  argumentsList;
  rightParenToken;
  children() {
    return [this.baseExpression, this.leftParenToken, ...this.argumentsList, this.rightParenToken];
  }
};
var ParenthesisExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(leftParenToken, expression, rightParenToken) {
    super(28 /* ParenthesisExpression */, CompilerRange.combine(leftParenToken.range, rightParenToken.range));
    this.leftParenToken = leftParenToken;
    this.expression = expression;
    this.rightParenToken = rightParenToken;
  }
  leftParenToken;
  expression;
  rightParenToken;
  children() {
    return [this.leftParenToken, this.expression, this.rightParenToken];
  }
};
var IdentifierExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(identifierToken) {
    super(29 /* IdentifierExpression */, identifierToken.range);
    this.identifierToken = identifierToken;
  }
  identifierToken;
  children() {
    return [this.identifierToken];
  }
};
var StringLiteralExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(stringToken) {
    super(31 /* StringLiteralExpression */, stringToken.range);
    this.stringToken = stringToken;
  }
  stringToken;
  children() {
    return [this.stringToken];
  }
};
var NumberLiteralExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(numberToken) {
    super(30 /* NumberLiteralExpression */, numberToken.range);
    this.numberToken = numberToken;
  }
  numberToken;
  children() {
    return [this.numberToken];
  }
};
var TokenSyntax = class extends BaseSyntaxNode {
  constructor(token) {
    super(32 /* Token */, token.range);
    this.token = token;
  }
  token;
  children() {
    return [];
  }
};
var SyntaxNodeVisitor = class {
  visit(node) {
    switch (node.kind) {
      case 0 /* ParseTree */:
        this.visitParseTree(node);
        break;
      case 1 /* SubModuleDeclaration */:
        this.visitSubModuleDeclaration(node);
        break;
      case 2 /* StatementBlock */:
        this.visitStatementBlock(node);
        break;
      case 3 /* IfHeader */:
        this.visitIfHeader(node);
        break;
      case 4 /* IfStatement */:
        this.visitIfStatement(node);
        break;
      case 5 /* WhileStatement */:
        this.visitWhileStatement(node);
        break;
      case 6 /* ForStatement */:
        this.visitForStatement(node);
        break;
      case 7 /* IfCommand */:
        this.visitIfCommand(node);
        break;
      case 8 /* ElseCommand */:
        this.visitElseCommand(node);
        break;
      case 9 /* ElseIfCommand */:
        this.visitElseIfCommand(node);
        break;
      case 10 /* EndIfCommand */:
        this.visitEndIfCommand(node);
        break;
      case 11 /* ForStepClause */:
        this.visitForStepClause(node);
        break;
      case 12 /* ForCommand */:
        this.visitForCommand(node);
        break;
      case 13 /* EndForCommand */:
        this.visitEndForCommand(node);
        break;
      case 14 /* WhileCommand */:
        this.visitWhileCommand(node);
        break;
      case 15 /* EndWhileCommand */:
        this.visitEndWhileCommand(node);
        break;
      case 16 /* LabelCommand */:
        this.visitLabelCommand(node);
        break;
      case 17 /* GoToCommand */:
        this.visitGoToCommand(node);
        break;
      case 18 /* SubCommand */:
        this.visitSubCommand(node);
        break;
      case 19 /* EndSubCommand */:
        this.visitEndSubCommand(node);
        break;
      case 20 /* ExpressionCommand */:
        this.visitExpressionCommand(node);
        break;
      case 21 /* CommentCommand */:
        this.visitCommentCommand(node);
        break;
      case 22 /* UnaryOperatorExpression */:
        this.visitUnaryOperatorExpression(node);
        break;
      case 23 /* BinaryOperatorExpression */:
        this.visitBinaryOperatorExpression(node);
        break;
      case 24 /* ObjectAccessExpression */:
        this.visitObjectAccessExpression(node);
        break;
      case 25 /* ArrayAccessExpression */:
        this.visitArrayAccessExpression(node);
        break;
      case 26 /* Argument */:
        this.visitArgument(node);
        break;
      case 27 /* InvocationExpression */:
        this.visitInvocationExpression(node);
        break;
      case 28 /* ParenthesisExpression */:
        this.visitParenthesisExpression(node);
        break;
      case 29 /* IdentifierExpression */:
        this.visitIdentifierExpression(node);
        break;
      case 30 /* NumberLiteralExpression */:
        this.visitNumberLiteralExpression(node);
        break;
      case 31 /* StringLiteralExpression */:
        this.visitStringLiteralExpression(node);
        break;
      case 32 /* Token */:
        this.visitToken(node);
        break;
      default:
        throw new Error(`Unexpected syntax kind: '${SyntaxKind[node.kind]}'`);
    }
  }
  visitParseTree(node) {
    this.defaultVisit(node);
  }
  visitSubModuleDeclaration(node) {
    this.defaultVisit(node);
  }
  visitStatementBlock(node) {
    this.defaultVisit(node);
  }
  visitIfHeader(node) {
    this.defaultVisit(node);
  }
  visitIfStatement(node) {
    this.defaultVisit(node);
  }
  visitWhileStatement(node) {
    this.defaultVisit(node);
  }
  visitForStatement(node) {
    this.defaultVisit(node);
  }
  visitIfCommand(node) {
    this.defaultVisit(node);
  }
  visitElseCommand(node) {
    this.defaultVisit(node);
  }
  visitElseIfCommand(node) {
    this.defaultVisit(node);
  }
  visitEndIfCommand(node) {
    this.defaultVisit(node);
  }
  visitForStepClause(node) {
    this.defaultVisit(node);
  }
  visitForCommand(node) {
    this.defaultVisit(node);
  }
  visitEndForCommand(node) {
    this.defaultVisit(node);
  }
  visitWhileCommand(node) {
    this.defaultVisit(node);
  }
  visitEndWhileCommand(node) {
    this.defaultVisit(node);
  }
  visitLabelCommand(node) {
    this.defaultVisit(node);
  }
  visitGoToCommand(node) {
    this.defaultVisit(node);
  }
  visitSubCommand(node) {
    this.defaultVisit(node);
  }
  visitEndSubCommand(node) {
    this.defaultVisit(node);
  }
  visitExpressionCommand(node) {
    this.defaultVisit(node);
  }
  visitCommentCommand(node) {
    this.defaultVisit(node);
  }
  visitUnaryOperatorExpression(node) {
    this.defaultVisit(node);
  }
  visitBinaryOperatorExpression(node) {
    this.defaultVisit(node);
  }
  visitObjectAccessExpression(node) {
    this.defaultVisit(node);
  }
  visitArrayAccessExpression(node) {
    this.defaultVisit(node);
  }
  visitArgument(node) {
    this.defaultVisit(node);
  }
  visitInvocationExpression(node) {
    this.defaultVisit(node);
  }
  visitParenthesisExpression(node) {
    this.defaultVisit(node);
  }
  visitIdentifierExpression(node) {
    this.defaultVisit(node);
  }
  visitNumberLiteralExpression(node) {
    this.defaultVisit(node);
  }
  visitStringLiteralExpression(node) {
    this.defaultVisit(node);
  }
  visitToken(node) {
    this.defaultVisit(node);
  }
  defaultVisit(node) {
    node.children().forEach((child) => this.visit(child));
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/tokens.ts
var TokenKind = /* @__PURE__ */ ((TokenKind2) => {
  TokenKind2[TokenKind2["UnrecognizedToken"] = 0] = "UnrecognizedToken";
  TokenKind2[TokenKind2["IfKeyword"] = 1] = "IfKeyword";
  TokenKind2[TokenKind2["ThenKeyword"] = 2] = "ThenKeyword";
  TokenKind2[TokenKind2["ElseKeyword"] = 3] = "ElseKeyword";
  TokenKind2[TokenKind2["ElseIfKeyword"] = 4] = "ElseIfKeyword";
  TokenKind2[TokenKind2["EndIfKeyword"] = 5] = "EndIfKeyword";
  TokenKind2[TokenKind2["ForKeyword"] = 6] = "ForKeyword";
  TokenKind2[TokenKind2["ToKeyword"] = 7] = "ToKeyword";
  TokenKind2[TokenKind2["StepKeyword"] = 8] = "StepKeyword";
  TokenKind2[TokenKind2["EndForKeyword"] = 9] = "EndForKeyword";
  TokenKind2[TokenKind2["GoToKeyword"] = 10] = "GoToKeyword";
  TokenKind2[TokenKind2["WhileKeyword"] = 11] = "WhileKeyword";
  TokenKind2[TokenKind2["EndWhileKeyword"] = 12] = "EndWhileKeyword";
  TokenKind2[TokenKind2["SubKeyword"] = 13] = "SubKeyword";
  TokenKind2[TokenKind2["EndSubKeyword"] = 14] = "EndSubKeyword";
  TokenKind2[TokenKind2["Dot"] = 15] = "Dot";
  TokenKind2[TokenKind2["RightParen"] = 16] = "RightParen";
  TokenKind2[TokenKind2["LeftParen"] = 17] = "LeftParen";
  TokenKind2[TokenKind2["RightSquareBracket"] = 18] = "RightSquareBracket";
  TokenKind2[TokenKind2["LeftSquareBracket"] = 19] = "LeftSquareBracket";
  TokenKind2[TokenKind2["Comma"] = 20] = "Comma";
  TokenKind2[TokenKind2["Equal"] = 21] = "Equal";
  TokenKind2[TokenKind2["NotEqual"] = 22] = "NotEqual";
  TokenKind2[TokenKind2["Plus"] = 23] = "Plus";
  TokenKind2[TokenKind2["Minus"] = 24] = "Minus";
  TokenKind2[TokenKind2["Multiply"] = 25] = "Multiply";
  TokenKind2[TokenKind2["Divide"] = 26] = "Divide";
  TokenKind2[TokenKind2["Colon"] = 27] = "Colon";
  TokenKind2[TokenKind2["LessThan"] = 28] = "LessThan";
  TokenKind2[TokenKind2["GreaterThan"] = 29] = "GreaterThan";
  TokenKind2[TokenKind2["LessThanOrEqual"] = 30] = "LessThanOrEqual";
  TokenKind2[TokenKind2["GreaterThanOrEqual"] = 31] = "GreaterThanOrEqual";
  TokenKind2[TokenKind2["Or"] = 32] = "Or";
  TokenKind2[TokenKind2["And"] = 33] = "And";
  TokenKind2[TokenKind2["Identifier"] = 34] = "Identifier";
  TokenKind2[TokenKind2["NumberLiteral"] = 35] = "NumberLiteral";
  TokenKind2[TokenKind2["StringLiteral"] = 36] = "StringLiteral";
  TokenKind2[TokenKind2["Comment"] = 37] = "Comment";
  return TokenKind2;
})(TokenKind || {});
var Token = class {
  constructor(text, kind, range) {
    this.text = text;
    this.kind = kind;
    this.range = range;
  }
  text;
  kind;
  range;
};

// ../../vendor/SmallBasicOnline/src/strings/compiler.ts
var CompilerResources;
((CompilerResources2) => {
  CompilerResources2.SyntaxNodes_Identifier = "identifier";
  CompilerResources2.SyntaxNodes_StringLiteral = "string";
  CompilerResources2.SyntaxNodes_NumberLiteral = "number";
  CompilerResources2.SyntaxNodes_Comment = "comment";
  CompilerResources2.SyntaxNodes_Label = "label";
  CompilerResources2.SyntaxNodes_Expression = "expression";
  CompilerResources2.ProgramKind_TextWindow = "Text Window";
  CompilerResources2.ProgramKind_Turtle = "Turtle";
  function get(key) {
    return CompilerResources2[key];
  }
  CompilerResources2.get = get;
})(CompilerResources || (CompilerResources = {}));

// ../../vendor/SmallBasicOnline/src/compiler/utils/compiler-utils.ts
var CompilerUtils;
((CompilerUtils2) => {
  function formatString(template, args) {
    return template.replace(/{[0-9]+}/g, (match) => args[parseInt(match.replace(/^{/, "").replace(/}$/, ""))]);
  }
  CompilerUtils2.formatString = formatString;
  function stringStartsWith(value, prefix) {
    if (!prefix || !prefix.length) {
      return true;
    }
    value = value.toLowerCase();
    prefix = prefix.toLowerCase();
    return value.length >= prefix.length && value.substr(0, prefix.length) === prefix;
  }
  CompilerUtils2.stringStartsWith = stringStartsWith;
  function findKeyIgnoreCase(parent, name) {
    if (Object.prototype.hasOwnProperty.call(parent, name)) {
      return name;
    }
    const lower = name.toLowerCase();
    for (const key of Object.keys(parent)) {
      if (key.toLowerCase() === lower) {
        return key;
      }
    }
    return void 0;
  }
  CompilerUtils2.findKeyIgnoreCase = findKeyIgnoreCase;
  function lookupIgnoreCase(parent, name) {
    const key = findKeyIgnoreCase(parent, name);
    return key === void 0 ? void 0 : parent[key];
  }
  CompilerUtils2.lookupIgnoreCase = lookupIgnoreCase;
  function values(parent) {
    return Object.keys(parent).map((key) => parent[key]);
  }
  CompilerUtils2.values = values;
  function commandToDisplayString(kind) {
    switch (kind) {
      case 7 /* IfCommand */:
        return tokenToDisplayString(1 /* IfKeyword */);
      case 8 /* ElseCommand */:
        return tokenToDisplayString(3 /* ElseKeyword */);
      case 9 /* ElseIfCommand */:
        return tokenToDisplayString(4 /* ElseIfKeyword */);
      case 10 /* EndIfCommand */:
        return tokenToDisplayString(5 /* EndIfKeyword */);
      case 12 /* ForCommand */:
        return tokenToDisplayString(6 /* ForKeyword */);
      case 13 /* EndForCommand */:
        return tokenToDisplayString(9 /* EndForKeyword */);
      case 14 /* WhileCommand */:
        return tokenToDisplayString(11 /* WhileKeyword */);
      case 15 /* EndWhileCommand */:
        return tokenToDisplayString(12 /* EndWhileKeyword */);
      case 16 /* LabelCommand */:
        return CompilerResources.SyntaxNodes_Label;
      case 17 /* GoToCommand */:
        return tokenToDisplayString(10 /* GoToKeyword */);
      case 18 /* SubCommand */:
        return tokenToDisplayString(13 /* SubKeyword */);
      case 19 /* EndSubCommand */:
        return tokenToDisplayString(14 /* EndSubKeyword */);
      case 20 /* ExpressionCommand */:
        return CompilerResources.SyntaxNodes_Expression;
      default:
        throw new Error(`Unexpected syntax kind: ${SyntaxKind[kind]}`);
    }
  }
  CompilerUtils2.commandToDisplayString = commandToDisplayString;
  function tokenToDisplayString(kind) {
    switch (kind) {
      case 1 /* IfKeyword */:
        return "If";
      case 2 /* ThenKeyword */:
        return "Then";
      case 3 /* ElseKeyword */:
        return "Else";
      case 4 /* ElseIfKeyword */:
        return "ElseIf";
      case 5 /* EndIfKeyword */:
        return "EndIf";
      case 6 /* ForKeyword */:
        return "For";
      case 7 /* ToKeyword */:
        return "To";
      case 8 /* StepKeyword */:
        return "Step";
      case 9 /* EndForKeyword */:
        return "EndFor";
      case 10 /* GoToKeyword */:
        return "GoTo";
      case 11 /* WhileKeyword */:
        return "While";
      case 12 /* EndWhileKeyword */:
        return "EndWhile";
      case 13 /* SubKeyword */:
        return "Sub";
      case 14 /* EndSubKeyword */:
        return "EndSub";
      case 15 /* Dot */:
        return ".";
      case 16 /* RightParen */:
        return ")";
      case 17 /* LeftParen */:
        return "(";
      case 18 /* RightSquareBracket */:
        return "]";
      case 19 /* LeftSquareBracket */:
        return "[";
      case 20 /* Comma */:
        return ",";
      case 21 /* Equal */:
        return "=";
      case 22 /* NotEqual */:
        return "<>";
      case 23 /* Plus */:
        return "+";
      case 24 /* Minus */:
        return "-";
      case 25 /* Multiply */:
        return "*";
      case 26 /* Divide */:
        return "/";
      case 27 /* Colon */:
        return ":";
      case 28 /* LessThan */:
        return "<";
      case 29 /* GreaterThan */:
        return ">";
      case 30 /* LessThanOrEqual */:
        return "<=";
      case 31 /* GreaterThanOrEqual */:
        return ">=";
      case 32 /* Or */:
        return "Or";
      case 33 /* And */:
        return "And";
      case 34 /* Identifier */:
        return CompilerResources.SyntaxNodes_Identifier;
      case 35 /* NumberLiteral */:
        return CompilerResources.SyntaxNodes_NumberLiteral;
      case 36 /* StringLiteral */:
        return CompilerResources.SyntaxNodes_StringLiteral;
      case 37 /* Comment */:
        return CompilerResources.SyntaxNodes_Comment;
      default:
        throw new Error(`Unrecognized token kind: ${TokenKind[kind]}`);
    }
  }
  CompilerUtils2.tokenToDisplayString = tokenToDisplayString;
})(CompilerUtils || (CompilerUtils = {}));

// ../../vendor/SmallBasicOnline/src/strings/diagnostics.ts
var DiagnosticsResources;
((DiagnosticsResources2) => {
  DiagnosticsResources2.UnrecognizedCharacter = "I don't understand this character '{0}'.";
  DiagnosticsResources2.UnterminatedStringLiteral = "This string is missing its right double quotes.";
  DiagnosticsResources2.UnrecognizedCommand = "'{0}' is not a valid command.";
  DiagnosticsResources2.UnexpectedToken_ExpectingExpression = "Unexpected '{0}' here. I was expecting an expression instead.";
  DiagnosticsResources2.UnexpectedToken_ExpectingToken = "Unexpected '{0}' here. I was expecting a token of type '{1}' instead.";
  DiagnosticsResources2.UnexpectedToken_ExpectingEOL = "Unexpected '{0}' here. I was expecting a new line after the previous command.";
  DiagnosticsResources2.UnexpectedEOL_ExpectingExpression = "Unexpected end of line here. I was expecting an expression instead.";
  DiagnosticsResources2.UnexpectedEOL_ExpectingToken = "Unexpected end of line here. I was expecting a token of type '{0}' instead.";
  DiagnosticsResources2.UnexpectedCommand_ExpectingCommand = "Unexpected command of type '{0}'. I was expecting a command of type '{1}'.";
  DiagnosticsResources2.UnexpectedEOF_ExpectingCommand = "Unexpected end of file. I was expecting a command of type '{0}'.";
  DiagnosticsResources2.CannotDefineASubInsideAnotherSub = "You cannot define a sub-module inside another sub-module.";
  DiagnosticsResources2.CannotHaveCommandWithoutPreviousCommand = "You cannot write a command of type '{0}' without an earlier command of type '{1}'.";
  DiagnosticsResources2.TwoSubModulesWithTheSameName = "Another sub-module with the same name '{0}' is already defined.";
  DiagnosticsResources2.LabelDoesNotExist = "No label with the name '{0}' exists in the same module.";
  DiagnosticsResources2.UnassignedExpressionStatement = "This value is not assigned to anything. Did you mean to assign it to a variable?";
  DiagnosticsResources2.InvalidExpressionStatement = "This expression is not a valid statement.";
  DiagnosticsResources2.UnexpectedVoid_ExpectingValue = "This expression must return a value to be used here.";
  DiagnosticsResources2.UnsupportedArrayBaseExpression = "This expression is not a valid array.";
  DiagnosticsResources2.UnsupportedCallBaseExpression = "This expression is not a valid submodule or method to be called.";
  DiagnosticsResources2.UnexpectedArgumentsCount = "I was expecting {0} arguments, but found {1} instead.";
  DiagnosticsResources2.PropertyHasNoSetter = "This property cannot be set. You can only get its value.";
  DiagnosticsResources2.AssigningNonSubModuleToEvent = "You can only assign submodules to events.";
  DiagnosticsResources2.UnsupportedDotBaseExpression = "You can only use dot access with a library. Did you mean to use an existing library instead?";
  DiagnosticsResources2.LibraryMemberNotFound = "The library '{0}' has no member named '{1}'.";
  DiagnosticsResources2.ValueIsNotANumber = "The value '{0}' is not a valid number.";
  DiagnosticsResources2.ValueIsNotAssignable = "You cannot assign to this expression. Did you mean to use a variable instead?";
  DiagnosticsResources2.CannotUseAnArrayAsAnIndexToAnotherArray = "You cannot use an array as an index to access another array. Did you mean to use a string or a number instead?";
  DiagnosticsResources2.CannotUseOperatorWithAnArray = "You cannot use the operator '{0}' with an array value";
  DiagnosticsResources2.CannotUseOperatorWithAString = "You cannot use the operator '{0}' with a string value";
  DiagnosticsResources2.CannotDivideByZero = "You cannot divide by zero. Please consider checking the divisor before dividing.";
  DiagnosticsResources2.PoppingAnEmptyStack = "This stack has no elements to be popped";
  function get(key) {
    return DiagnosticsResources2[key];
  }
  DiagnosticsResources2.get = get;
})(DiagnosticsResources || (DiagnosticsResources = {}));

// ../../vendor/SmallBasicOnline/src/compiler/utils/diagnostics.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2[ErrorCode2["UnrecognizedCharacter"] = 0] = "UnrecognizedCharacter";
  ErrorCode2[ErrorCode2["UnterminatedStringLiteral"] = 1] = "UnterminatedStringLiteral";
  ErrorCode2[ErrorCode2["UnrecognizedCommand"] = 2] = "UnrecognizedCommand";
  ErrorCode2[ErrorCode2["UnexpectedToken_ExpectingExpression"] = 3] = "UnexpectedToken_ExpectingExpression";
  ErrorCode2[ErrorCode2["UnexpectedToken_ExpectingToken"] = 4] = "UnexpectedToken_ExpectingToken";
  ErrorCode2[ErrorCode2["UnexpectedToken_ExpectingEOL"] = 5] = "UnexpectedToken_ExpectingEOL";
  ErrorCode2[ErrorCode2["UnexpectedEOL_ExpectingExpression"] = 6] = "UnexpectedEOL_ExpectingExpression";
  ErrorCode2[ErrorCode2["UnexpectedEOL_ExpectingToken"] = 7] = "UnexpectedEOL_ExpectingToken";
  ErrorCode2[ErrorCode2["UnexpectedCommand_ExpectingCommand"] = 8] = "UnexpectedCommand_ExpectingCommand";
  ErrorCode2[ErrorCode2["UnexpectedEOF_ExpectingCommand"] = 9] = "UnexpectedEOF_ExpectingCommand";
  ErrorCode2[ErrorCode2["CannotDefineASubInsideAnotherSub"] = 10] = "CannotDefineASubInsideAnotherSub";
  ErrorCode2[ErrorCode2["CannotHaveCommandWithoutPreviousCommand"] = 11] = "CannotHaveCommandWithoutPreviousCommand";
  ErrorCode2[ErrorCode2["ValueIsNotANumber"] = 12] = "ValueIsNotANumber";
  ErrorCode2[ErrorCode2["TwoSubModulesWithTheSameName"] = 13] = "TwoSubModulesWithTheSameName";
  ErrorCode2[ErrorCode2["LabelDoesNotExist"] = 14] = "LabelDoesNotExist";
  ErrorCode2[ErrorCode2["UnassignedExpressionStatement"] = 15] = "UnassignedExpressionStatement";
  ErrorCode2[ErrorCode2["InvalidExpressionStatement"] = 16] = "InvalidExpressionStatement";
  ErrorCode2[ErrorCode2["UnexpectedVoid_ExpectingValue"] = 17] = "UnexpectedVoid_ExpectingValue";
  ErrorCode2[ErrorCode2["UnsupportedArrayBaseExpression"] = 18] = "UnsupportedArrayBaseExpression";
  ErrorCode2[ErrorCode2["UnsupportedCallBaseExpression"] = 19] = "UnsupportedCallBaseExpression";
  ErrorCode2[ErrorCode2["UnexpectedArgumentsCount"] = 20] = "UnexpectedArgumentsCount";
  ErrorCode2[ErrorCode2["PropertyHasNoSetter"] = 21] = "PropertyHasNoSetter";
  ErrorCode2[ErrorCode2["AssigningNonSubModuleToEvent"] = 22] = "AssigningNonSubModuleToEvent";
  ErrorCode2[ErrorCode2["UnsupportedDotBaseExpression"] = 23] = "UnsupportedDotBaseExpression";
  ErrorCode2[ErrorCode2["LibraryMemberNotFound"] = 24] = "LibraryMemberNotFound";
  ErrorCode2[ErrorCode2["ValueIsNotAssignable"] = 25] = "ValueIsNotAssignable";
  ErrorCode2[ErrorCode2["CannotUseAnArrayAsAnIndexToAnotherArray"] = 26] = "CannotUseAnArrayAsAnIndexToAnotherArray";
  ErrorCode2[ErrorCode2["CannotUseOperatorWithAnArray"] = 27] = "CannotUseOperatorWithAnArray";
  ErrorCode2[ErrorCode2["CannotUseOperatorWithAString"] = 28] = "CannotUseOperatorWithAString";
  ErrorCode2[ErrorCode2["CannotDivideByZero"] = 29] = "CannotDivideByZero";
  ErrorCode2[ErrorCode2["PoppingAnEmptyStack"] = 30] = "PoppingAnEmptyStack";
  return ErrorCode2;
})(ErrorCode || {});
var Diagnostic = class {
  constructor(code, range, ...args) {
    this.code = code;
    this.range = range;
    this.args = args;
  }
  code;
  range;
  args;
  toString() {
    const template = DiagnosticsResources.get(ErrorCode[this.code]);
    if (!template) {
      throw new Error(`Error code ${ErrorCode[this.code]} has no string resource`);
    }
    return CompilerUtils.formatString(template, this.args);
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/number-value.ts
var NumberValue = class _NumberValue extends BaseValue {
  constructor(value) {
    super();
    this.value = value;
  }
  value;
  toBoolean() {
    return false;
  }
  toDebuggerString() {
    return this.value.toString();
  }
  toValueString() {
    return this.toDebuggerString();
  }
  get kind() {
    return 1 /* Number */;
  }
  tryConvertToNumber() {
    return this;
  }
  isEqualTo(other) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        return this.value.toString() === other.value;
      case 1 /* Number */:
        return this.value === other.value;
      case 2 /* Array */:
        return false;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  isLessThan(other) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
      case 2 /* Array */:
        return false;
      case 1 /* Number */:
        return this.value < other.value;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  isGreaterThan(other) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
      case 2 /* Array */:
        return false;
      case 1 /* Number */:
        return this.value > other.value;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  add(other, engine, instruction) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        return new StringValue(this.value.toString() + other.value);
      case 1 /* Number */:
        return new _NumberValue(this.value + other.value);
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(23 /* Plus */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  subtract(other, engine, instruction) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
        return this;
      case 1 /* Number */:
        return new _NumberValue(this.value - other.value);
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  multiply(other, engine, instruction) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(25 /* Multiply */)));
        return this;
      case 1 /* Number */:
        return new _NumberValue(this.value * other.value);
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(25 /* Multiply */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  divide(other, engine, instruction) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(26 /* Divide */)));
        return this;
      case 1 /* Number */:
        const otherValue = other.value;
        if (otherValue === 0) {
          engine.terminate(new Diagnostic(29 /* CannotDivideByZero */, instruction.sourceRange));
          return this;
        } else {
          return new _NumberValue(this.value / otherValue);
        }
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(26 /* Divide */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/string-value.ts
var StringValue = class _StringValue extends BaseValue {
  constructor(value) {
    super();
    this.value = value;
  }
  value;
  toBoolean() {
    return this.value.toLowerCase() === Constants.True.toLowerCase();
  }
  toDebuggerString() {
    return `"${this.value.toString()}"`;
  }
  toValueString() {
    return this.value;
  }
  get kind() {
    return 0 /* String */;
  }
  tryConvertToNumber() {
    const number = parseFloat(this.value.trim());
    if (isNaN(number)) {
      return this;
    } else {
      return new NumberValue(number);
    }
  }
  isEqualTo(other) {
    switch (other.kind) {
      case 0 /* String */:
        return this.value === other.value;
      case 1 /* Number */:
        return this.value.trim() === other.value.toString();
      case 2 /* Array */:
        return false;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  isLessThan(other) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      return false;
    } else {
      return thisConverted.isLessThan(other);
    }
  }
  isGreaterThan(other) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      return false;
    } else {
      return thisConverted.isGreaterThan(other);
    }
  }
  add(other, engine, instruction) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind !== 0 /* String */) {
      return thisConverted.add(other, engine, instruction);
    }
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        return new _StringValue(this.value + other.value);
      case 1 /* Number */:
        return new _StringValue(this.value + other.value.toString());
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(23 /* Plus */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  subtract(other, engine, instruction) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
      return this;
    } else {
      return thisConverted.subtract(other, engine, instruction);
    }
  }
  multiply(other, engine, instruction) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(25 /* Multiply */)));
      return this;
    } else {
      return thisConverted.multiply(other, engine, instruction);
    }
  }
  divide(other, engine, instruction) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(26 /* Divide */)));
      return this;
    } else {
      return thisConverted.divide(other, engine, instruction);
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/text-window.ts
var TextWindowColor = /* @__PURE__ */ ((TextWindowColor2) => {
  TextWindowColor2[TextWindowColor2["Black"] = 0] = "Black";
  TextWindowColor2[TextWindowColor2["DarkBlue"] = 1] = "DarkBlue";
  TextWindowColor2[TextWindowColor2["DarkGreen"] = 2] = "DarkGreen";
  TextWindowColor2[TextWindowColor2["DarkCyan"] = 3] = "DarkCyan";
  TextWindowColor2[TextWindowColor2["DarkRed"] = 4] = "DarkRed";
  TextWindowColor2[TextWindowColor2["DarkMagenta"] = 5] = "DarkMagenta";
  TextWindowColor2[TextWindowColor2["DarkYellow"] = 6] = "DarkYellow";
  TextWindowColor2[TextWindowColor2["Gray"] = 7] = "Gray";
  TextWindowColor2[TextWindowColor2["DarkGray"] = 8] = "DarkGray";
  TextWindowColor2[TextWindowColor2["Blue"] = 9] = "Blue";
  TextWindowColor2[TextWindowColor2["Green"] = 10] = "Green";
  TextWindowColor2[TextWindowColor2["Cyan"] = 11] = "Cyan";
  TextWindowColor2[TextWindowColor2["Red"] = 12] = "Red";
  TextWindowColor2[TextWindowColor2["Magenta"] = 13] = "Magenta";
  TextWindowColor2[TextWindowColor2["Yellow"] = 14] = "Yellow";
  TextWindowColor2[TextWindowColor2["White"] = 15] = "White";
  return TextWindowColor2;
})(TextWindowColor || {});
var TextWindowLibrary = class {
  _pluginInstance;
  get plugin() {
    if (!this._pluginInstance) {
      throw new Error("Plugin is not set.");
    }
    return this._pluginInstance;
  }
  set plugin(plugin) {
    this._pluginInstance = plugin;
  }
  executeReadMethod(engine, kind) {
    const bufferValue = this.plugin.checkInputBuffer();
    if (bufferValue) {
      if (bufferValue.kind !== kind) {
        throw new Error(`Expecting input kind '${ValueKind[kind]}' but buffer has kind '${ValueKind[bufferValue.kind]}'`);
      }
      engine.pushEvaluationStack(bufferValue);
      engine.state = 0 /* Running */;
    } else {
      engine.state = 2 /* BlockedOnInput */;
      this.plugin.inputIsNeeded(kind);
    }
  }
  executeWriteMethod(engine, appendNewLine) {
    const value = engine.popEvaluationStack().toValueString();
    this.plugin.writeText(value, appendNewLine);
  }
  tryParseColorValue(value) {
    switch (value.kind) {
      case 1 /* Number */: {
        const numberValue = value.value;
        if (TextWindowColor[numberValue]) {
          return numberValue;
        }
        break;
      }
      case 0 /* String */: {
        const stringValue = value.value.toLowerCase();
        for (let color in TextWindowColor) {
          if (color.toLowerCase() === stringValue) {
            return TextWindowColor[color];
          }
        }
        break;
      }
    }
    return void 0;
  }
  setForegroundColor(value) {
    const color = this.tryParseColorValue(value);
    if (color) {
      this.plugin.setForegroundColor(color);
    }
  }
  setBackgroundColor(value) {
    const color = this.tryParseColorValue(value);
    if (color) {
      this.plugin.setBackgroundColor(color);
    }
  }
  getForegroundColor() {
    return new StringValue(TextWindowColor[this.plugin.getForegroundColor()]);
  }
  getBackgroundColor() {
    return new StringValue(TextWindowColor[this.plugin.getBackgroundColor()]);
  }
  methods = {
    Read: { execute: (engine) => this.executeReadMethod(engine, 0 /* String */) },
    ReadNumber: { execute: (engine) => this.executeReadMethod(engine, 1 /* Number */) },
    Write: { execute: (engine) => this.executeWriteMethod(engine, false) },
    WriteLine: { execute: (engine) => this.executeWriteMethod(engine, true) }
  };
  properties = {
    ForegroundColor: { getter: this.getForegroundColor.bind(this), setter: this.setForegroundColor.bind(this) },
    BackgroundColor: { getter: this.getBackgroundColor.bind(this), setter: this.setBackgroundColor.bind(this) }
  };
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/program.ts
var ProgramLibrary = class {
  async executeDelay(engine) {
    const milliSecondsArg = engine.popEvaluationStack().tryConvertToNumber();
    const milliSecondsValue = milliSecondsArg.kind === 1 /* Number */ ? milliSecondsArg.value : 0;
    const executionState = engine.state;
    engine.state = 2 /* BlockedOnInput */;
    await new Promise((resolve) => setTimeout(resolve, milliSecondsValue));
    engine.state = executionState;
  }
  executePause(engine, mode) {
    if (engine.state === 1 /* Paused */) {
      engine.state = 0 /* Running */;
    } else if (mode === 1 /* Debug */) {
      engine.state = 1 /* Paused */;
    }
  }
  executeEnd(engine) {
    engine.terminate();
  }
  methods = {
    Delay: { execute: this.executeDelay.bind(this) },
    Pause: { execute: this.executePause.bind(this) },
    End: { execute: this.executeEnd.bind(this) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/clock.ts
var ClockLibrary = class {
  getTime() {
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    return new StringValue(time);
  }
  methods = {};
  properties = {
    Time: { getter: this.getTime.bind(this) }
  };
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/array-value.ts
var ArrayValue = class extends BaseValue {
  _values;
  constructor(value = {}) {
    super();
    this._values = value;
  }
  get values() {
    return this._values;
  }
  setIndex(index, value) {
    this._values[this.resolveKey(index)] = value;
  }
  getValue(index) {
    return this._values[this.resolveKey(index)];
  }
  deleteIndex(index) {
    delete this._values[this.resolveKey(index)];
  }
  // Small Basic array indices (and thus variable names) are case insensitive.
  resolveKey(index) {
    const lower = index.toLowerCase();
    for (const key of Object.keys(this._values)) {
      if (key.toLowerCase() === lower) {
        return key;
      }
    }
    return index;
  }
  toBoolean() {
    return false;
  }
  toDebuggerString() {
    return `[${Object.keys(this._values).map((key) => `${key}=${this._values[key].toDebuggerString()}`).join(", ")}]`;
  }
  toValueString() {
    return this.toDebuggerString();
  }
  get kind() {
    return 2 /* Array */;
  }
  tryConvertToNumber() {
    return this;
  }
  isEqualTo(other) {
    switch (other.kind) {
      case 0 /* String */:
      case 1 /* Number */:
        return false;
      case 2 /* Array */:
        return this.toDebuggerString() === other.toDebuggerString();
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  isLessThan(_) {
    return false;
  }
  isGreaterThan(_) {
    return false;
  }
  add(_, engine, instruction) {
    engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(23 /* Plus */)));
    return this;
  }
  subtract(_, engine, instruction) {
    engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
    return this;
  }
  multiply(_, engine, instruction) {
    engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(25 /* Multiply */)));
    return this;
  }
  divide(_, engine, instruction) {
    engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(26 /* Divide */)));
    return this;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/array.ts
var ArrayLibrary = class {
  arrays = {};
  normalizeArrayName(name) {
    return name.toLowerCase();
  }
  executeIsArray(engine) {
    const value = engine.popEvaluationStack();
    engine.pushEvaluationStack(new StringValue(value.kind === 2 /* Array */ ? Constants.True : Constants.False));
  }
  executeGetItemCount(engine) {
    const array = engine.popEvaluationStack();
    const itemCount = array.kind === 2 /* Array */ ? Object.keys(array.values).length : 0;
    engine.pushEvaluationStack(new NumberValue(itemCount));
  }
  executeGetAllIndices(engine) {
    const array = engine.popEvaluationStack();
    const newArray = {};
    if (array.kind === 2 /* Array */) {
      Object.keys(array.values).forEach((key, i) => {
        newArray[i + 1] = new StringValue(key);
      });
    }
    engine.pushEvaluationStack(new ArrayValue(newArray));
  }
  executeContainsValue(engine) {
    const value = engine.popEvaluationStack();
    const array = engine.popEvaluationStack();
    let result = Constants.False;
    if (array.kind === 2 /* Array */) {
      const arrayValue = array.values;
      for (let key in arrayValue) {
        if (arrayValue[key].isEqualTo(value)) {
          result = Constants.True;
          break;
        }
      }
    }
    engine.pushEvaluationStack(new StringValue(result));
  }
  executeContainsIndex(engine) {
    const index = engine.popEvaluationStack().tryConvertToNumber();
    const array = engine.popEvaluationStack();
    let result = Constants.False;
    if (array.kind === 2 /* Array */) {
      if (index.kind === 1 /* Number */ || index.kind === 0 /* String */) {
        if (array.getValue(index.toValueString())) {
          result = Constants.True;
        }
      }
    }
    engine.pushEvaluationStack(new StringValue(result));
  }
  executeGetValue(engine) {
    const index = engine.popEvaluationStack().toValueString();
    const arrayName = engine.popEvaluationStack().toValueString();
    const array = this.arrays[this.normalizeArrayName(arrayName)];
    engine.pushEvaluationStack(array?.getValue(index) ?? new StringValue(""));
  }
  executeRemoveValue(engine) {
    const index = engine.popEvaluationStack().toValueString();
    const arrayName = this.normalizeArrayName(engine.popEvaluationStack().toValueString());
    const array = this.arrays[arrayName];
    if (array?.getValue(index)) {
      array.deleteIndex(index);
      this.arrays[arrayName] = array;
    }
  }
  executeSetValue(engine) {
    const value = engine.popEvaluationStack();
    const index = engine.popEvaluationStack().toValueString();
    const arrayName = this.normalizeArrayName(engine.popEvaluationStack().toValueString());
    const array = this.arrays[arrayName] ?? new ArrayValue();
    array.setIndex(index, value);
    this.arrays[arrayName] = array;
  }
  methods = {
    IsArray: { execute: this.executeIsArray.bind(this) },
    GetItemCount: { execute: this.executeGetItemCount.bind(this) },
    GetAllIndices: { execute: this.executeGetAllIndices.bind(this) },
    ContainsValue: { execute: this.executeContainsValue.bind(this) },
    ContainsIndex: { execute: this.executeContainsIndex.bind(this) },
    GetValue: { execute: this.executeGetValue.bind(this) },
    RemoveValue: { execute: this.executeRemoveValue.bind(this) },
    SetValue: { execute: this.executeSetValue.bind(this) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/stack.ts
var StackLibrary = class {
  _stacks = {};
  executePushValue(engine) {
    const value = engine.popEvaluationStack();
    const stackName = engine.popEvaluationStack().toValueString();
    if (!this._stacks[stackName]) {
      this._stacks[stackName] = [];
    }
    this._stacks[stackName].push(value);
  }
  executeGetCount(engine) {
    const stackName = engine.popEvaluationStack().toValueString();
    const count = this._stacks[stackName] ? this._stacks[stackName].length : 0;
    engine.pushEvaluationStack(new NumberValue(count));
  }
  executePopValue(engine, _, range) {
    const stackName = engine.popEvaluationStack().toValueString();
    if (this._stacks[stackName] && this._stacks[stackName].length) {
      engine.pushEvaluationStack(this._stacks[stackName].pop());
    } else {
      engine.terminate(new Diagnostic(30 /* PoppingAnEmptyStack */, range));
    }
  }
  methods = {
    PushValue: { execute: this.executePushValue.bind(this) },
    GetCount: { execute: this.executeGetCount.bind(this) },
    PopValue: { execute: this.executePopValue.bind(this) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/strings/documentation.ts
var DocumentationResources;
((DocumentationResources2) => {
  DocumentationResources2.Array = "This class provides a way of storing more than one value for a given name. These values can be accessed by another index.";
  DocumentationResources2.Array_ContainsIndex = "Gets whether or not the array contains the specified index. This is very useful when deciding if the array's index was initialized by some value or not.";
  DocumentationResources2.Array_ContainsIndex_Array = "The array to check.";
  DocumentationResources2.Array_ContainsIndex_Index = "The index to check.";
  DocumentationResources2.Array_ContainsValue = "Gets whether or not the array contains the specified value. This is very useful when deciding if the array's value was stored in some index.";
  DocumentationResources2.Array_ContainsValue_Array = "The array to check.";
  DocumentationResources2.Array_ContainsValue_Index = "The index to check.";
  DocumentationResources2.Array_GetAllIndices = "Gets all the indices for the array, as another array. The index of the returned array starts from 1.";
  DocumentationResources2.Array_GetAllIndices_Array = "The array whose indices are requested.";
  DocumentationResources2.Array_GetItemCount = "Gets the count of all the items in the array.";
  DocumentationResources2.Array_GetItemCount_Array = "The array whose item count is requested.";
  DocumentationResources2.Array_GetValue = "Gets the value stored at the specified index of the named array.";
  DocumentationResources2.Array_GetValue_ArrayName = "The name of the array whose value is requested.";
  DocumentationResources2.Array_GetValue_Index = "The index whose value is requested.";
  DocumentationResources2.Array_IsArray = "Checks whether the value passed is an array or not.";
  DocumentationResources2.Array_IsArray_Value = "The value to check.";
  DocumentationResources2.Array_RemoveValue = "Removes the value stored at the specified index of the named array.";
  DocumentationResources2.Array_RemoveValue_ArrayName = "The name of the array whose value should be removed.";
  DocumentationResources2.Array_RemoveValue_Index = "The index whose value should be removed.";
  DocumentationResources2.Array_SetValue = "Stores the value at the specified index of the named array.";
  DocumentationResources2.Array_SetValue_ArrayName = "The name of the array to update.";
  DocumentationResources2.Array_SetValue_Index = "The index to update.";
  DocumentationResources2.Array_SetValue_Value = "The value to store at the specified index.";
  DocumentationResources2.Clock = "This class provides access to the system clock.";
  DocumentationResources2.Clock_Time = "Gets the current system time.";
  DocumentationResources2.Controls = "The Controls object allows you to add, move and interact with controls.";
  DocumentationResources2.Controls_LastClickedButton = "Gets the last Button that was clicked on the Graphics Window.";
  DocumentationResources2.Controls_LastTypedTextBox = "Gets the last TextBox, text was typed into.";
  DocumentationResources2.Controls_ButtonClicked = "Raises an event when any button control is clicked.";
  DocumentationResources2.Controls_TextTyped = "Raises an event when text is typed into any TextBox control.";
  DocumentationResources2.Controls_AddButton = "Adds a button to the graphics window at the specified position, and returns it.";
  DocumentationResources2.Controls_AddButton_Caption = "The caption to display in the button.";
  DocumentationResources2.Controls_AddButton_Left = "The x co-ordinate of the button.";
  DocumentationResources2.Controls_AddButton_Top = "The y co-ordinate of the button.";
  DocumentationResources2.Controls_GetButtonCaption = "Gets the current caption of the specified button.";
  DocumentationResources2.Controls_GetButtonCaption_ButtonName = "The Button whose caption is requested.";
  DocumentationResources2.Controls_SetButtonCaption = "Sets the caption of the specified button.";
  DocumentationResources2.Controls_SetButtonCaption_ButtonName = "She Button whose caption needs to be set.";
  DocumentationResources2.Controls_SetButtonCaption_Caption = "The new caption for the button.";
  DocumentationResources2.Controls_AddTextBox = "Adds a text input box to the graphics window at the specified position, and returns it.";
  DocumentationResources2.Controls_AddTextBox_Left = "The x co-ordinate of the text box.";
  DocumentationResources2.Controls_AddTextBox_Top = "The y co-ordinate of the text box.";
  DocumentationResources2.Controls_AddMultiLineTextBox = "Adds a multi-line text input box to the graphics window at the specified position, and returns it.";
  DocumentationResources2.Controls_AddMultiLineTextBox_Left = "The x co-ordinate of the text box.";
  DocumentationResources2.Controls_AddMultiLineTextBox_Top = "The y co-ordinate of the text box.";
  DocumentationResources2.Controls_GetTextBoxText = "Gets the current text of the specified TextBox.";
  DocumentationResources2.Controls_GetTextBoxText_TextBoxName = "The TextBox whose text is requested.";
  DocumentationResources2.Controls_SetTextBoxText = "Sets the text of the specified TextBox.";
  DocumentationResources2.Controls_SetTextBoxText_TextBoxName = "The TextBox whose text needs to be set.";
  DocumentationResources2.Controls_SetTextBoxText_Text = "The new text for the TextBox.";
  DocumentationResources2.Controls_Remove = "Removes a control from the Graphics Window.";
  DocumentationResources2.Controls_Remove_ControlName = "The name of the control that needs to be removed.";
  DocumentationResources2.Controls_Move = "Moves the control with the specified name to a new position.";
  DocumentationResources2.Controls_Move_Control = "The name of the control to move.";
  DocumentationResources2.Controls_Move_X = "The x co-ordinate of the new position.";
  DocumentationResources2.Controls_Move_Y = "The y co-ordinate of the new position.";
  DocumentationResources2.Controls_SetSize = "Sets the size of the control.";
  DocumentationResources2.Controls_SetSize_Control = "The name of the control to be resized.";
  DocumentationResources2.Controls_SetSize_Width = "The width of the control.";
  DocumentationResources2.Controls_SetSize_Height = "The height of the control.";
  DocumentationResources2.Controls_HideControl = "Hides an already added control.";
  DocumentationResources2.Controls_HideControl_ControlName = "The name of the control.";
  DocumentationResources2.Controls_ShowControl = "Shows a previously hidden control.";
  DocumentationResources2.Controls_ShowControl_ControlName = "The name of the control.";
  DocumentationResources2.Math = "The Math class provides lots of useful mathematics related methods.";
  DocumentationResources2.Math_Pi = "Gets the value of Pi.";
  DocumentationResources2.Math_Abs = "Gets the absolute value of the given number. For example, -32.233 will return 32.233.";
  DocumentationResources2.Math_Abs_Number = "The number to get the absolute value for.";
  DocumentationResources2.Math_Remainder = "Divides the first number by the second and returns the remainder.";
  DocumentationResources2.Math_Remainder_Dividend = "The number to divide.";
  DocumentationResources2.Math_Remainder_Divisor = "The number that divides.";
  DocumentationResources2.Math_Cos = "Gets the cosine of the given angle in radians.";
  DocumentationResources2.Math_Cos_Angle = "The angle whose cosine is needed (in radians).";
  DocumentationResources2.Math_Sin = "Gets the sine of the given angle in radians.";
  DocumentationResources2.Math_Sin_Angle = "The angle whose sine is needed (in radians).";
  DocumentationResources2.Math_Tan = "Gets the tangent of the given angle in radians.";
  DocumentationResources2.Math_Tan_Angle = "The angle whose tangent is needed (in radians).";
  DocumentationResources2.Math_ArcCos = "Gets the angle in radians, given the cosine value.";
  DocumentationResources2.Math_ArcCos_CosValue = "The cosine value whose angle is needed.";
  DocumentationResources2.Math_ArcSin = "Gets the angle in radians, given the sine value.";
  DocumentationResources2.Math_ArcSin_SinValue = "The sine value whose angle is needed.";
  DocumentationResources2.Math_ArcTan = "Gets the angle in radians, given the tangent value.";
  DocumentationResources2.Math_ArcTan_TanValue = "The tangent value whose angle is needed.";
  DocumentationResources2.Math_Ceiling = "Returns the smallest integer that is greater than or equal to the argument. It rounds up the integer value. For example, 32.233 will return 33. Also, 44 will return 44.";
  DocumentationResources2.Math_Ceiling_Number = "The number whose ceiling is required.";
  DocumentationResources2.Math_Floor = "Returns the largest integer that is less than or equal to the argument. It rounds down the integer value. For example, 32.233 will return 32. Also, 44 will return 44.";
  DocumentationResources2.Math_Floor_Number = "The number whose floor value is required.";
  DocumentationResources2.Math_Round = "Rounds a given number to the nearest integer. For example 32.233 will be rounded to 32.0 while 32.566 will be rounded to 33.";
  DocumentationResources2.Math_Round_Number = "The number whose approximation is required.";
  DocumentationResources2.Math_GetDegrees = "Converts a given angle in radians to degrees.";
  DocumentationResources2.Math_GetDegrees_Angle = "The angle in radians.";
  DocumentationResources2.Math_GetRadians = "Converts a given angle in degrees to radians.";
  DocumentationResources2.Math_GetRadians_Angle = "The angle in degrees.";
  DocumentationResources2.Math_GetRandomNumber = "Gets a random number between 1 and the specified maxNumber (inclusive).";
  DocumentationResources2.Math_GetRandomNumber_MaxNumber = "The maximum number for the requested random value.";
  DocumentationResources2.Math_Log = "Gets the logarithm (base 10) value of the given number.";
  DocumentationResources2.Math_Log_Number = "The number whose logarithm value is required.";
  DocumentationResources2.Math_NaturalLog = "Gets the natural logarithm value of the given number.";
  DocumentationResources2.Math_NaturalLog_Number = "The number whose natural logarithm value is required.";
  DocumentationResources2.Math_Max = "Compares two numbers and returns the greater of the two.";
  DocumentationResources2.Math_Max_Number1 = "The first of the two numbers to compare.";
  DocumentationResources2.Math_Max_Number2 = "The second of the two numbers to compare.";
  DocumentationResources2.Math_Min = "Compares two numbers and returns the smaller of the two.";
  DocumentationResources2.Math_Min_Number1 = "The first of the two numbers to compare.";
  DocumentationResources2.Math_Min_Number2 = "The second of the two numbers to compare.";
  DocumentationResources2.Math_Power = "Raises the base number to the specified power.";
  DocumentationResources2.Math_Power_BaseNumber = "The number to be raised to the exponent power.";
  DocumentationResources2.Math_Power_Exponent = "The power to raise the base number.";
  DocumentationResources2.Math_SquareRoot = "Gets the square root of a given number.";
  DocumentationResources2.Math_SquareRoot_Number = "The number whose square root value is needed.";
  DocumentationResources2.Program = "The Program class provides helpers to control the program execution.";
  DocumentationResources2.Program_Pause = "Pauses the program execution for debugging.";
  DocumentationResources2.Program_End = "Ends the program.";
  DocumentationResources2.Shapes = "The Shape object allows you to add, move and rotate shapes to the Graphics window.";
  DocumentationResources2.Shapes_AddRectangle = "Adds a rectangle shape with the specified width and height, and returns it.";
  DocumentationResources2.Shapes_AddRectangle_Width = "The width of the rectangle shape.";
  DocumentationResources2.Shapes_AddRectangle_Height = "he height of the rectangle shape.";
  DocumentationResources2.Shapes_AddEllipse = "Adds an ellipse shape with the specified width and height, and returns it.";
  DocumentationResources2.Shapes_AddEllipse_Width = "The width of the ellipse shape.";
  DocumentationResources2.Shapes_AddEllipse_Height = "he height of the ellipse shape.";
  DocumentationResources2.Shapes_AddTriangle = "Adds a triangle shape represented by the specified points, and returns it.";
  DocumentationResources2.Shapes_AddTriangle_X1 = "The x co-ordinate of the first point.";
  DocumentationResources2.Shapes_AddTriangle_Y1 = "The y co-ordinate of the first point.";
  DocumentationResources2.Shapes_AddTriangle_X2 = "The x co-ordinate of the second point.";
  DocumentationResources2.Shapes_AddTriangle_Y2 = "The y co-ordinate of the second point.";
  DocumentationResources2.Shapes_AddTriangle_X3 = "The x co-ordinate of the third point.";
  DocumentationResources2.Shapes_AddTriangle_Y3 = "The y co-ordinate of the third point.";
  DocumentationResources2.Shapes_AddLine = "Adds a line between the specified points.";
  DocumentationResources2.Shapes_AddLine_X1 = "The x co-ordinate of the first point.";
  DocumentationResources2.Shapes_AddLine_Y1 = "The y co-ordinate of the first point.";
  DocumentationResources2.Shapes_AddLine_X2 = "The x co-ordinate of the second point.";
  DocumentationResources2.Shapes_AddLine_Y2 = "The y co-ordinate of the second point.";
  DocumentationResources2.Shapes_AddImage = "Adds an image as a shape that can be moved, animated or rotated, and returns it.";
  DocumentationResources2.Shapes_AddImage_ImageName = "The name of the image to draw.";
  DocumentationResources2.Shapes_AddText = "Adds some text as a shape that can be moved, animated or rotated, and returns it.";
  DocumentationResources2.Shapes_AddText_Text = "The text to add.";
  DocumentationResources2.Shapes_SetText = "Sets the text of a text shape.";
  DocumentationResources2.Shapes_SetText_ShapeName = "The name of the text shape.";
  DocumentationResources2.Shapes_SetText_Text = "The new text value to set.";
  DocumentationResources2.Shapes_Remove = "Removes a shape from the Graphics Window.";
  DocumentationResources2.Shapes_Remove_ShapeName = "The name of the shape that needs to be removed.";
  DocumentationResources2.Shapes_Move = "Moves the shape with the specified name to a new position.";
  DocumentationResources2.Shapes_Move_ShapeName = "The name of the shape to move.";
  DocumentationResources2.Shapes_Move_X = "The x co-ordinate of the new position.";
  DocumentationResources2.Shapes_Move_Y = "The y co-ordinate of the new position.";
  DocumentationResources2.Shapes_Rotate = "Rotates the shape with the specified name to the specified angle.";
  DocumentationResources2.Shapes_Rotate_ShapeName = "The name of the shape to rotate.";
  DocumentationResources2.Shapes_Rotate_Angle = "The angle to rotate the shape.";
  DocumentationResources2.Shapes_Zoom = "Scales the shape using the specified zoom levels.  Minimum is 0.1 and maximum is 20.";
  DocumentationResources2.Shapes_Zoom_ShapeName = "The name of the shape to zoom.";
  DocumentationResources2.Shapes_Zoom_ScaleX = "The x-axis zoom level.";
  DocumentationResources2.Shapes_Zoom_ScaleY = "The y-axis zoom level.";
  DocumentationResources2.Shapes_Animate = "Animates a shape with the specified name to a new position.";
  DocumentationResources2.Shapes_Animate_ShapeName = "The name of the shape to move.";
  DocumentationResources2.Shapes_Animate_X = "The x co-ordinate of the new position.";
  DocumentationResources2.Shapes_Animate_Y = "The y co-ordinate of the new position.";
  DocumentationResources2.Shapes_Animate_Duration = "The time for the animation, in milliseconds.";
  DocumentationResources2.Shapes_GetLeft = "Gets the left co-ordinate of the specified shape.";
  DocumentationResources2.Shapes_GetLeft_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_GetTop = "Gets the top co-ordinate of the specified shape.";
  DocumentationResources2.Shapes_GetTop_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_GetOpacity = "Gets the opacity of a shape.";
  DocumentationResources2.Shapes_GetOpacity_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_SetOpacity = "Sets how opaque a shape should render.";
  DocumentationResources2.Shapes_SetOpacity_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_SetOpacity_Level = "The opacity level ranging from 0 to 100.  0 is completely transparent and 100 is completely opaque.";
  DocumentationResources2.Shapes_HideShape = "Hides an already added shape.";
  DocumentationResources2.Shapes_HideShape_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_ShowShape = "Shows a previously hidden shape.";
  DocumentationResources2.Shapes_ShowShape_ShapeName = "The name of the shape.";
  DocumentationResources2.Stack = "This object provides a way of storing values just like stacking up a plate. You can push a value to the top of the stack and pop it off. You can only pop the values one by one off the stack and the last pushed value will be the first one to pop out.";
  DocumentationResources2.Stack_PushValue = "Pushes a value to the specified stack.";
  DocumentationResources2.Stack_PushValue_StackName = "The name of the stack.";
  DocumentationResources2.Stack_PushValue_Value = "The value to push.";
  DocumentationResources2.Stack_GetCount = "Gets the count of items in the specified stack.";
  DocumentationResources2.Stack_GetCount_StackName = "The name of the stack.";
  DocumentationResources2.Stack_PopValue = "Pops a value from the specified stack.";
  DocumentationResources2.Stack_PopValue_StackName = "The name of the stack.";
  DocumentationResources2.TextWindow = "The TextWindow provides text-related input and output functionalities. For example using this class, it is possible to write or read some text or number to and from the text-based text window.";
  DocumentationResources2.TextWindow_Read = "Reads a line of text from the text window. Returns the string entered by the user.";
  DocumentationResources2.TextWindow_ReadNumber = "Reads a number from the text window. Returns the number entered by the user.";
  DocumentationResources2.TextWindow_Write = "Writes a string or a number to the text window on the same line.";
  DocumentationResources2.TextWindow_Write_Data = "The string or number to be written to the text window.";
  DocumentationResources2.TextWindow_WriteLine = "Writes a string or a number to the text window on its own line.";
  DocumentationResources2.TextWindow_WriteLine_Data = "The string or number to be written to the text window.";
  DocumentationResources2.TextWindow_ForegroundColor = "Gets or sets the foreground color of the text to be output in the text window.";
  DocumentationResources2.TextWindow_BackgroundColor = "Gets or sets the background color of the text to be output in the text window.";
  DocumentationResources2.Turtle = "The Turtle provides Logo-like functionality to draw shapes by manipulating the properties of a pen and drawing primitives.";
  DocumentationResources2.Turtle_Speed = "Specifies how fast the turtle should move. Valid values are 1 to 10. If Speed is set to 10, the turtle moves and rotates instantly.";
  DocumentationResources2.Turtle_Angle = "Gets or sets the current angle of the turtle. While setting, this will turn the turtle instantly to the new angle.";
  DocumentationResources2.Turtle_X = "Gets or sets the X location of the Turtle. While setting, this will move the turtle instantly to the new location.";
  DocumentationResources2.Turtle_Y = "Gets or sets the Y location of the Turtle. While setting, this will move the turtle instantly to the new location.";
  DocumentationResources2.Turtle_Show = "Shows the turtle.";
  DocumentationResources2.Turtle_Hide = "Hides the turtle.";
  DocumentationResources2.Turtle_PenDown = "Sets the pen down to enable the turtle to draw as it moves.";
  DocumentationResources2.Turtle_PenUp = "Lifts the pen up to stop drawing as the turtle moves.";
  DocumentationResources2.Turtle_Move = "Moves the turtle to a specified distance.  If the pen is down, it will draw a line as it moves.";
  DocumentationResources2.Turtle_Move_Distance = "The distance to move the turtle.";
  DocumentationResources2.Turtle_MoveTo = "Turns and moves the turtle to the specified location.  If the pen is down, it will draw a line as it moves.";
  DocumentationResources2.Turtle_MoveTo_X = "The x co-ordinate of the destination point.";
  DocumentationResources2.Turtle_MoveTo_Y = "The y co-ordinate of the destination point.";
  DocumentationResources2.Turtle_Turn = "Turns the turtle by the specified angle. Angle is in degrees and can be either positive or negative. If the angle is positive, the turtle turns to its right. If it is negative, the turtle turns to its left.";
  DocumentationResources2.Turtle_Turn_Angle = "The angle to turn the turtle.";
  DocumentationResources2.Turtle_TurnLeft = "Turns the turtle 90 degrees to the left.";
  DocumentationResources2.Turtle_TurnRight = "Turns the turtle 90 degrees to the right.";
  DocumentationResources2.GraphicsWindow = "The GraphicsWindow provides graphics related input and output functionality. For example, with this class you can draw and fill shapes.";
  DocumentationResources2.GraphicsWindow_BackgroundColor = "Gets or sets the background color of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_BrushColor = "Gets or sets the brush color to be used to fill the shapes being drawn.";
  DocumentationResources2.GraphicsWindow_PenColor = "Gets or sets the color of the pen used to draw the shapes.";
  DocumentationResources2.GraphicsWindow_PenWidth = "Gets or sets the width of the pen used to draw the shapes.";
  DocumentationResources2.GraphicsWindow_FontName = "Gets or sets the font name of the text to be drawn on the Graphics Window.";
  DocumentationResources2.GraphicsWindow_FontSize = "Gets or sets the font size of the text to be drawn on the Graphics Window.";
  DocumentationResources2.GraphicsWindow_FontBold = "Gets or sets whether or not the text to be drawn on the Graphics Window is bold.";
  DocumentationResources2.GraphicsWindow_FontItalic = "Gets or sets whether or not the text to be drawn on the Graphics Window is italic.";
  DocumentationResources2.GraphicsWindow_Height = "Gets or sets the height of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Width = "Gets or sets the width of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Left = "Gets or sets the Left co-ordinate of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Top = "Gets or sets the Top co-ordinate of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Title = "Gets or sets the title of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_CanResize = "Gets or sets whether the Graphics Window can be resized by the user or not.";
  DocumentationResources2.GraphicsWindow_LastKey = "Gets the last key that was pressed.";
  DocumentationResources2.GraphicsWindow_LastText = "Gets the last text that was entered into the Graphics Window.";
  DocumentationResources2.GraphicsWindow_MouseX = "Gets the x co-ordinate of the mouse position.";
  DocumentationResources2.GraphicsWindow_MouseY = "Gets the y co-ordinate of the mouse position.";
  DocumentationResources2.GraphicsWindow_Show = "Shows the Graphics Window to enable interactions with it.";
  DocumentationResources2.GraphicsWindow_Hide = "Hides the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Clear = "Clears the window and cleans up the canvas.";
  DocumentationResources2.GraphicsWindow_DrawLine = "Draws a line from one point to another.";
  DocumentationResources2.GraphicsWindow_DrawLine_X1 = "The x co-ordinate of the first point.";
  DocumentationResources2.GraphicsWindow_DrawLine_Y1 = "The y co-ordinate of the first point.";
  DocumentationResources2.GraphicsWindow_DrawLine_X2 = "The x co-ordinate of the second point.";
  DocumentationResources2.GraphicsWindow_DrawLine_Y2 = "The y co-ordinate of the second point.";
  DocumentationResources2.GraphicsWindow_DrawRectangle = "Draws a rectangle on the screen.";
  DocumentationResources2.GraphicsWindow_DrawRectangle_X = "The x co-ordinate of the rectangle.";
  DocumentationResources2.GraphicsWindow_DrawRectangle_Y = "The y co-ordinate of the rectangle.";
  DocumentationResources2.GraphicsWindow_DrawRectangle_Width = "The width of the rectangle.";
  DocumentationResources2.GraphicsWindow_DrawRectangle_Height = "The height of the rectangle.";
  DocumentationResources2.GraphicsWindow_FillRectangle = "Fills a rectangle on the screen.";
  DocumentationResources2.GraphicsWindow_FillRectangle_X = "The x co-ordinate of the rectangle.";
  DocumentationResources2.GraphicsWindow_FillRectangle_Y = "The y co-ordinate of the rectangle.";
  DocumentationResources2.GraphicsWindow_FillRectangle_Width = "The width of the rectangle.";
  DocumentationResources2.GraphicsWindow_FillRectangle_Height = "The height of the rectangle.";
  DocumentationResources2.GraphicsWindow_DrawEllipse = "Draws an ellipse on the screen.";
  DocumentationResources2.GraphicsWindow_DrawEllipse_X = "The x co-ordinate of the ellipse.";
  DocumentationResources2.GraphicsWindow_DrawEllipse_Y = "The y co-ordinate of the ellipse.";
  DocumentationResources2.GraphicsWindow_DrawEllipse_Width = "The width of the ellipse.";
  DocumentationResources2.GraphicsWindow_DrawEllipse_Height = "The height of the ellipse.";
  DocumentationResources2.GraphicsWindow_FillEllipse = "Fills an ellipse on the screen.";
  DocumentationResources2.GraphicsWindow_FillEllipse_X = "The x co-ordinate of the ellipse.";
  DocumentationResources2.GraphicsWindow_FillEllipse_Y = "The y co-ordinate of the ellipse.";
  DocumentationResources2.GraphicsWindow_FillEllipse_Width = "The width of the ellipse.";
  DocumentationResources2.GraphicsWindow_FillEllipse_Height = "The height of the ellipse.";
  DocumentationResources2.GraphicsWindow_DrawTriangle = "Draws a triangle on the screen using three points.";
  DocumentationResources2.GraphicsWindow_FillTriangle = "Fills a triangle on the screen using three points.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_X1 = "The x co-ordinate of the first point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_Y1 = "The y co-ordinate of the first point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_X2 = "The x co-ordinate of the second point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_Y2 = "The y co-ordinate of the second point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_X3 = "The x co-ordinate of the third point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_Y3 = "The y co-ordinate of the third point.";
  DocumentationResources2.GraphicsWindow_DrawText = "Draws a line of text on the screen.";
  DocumentationResources2.GraphicsWindow_DrawText_X = "The x co-ordinate of the text.";
  DocumentationResources2.GraphicsWindow_DrawText_Y = "The y co-ordinate of the text.";
  DocumentationResources2.GraphicsWindow_DrawText_Text = "The text to draw.";
  DocumentationResources2.GraphicsWindow_DrawBoundText = "Draws a line of text on the screen, wrapped inside the specified bounds.";
  DocumentationResources2.GraphicsWindow_DrawBoundText_X = "The x co-ordinate of the text.";
  DocumentationResources2.GraphicsWindow_DrawBoundText_Y = "The y co-ordinate of the text.";
  DocumentationResources2.GraphicsWindow_DrawBoundText_Width = "The maximum width available for the text.";
  DocumentationResources2.GraphicsWindow_DrawBoundText_Text = "The text to draw.";
  DocumentationResources2.GraphicsWindow_DrawImage = "Draws the specified image on to the screen.";
  DocumentationResources2.GraphicsWindow_DrawImage_ImageName = "The name of the image to be drawn.";
  DocumentationResources2.GraphicsWindow_DrawImage_X = "The x co-ordinate of the image.";
  DocumentationResources2.GraphicsWindow_DrawImage_Y = "The y co-ordinate of the image.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage = "Draws the specified image on to the screen, scaled to fit the specified dimensions.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_ImageName = "The name of the image to be drawn.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_X = "The x co-ordinate of the image.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_Y = "The y co-ordinate of the image.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_Width = "The width of the image.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_Height = "The height of the image.";
  DocumentationResources2.GraphicsWindow_GetColorFromRGB = "Constructs a color from its red, green, blue components.";
  DocumentationResources2.GraphicsWindow_GetColorFromRGB_Red = "The red component of the color (0-255).";
  DocumentationResources2.GraphicsWindow_GetColorFromRGB_Green = "The green component of the color (0-255).";
  DocumentationResources2.GraphicsWindow_GetColorFromRGB_Blue = "The blue component of the color (0-255).";
  DocumentationResources2.GraphicsWindow_GetRandomColor = "Gets a random valid color.";
  DocumentationResources2.GraphicsWindow_GetPixel = "Gets the color of the pixel at the specified position.";
  DocumentationResources2.GraphicsWindow_GetPixel_X = "The x co-ordinate of the pixel.";
  DocumentationResources2.GraphicsWindow_GetPixel_Y = "The y co-ordinate of the pixel.";
  DocumentationResources2.GraphicsWindow_SetPixel = "Sets the color of the pixel at the specified position.";
  DocumentationResources2.GraphicsWindow_SetPixel_X = "The x co-ordinate of the pixel.";
  DocumentationResources2.GraphicsWindow_SetPixel_Y = "The y co-ordinate of the pixel.";
  DocumentationResources2.GraphicsWindow_SetPixel_Color = "The color to set the pixel to.";
  DocumentationResources2.GraphicsWindow_ShowMessage = "Displays a message dialog to the user.";
  DocumentationResources2.GraphicsWindow_ShowMessage_Text = "The text to display.";
  DocumentationResources2.GraphicsWindow_ShowMessage_Title = "The title of the message dialog.";
  DocumentationResources2.GraphicsWindow_KeyDown = "Raises an event when a key is pressed down on the keyboard.";
  DocumentationResources2.GraphicsWindow_KeyUp = "Raises an event when a key is released on the keyboard.";
  DocumentationResources2.GraphicsWindow_MouseDown = "Raises an event when the mouse button is clicked down.";
  DocumentationResources2.GraphicsWindow_MouseUp = "Raises an event when the mouse button is released.";
  DocumentationResources2.GraphicsWindow_MouseMove = "Raises an event when the mouse is moved around.";
  DocumentationResources2.GraphicsWindow_TextInput = "Raises an event when text is entered into the Graphics Window.";
  DocumentationResources2.Text = "The Text object provides helpful operations for working with text.";
  DocumentationResources2.Text_Append = "Appends two text inputs and returns the result.";
  DocumentationResources2.Text_Append_Text1 = "One part of the text to append.";
  DocumentationResources2.Text_Append_Text2 = "The other part of the text to append.";
  DocumentationResources2.Text_ConvertToLowerCase = "Converts the given text to lower case.";
  DocumentationResources2.Text_ConvertToLowerCase_Text = "The text to convert.";
  DocumentationResources2.Text_ConvertToUpperCase = "Converts the given text to upper case.";
  DocumentationResources2.Text_ConvertToUpperCase_Text = "The text to convert.";
  DocumentationResources2.Text_EndsWith = "Gets whether or not a given text ends with the specified sub text.";
  DocumentationResources2.Text_EndsWith_Text = "The larger text within which the sub text will be searched.";
  DocumentationResources2.Text_EndsWith_SubText = "The sub text to search for.";
  DocumentationResources2.Text_StartsWith = "Gets whether or not a given text starts with the specified sub text.";
  DocumentationResources2.Text_StartsWith_Text = "The larger text within which the sub text will be searched.";
  DocumentationResources2.Text_StartsWith_SubText = "The sub text to search for.";
  DocumentationResources2.Text_GetCharacter = "Given the character code, gets the character it represents.";
  DocumentationResources2.Text_GetCharacter_CharacterCode = "The character code (Unicode) in question.";
  DocumentationResources2.Text_GetCharacterCode = "Given a character, gets its character code.";
  DocumentationResources2.Text_GetCharacterCode_Character = "The character whose code is requested.";
  DocumentationResources2.Text_GetIndexOf = "Finds the position of the first occurrence of the specified sub text.";
  DocumentationResources2.Text_GetIndexOf_Text = "The larger text within which the sub text will be searched.";
  DocumentationResources2.Text_GetIndexOf_SubText = "The sub text to search for.";
  DocumentationResources2.Text_GetLength = "Gets the length of the given text.";
  DocumentationResources2.Text_GetLength_Text = "The text whose length is requested.";
  DocumentationResources2.Text_GetSubText = "Gets a sub text from the given text.";
  DocumentationResources2.Text_GetSubText_Text = "The text from which the sub text is requested.";
  DocumentationResources2.Text_GetSubText_Start = "The start position of the sub text (1-based).";
  DocumentationResources2.Text_GetSubText_Length = "The length of the sub text.";
  DocumentationResources2.Text_GetSubTextToEnd = "Gets a sub text from the given text, from the specified position to the end.";
  DocumentationResources2.Text_GetSubTextToEnd_Text = "The text from which the sub text is requested.";
  DocumentationResources2.Text_GetSubTextToEnd_Start = "The start position of the sub text (1-based).";
  DocumentationResources2.Text_GetWord = "Gets the word at the specified index of the given text.";
  DocumentationResources2.Text_GetWord_Text = "The text from which the word is requested.";
  DocumentationResources2.Text_GetWord_Index = "The index of the word (1-based).";
  DocumentationResources2.Text_GetWordCount = "Gets the number of words in the given text.";
  DocumentationResources2.Text_GetWordCount_Text = "The text whose word count is requested.";
  DocumentationResources2.Text_IsSubText = "Gets whether or not the specified sub text occurs within the given text.";
  DocumentationResources2.Text_IsSubText_Text = "The larger text within which the sub text will be searched.";
  DocumentationResources2.Text_IsSubText_SubText = "The sub text to search for.";
  DocumentationResources2.File = "The File object provides methods to access, read and write information from files on your computer.";
  DocumentationResources2.File_AppendContents = "Appends the specified contents to a file. If the file exists, the contents are appended at the end.";
  DocumentationResources2.File_AppendContents_FilePath = "The path of the file.";
  DocumentationResources2.File_AppendContents_Contents = "The contents to append to the file.";
  DocumentationResources2.File_CopyFile = "Copies the specified source file to the destination file path.";
  DocumentationResources2.File_CopyFile_SourceFilePath = "The source path of the file to copy.";
  DocumentationResources2.File_CopyFile_DestinationFilePath = "The destination path of the file.";
  DocumentationResources2.File_DeleteDirectory = "Deletes the specified directory.";
  DocumentationResources2.File_DeleteDirectory_DirectoryPath = "The path of the directory to delete.";
  DocumentationResources2.File_DeleteFile = "Deletes the specified file.";
  DocumentationResources2.File_DeleteFile_FilePath = "The path of the file to delete.";
  DocumentationResources2.File_GetDirectories = "Gets the paths of all the directories in the specified path.";
  DocumentationResources2.File_GetDirectories_DirectoryPath = "The path of the directory whose sub directories are requested.";
  DocumentationResources2.File_GetFiles = "Gets the paths of all the files in the specified path.";
  DocumentationResources2.File_GetFiles_DirectoryPath = "The path of the directory whose files are requested.";
  DocumentationResources2.File_GetSettingsFilePath = "Gets the full path where the program settings are stored for the current program.";
  DocumentationResources2.File_GetTemporaryFilePath = "Gets a temporary file path that can be used by the program.";
  DocumentationResources2.File_InsertLine = "Inserts the specified contents as a line at the specified line number of the file.";
  DocumentationResources2.File_InsertLine_FilePath = "The path of the file.";
  DocumentationResources2.File_InsertLine_LineNumber = "The line number where the contents will be inserted (1-based).";
  DocumentationResources2.File_InsertLine_Contents = "The contents to insert into the file.";
  DocumentationResources2.File_ReadContents = "Reads the entire contents of the specified file.";
  DocumentationResources2.File_ReadContents_FilePath = "The path of the file to read.";
  DocumentationResources2.File_ReadLine = "Reads a line from the specified file at the specified line number.";
  DocumentationResources2.File_ReadLine_FilePath = "The path of the file to read.";
  DocumentationResources2.File_ReadLine_LineNumber = "The line number to read (1-based).";
  DocumentationResources2.ImageList = "The ImageList object provides the ability to load images from file or the network and draw them on the GraphicsWindow.";
  DocumentationResources2.ImageList_LoadImage = "Loads an image from the given file or URL into memory.";
  DocumentationResources2.ImageList_LoadImage_FileName = "The name of the file or URL to load the image from.";
  DocumentationResources2.ImageList_GetWidthOfImage = "Gets the width of the specified image.";
  DocumentationResources2.ImageList_GetWidthOfImage_ImageName = "The name of the image in question.";
  DocumentationResources2.ImageList_GetHeightOfImage = "Gets the height of the specified image.";
  DocumentationResources2.ImageList_GetHeightOfImage_ImageName = "The name of the image in question.";
  DocumentationResources2.Sound = "The Sound object provides operations that make the application play sounds. There are two options here. One is to use the built-in bell ring, chime, etc. The other is to play .mp3 or .wav files.";
  DocumentationResources2.Sound_Play = "Plays the specified sound file. This will return as soon as the sound starts to play.";
  DocumentationResources2.Sound_Play_FilePath = "The full path of the sound file to play.";
  DocumentationResources2.Sound_Pause = "Pauses the currently playing sound.";
  DocumentationResources2.Sound_Resume = "Resumes playing a previously paused sound.";
  DocumentationResources2.Sound_Stop = "Stops the currently playing sound.";
  DocumentationResources2.Sound_PlayBellRing = "Plays the built-in bell ring sound.";
  DocumentationResources2.Sound_PlayChime = "Plays the built-in chime sound.";
  DocumentationResources2.Sound_PlayMusic = "Plays music from musical notes. Musical notes are represented in a simplified notation, e.g. C4:1 C4:2 D4:2.";
  DocumentationResources2.Sound_PlayMusic_MusicNotes = "The musical notes to play.";
  DocumentationResources2.Timer = "The Timer object provides an easy way for doing something repeatedly over a period of time.";
  DocumentationResources2.Timer_Interval = "Gets or sets the interval (in milliseconds) at which the timer raises the Tick event.";
  DocumentationResources2.Timer_Pause = "Pauses the timer. The Tick event will not be raised while the timer is paused.";
  DocumentationResources2.Timer_Resume = "Resumes the timer from a previously paused state.";
  DocumentationResources2.Timer_Tick = "Raises an event at the interval specified in the Interval property.";
  DocumentationResources2.Mouse = "The Mouse object provides access to the properties of the mouse.";
  DocumentationResources2.Mouse_IsLeftButtonDown = "Gets whether or not the left button of the mouse is pressed.";
  DocumentationResources2.Mouse_IsRightButtonDown = "Gets whether or not the right button of the mouse is pressed.";
  DocumentationResources2.Mouse_ShowCursor = "Shows the mouse cursor on the screen.";
  DocumentationResources2.Mouse_HideCursor = "Hides the mouse cursor from the screen.";
  DocumentationResources2.Desktop = "The Desktop object provides access to the properties of the desktop.";
  DocumentationResources2.Desktop_Height = "Gets the height of the primary desktop.";
  DocumentationResources2.Desktop_Width = "Gets the width of the primary desktop.";
  DocumentationResources2.Desktop_SetWallPaper = "Sets the specified image as the desktop wallpaper.";
  DocumentationResources2.Desktop_SetWallPaper_FilePath = "The full path of the image file.";
  DocumentationResources2.Dictionary = "This object provides access to an online Dictionary.";
  DocumentationResources2.Dictionary_GetDefinition = "Gets the definition of the specified English word.";
  DocumentationResources2.Dictionary_GetDefinition_EnglishWord = "The English word to look up.";
  DocumentationResources2.Network = "The Network object allows you to download web pages and files.";
  DocumentationResources2.Network_DownloadFile = "Downloads the file from the specified URL and stores it in a temporary file which is returned.";
  DocumentationResources2.Network_DownloadFile_URL = "The URL of the file to download.";
  DocumentationResources2.Network_GetWebPageContents = "Gets the contents of the specified web page.";
  DocumentationResources2.Network_GetWebPageContents_URL = "The URL of the web page.";
  DocumentationResources2.Flickr = "This object provides access to the Flickr online photo service.";
  DocumentationResources2.Flickr_GetPictureOfMoment = "Gets the picture of the moment from Flickr and returns its temporary local file path.";
  DocumentationResources2.Flickr_GetRandomPicture = "Gets a random picture from Flickr and returns its temporary local file path.";
  DocumentationResources2.Flickr_GetPictureOfMomentWithTag = "Gets the picture of the moment with the specified tag from Flickr.";
  DocumentationResources2.Flickr_GetPictureOfMomentWithTag_Tag = "The tag of the picture.";
  DocumentationResources2.Flickr_GetRandomPictureWithTag = "Gets a random picture with the specified tag from Flickr.";
  DocumentationResources2.Flickr_GetRandomPictureWithTag_Tag = "The tag of the picture.";
  function get(key) {
    return DocumentationResources2[key];
  }
  DocumentationResources2.get = get;
})(DocumentationResources || (DocumentationResources = {}));

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries-metadata.ts
var MethodMetadata = class {
  constructor(typeName, methodName, returnsValue, parameters) {
    this.typeName = typeName;
    this.methodName = methodName;
    this.returnsValue = returnsValue;
    this.parameters = parameters;
  }
  typeName;
  methodName;
  returnsValue;
  parameters;
  get description() {
    return DocumentationResources.get(`${this.typeName}_${this.methodName}`);
  }
  parameterDescription(name) {
    return DocumentationResources.get(`${this.typeName}_${this.methodName}_${name}`) ?? name;
  }
};
var PropertyMetadata = class {
  constructor(typeName, propertyName, hasGetter, hasSetter) {
    this.typeName = typeName;
    this.propertyName = propertyName;
    this.hasGetter = hasGetter;
    this.hasSetter = hasSetter;
  }
  typeName;
  propertyName;
  hasGetter;
  hasSetter;
  get description() {
    return DocumentationResources.get(`${this.typeName}_${this.propertyName}`);
  }
};
var EventMetadata = class {
  constructor(typeName, eventName) {
    this.typeName = typeName;
    this.eventName = eventName;
  }
  typeName;
  eventName;
  get description() {
    return DocumentationResources.get(`${this.typeName}_${this.eventName}`);
  }
};
var TypeMetadata = class {
  constructor(typeName, methods, properties, events) {
    this.typeName = typeName;
    this.methods = methods;
    this.properties = properties;
    this.events = events;
  }
  typeName;
  methods;
  properties;
  events;
  get description() {
    return DocumentationResources.get(this.typeName);
  }
};
var LibrariesMetadata = class {
  Array = new TypeMetadata(
    "Array",
    {
      IsArray: new MethodMetadata("Array", "IsArray", true, ["Value"]),
      GetItemCount: new MethodMetadata("Array", "GetItemCount", true, ["Array"]),
      GetAllIndices: new MethodMetadata("Array", "GetAllIndices", true, ["Array"]),
      ContainsValue: new MethodMetadata("Array", "ContainsValue", true, ["Array", "Index"]),
      ContainsIndex: new MethodMetadata("Array", "ContainsIndex", true, ["Array", "Index"]),
      GetValue: new MethodMetadata("Array", "GetValue", true, ["ArrayName", "Index"]),
      RemoveValue: new MethodMetadata("Array", "RemoveValue", false, ["ArrayName", "Index"]),
      SetValue: new MethodMetadata("Array", "SetValue", false, ["ArrayName", "Index", "Value"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Clock = new TypeMetadata(
    "Clock",
    {
      // No Methods
    },
    {
      Time: new PropertyMetadata("Clock", "Time", true, false)
    },
    {
      // No Events
    }
  );
  Controls = new TypeMetadata(
    "Controls",
    {
      AddButton: new MethodMetadata("Controls", "AddButton", true, ["Caption", "Left", "Top"]),
      GetButtonCaption: new MethodMetadata("Controls", "GetButtonCaption", true, ["ButtonName"]),
      SetButtonCaption: new MethodMetadata("Controls", "SetButtonCaption", false, ["ButtonName", "Caption"]),
      AddTextBox: new MethodMetadata("Controls", "AddTextBox", true, ["Left", "Top"]),
      AddMultiLineTextBox: new MethodMetadata("Controls", "AddMultiLineTextBox", true, ["Left", "Top"]),
      GetTextBoxText: new MethodMetadata("Controls", "GetTextBoxText", true, ["TextBoxName"]),
      SetTextBoxText: new MethodMetadata("Controls", "SetTextBoxText", true, ["TextBoxName", "Text"]),
      Remove: new MethodMetadata("Controls", "Remove", false, ["ControlName"]),
      Move: new MethodMetadata("Controls", "Move", false, ["Control", "X", "Y"]),
      SetSize: new MethodMetadata("Controls", "SetSize", false, ["Control", "Width", "Height"]),
      HideControl: new MethodMetadata("Controls", "HideControl", false, ["ControlName"]),
      ShowControl: new MethodMetadata("Controls", "ShowControl", false, ["ControlName"])
    },
    {
      LastClickedButton: new PropertyMetadata("Controls", "LastClickedButton", true, false),
      LastTypedTextBox: new PropertyMetadata("Controls", "LastTypedTextBox", true, false)
    },
    {
      ButtonClicked: new EventMetadata("Controls", "ButtonClicked"),
      TextTyped: new EventMetadata("Controls", "TextTyped")
    }
  );
  Desktop = new TypeMetadata(
    "Desktop",
    {
      SetWallPaper: new MethodMetadata("Desktop", "SetWallPaper", false, ["FilePath"])
    },
    {
      Height: new PropertyMetadata("Desktop", "Height", true, false),
      Width: new PropertyMetadata("Desktop", "Width", true, false)
    },
    {
      // No Events
    }
  );
  Dictionary = new TypeMetadata(
    "Dictionary",
    {
      GetDefinition: new MethodMetadata("Dictionary", "GetDefinition", true, ["EnglishWord"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  File = new TypeMetadata(
    "File",
    {
      AppendContents: new MethodMetadata("File", "AppendContents", false, ["FilePath", "Contents"]),
      CopyFile: new MethodMetadata("File", "CopyFile", false, ["SourceFilePath", "DestinationFilePath"]),
      DeleteDirectory: new MethodMetadata("File", "DeleteDirectory", false, ["DirectoryPath"]),
      DeleteFile: new MethodMetadata("File", "DeleteFile", false, ["FilePath"]),
      GetDirectories: new MethodMetadata("File", "GetDirectories", true, ["DirectoryPath"]),
      GetFiles: new MethodMetadata("File", "GetFiles", true, ["DirectoryPath"]),
      GetSettingsFilePath: new MethodMetadata("File", "GetSettingsFilePath", true, []),
      GetTemporaryFilePath: new MethodMetadata("File", "GetTemporaryFilePath", true, []),
      InsertLine: new MethodMetadata("File", "InsertLine", false, ["FilePath", "LineNumber", "Contents"]),
      ReadContents: new MethodMetadata("File", "ReadContents", true, ["FilePath"]),
      ReadLine: new MethodMetadata("File", "ReadLine", true, ["FilePath", "LineNumber"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Flickr = new TypeMetadata(
    "Flickr",
    {
      GetPictureOfMoment: new MethodMetadata("Flickr", "GetPictureOfMoment", true, []),
      GetPictureOfMomentWithTag: new MethodMetadata("Flickr", "GetPictureOfMomentWithTag", true, ["Tag"]),
      GetRandomPicture: new MethodMetadata("Flickr", "GetRandomPicture", true, []),
      GetRandomPictureWithTag: new MethodMetadata("Flickr", "GetRandomPictureWithTag", true, ["Tag"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  GraphicsWindow = new TypeMetadata(
    "GraphicsWindow",
    {
      Clear: new MethodMetadata("GraphicsWindow", "Clear", false, []),
      DrawBoundText: new MethodMetadata("GraphicsWindow", "DrawBoundText", false, ["X", "Y", "Width", "Text"]),
      DrawEllipse: new MethodMetadata("GraphicsWindow", "DrawEllipse", false, ["X", "Y", "Width", "Height"]),
      DrawImage: new MethodMetadata("GraphicsWindow", "DrawImage", false, ["ImageName", "X", "Y"]),
      DrawLine: new MethodMetadata("GraphicsWindow", "DrawLine", false, ["X1", "Y1", "X2", "Y2"]),
      DrawRectangle: new MethodMetadata("GraphicsWindow", "DrawRectangle", false, ["X", "Y", "Width", "Height"]),
      DrawResizedImage: new MethodMetadata("GraphicsWindow", "DrawResizedImage", false, ["ImageName", "X", "Y", "Width", "Height"]),
      DrawText: new MethodMetadata("GraphicsWindow", "DrawText", false, ["X", "Y", "Text"]),
      DrawTriangle: new MethodMetadata("GraphicsWindow", "DrawTriangle", false, ["X1", "Y1", "X2", "Y2", "X3", "Y3"]),
      FillEllipse: new MethodMetadata("GraphicsWindow", "FillEllipse", false, ["X", "Y", "Width", "Height"]),
      FillRectangle: new MethodMetadata("GraphicsWindow", "FillRectangle", false, ["X", "Y", "Width", "Height"]),
      FillTriangle: new MethodMetadata("GraphicsWindow", "FillTriangle", false, ["X1", "Y1", "X2", "Y2", "X3", "Y3"]),
      GetColorFromRGB: new MethodMetadata("GraphicsWindow", "GetColorFromRGB", true, ["Red", "Green", "Blue"]),
      GetPixel: new MethodMetadata("GraphicsWindow", "GetPixel", true, ["X", "Y"]),
      GetRandomColor: new MethodMetadata("GraphicsWindow", "GetRandomColor", true, []),
      Hide: new MethodMetadata("GraphicsWindow", "Hide", false, []),
      SetPixel: new MethodMetadata("GraphicsWindow", "SetPixel", false, ["X", "Y", "Color"]),
      Show: new MethodMetadata("GraphicsWindow", "Show", false, []),
      ShowMessage: new MethodMetadata("GraphicsWindow", "ShowMessage", false, ["Text", "Title"])
    },
    {
      BackgroundColor: new PropertyMetadata("GraphicsWindow", "BackgroundColor", true, true),
      BrushColor: new PropertyMetadata("GraphicsWindow", "BrushColor", true, true),
      CanResize: new PropertyMetadata("GraphicsWindow", "CanResize", true, true),
      FontBold: new PropertyMetadata("GraphicsWindow", "FontBold", true, true),
      FontItalic: new PropertyMetadata("GraphicsWindow", "FontItalic", true, true),
      FontName: new PropertyMetadata("GraphicsWindow", "FontName", true, true),
      FontSize: new PropertyMetadata("GraphicsWindow", "FontSize", true, true),
      Height: new PropertyMetadata("GraphicsWindow", "Height", true, true),
      LastKey: new PropertyMetadata("GraphicsWindow", "LastKey", true, false),
      LastText: new PropertyMetadata("GraphicsWindow", "LastText", true, false),
      Left: new PropertyMetadata("GraphicsWindow", "Left", true, true),
      MouseX: new PropertyMetadata("GraphicsWindow", "MouseX", true, false),
      MouseY: new PropertyMetadata("GraphicsWindow", "MouseY", true, false),
      PenColor: new PropertyMetadata("GraphicsWindow", "PenColor", true, true),
      PenWidth: new PropertyMetadata("GraphicsWindow", "PenWidth", true, true),
      Title: new PropertyMetadata("GraphicsWindow", "Title", true, true),
      Top: new PropertyMetadata("GraphicsWindow", "Top", true, true),
      Width: new PropertyMetadata("GraphicsWindow", "Width", true, true)
    },
    {
      KeyDown: new EventMetadata("GraphicsWindow", "KeyDown"),
      KeyUp: new EventMetadata("GraphicsWindow", "KeyUp"),
      MouseDown: new EventMetadata("GraphicsWindow", "MouseDown"),
      MouseMove: new EventMetadata("GraphicsWindow", "MouseMove"),
      MouseUp: new EventMetadata("GraphicsWindow", "MouseUp"),
      TextInput: new EventMetadata("GraphicsWindow", "TextInput")
    }
  );
  ImageList = new TypeMetadata(
    "ImageList",
    {
      GetHeightOfImage: new MethodMetadata("ImageList", "GetHeightOfImage", true, ["ImageName"]),
      GetWidthOfImage: new MethodMetadata("ImageList", "GetWidthOfImage", true, ["ImageName"]),
      LoadImage: new MethodMetadata("ImageList", "LoadImage", true, ["FileName"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Mouse = new TypeMetadata(
    "Mouse",
    {
      HideCursor: new MethodMetadata("Mouse", "HideCursor", false, []),
      ShowCursor: new MethodMetadata("Mouse", "ShowCursor", false, [])
    },
    {
      IsLeftButtonDown: new PropertyMetadata("Mouse", "IsLeftButtonDown", true, false),
      IsRightButtonDown: new PropertyMetadata("Mouse", "IsRightButtonDown", true, false)
    },
    {
      // No Events
    }
  );
  Network = new TypeMetadata(
    "Network",
    {
      DownloadFile: new MethodMetadata("Network", "DownloadFile", true, ["URL"]),
      GetWebPageContents: new MethodMetadata("Network", "GetWebPageContents", true, ["URL"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Sound = new TypeMetadata(
    "Sound",
    {
      Pause: new MethodMetadata("Sound", "Pause", false, []),
      Play: new MethodMetadata("Sound", "Play", false, ["FilePath"]),
      PlayBellRing: new MethodMetadata("Sound", "PlayBellRing", false, []),
      PlayChime: new MethodMetadata("Sound", "PlayChime", false, []),
      PlayMusic: new MethodMetadata("Sound", "PlayMusic", false, ["MusicNotes"]),
      Resume: new MethodMetadata("Sound", "Resume", false, []),
      Stop: new MethodMetadata("Sound", "Stop", false, [])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Text = new TypeMetadata(
    "Text",
    {
      Append: new MethodMetadata("Text", "Append", true, ["Text1", "Text2"]),
      ConvertToLowerCase: new MethodMetadata("Text", "ConvertToLowerCase", true, ["Text"]),
      ConvertToUpperCase: new MethodMetadata("Text", "ConvertToUpperCase", true, ["Text"]),
      EndsWith: new MethodMetadata("Text", "EndsWith", true, ["Text", "SubText"]),
      GetCharacter: new MethodMetadata("Text", "GetCharacter", true, ["CharacterCode"]),
      GetCharacterCode: new MethodMetadata("Text", "GetCharacterCode", true, ["Character"]),
      GetIndexOf: new MethodMetadata("Text", "GetIndexOf", true, ["Text", "SubText"]),
      GetLength: new MethodMetadata("Text", "GetLength", true, ["Text"]),
      GetSubText: new MethodMetadata("Text", "GetSubText", true, ["Text", "Start", "Length"]),
      GetSubTextToEnd: new MethodMetadata("Text", "GetSubTextToEnd", true, ["Text", "Start"]),
      GetWord: new MethodMetadata("Text", "GetWord", true, ["Text", "Index"]),
      GetWordCount: new MethodMetadata("Text", "GetWordCount", true, ["Text"]),
      IsSubText: new MethodMetadata("Text", "IsSubText", true, ["Text", "SubText"]),
      StartsWith: new MethodMetadata("Text", "StartsWith", true, ["Text", "SubText"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Timer = new TypeMetadata(
    "Timer",
    {
      Pause: new MethodMetadata("Timer", "Pause", false, []),
      Resume: new MethodMetadata("Timer", "Resume", false, [])
    },
    {
      Interval: new PropertyMetadata("Timer", "Interval", true, true)
    },
    {
      Tick: new EventMetadata("Timer", "Tick")
    }
  );
  Math = new TypeMetadata(
    "Math",
    {
      Abs: new MethodMetadata("Math", "Abs", true, ["Number"]),
      Remainder: new MethodMetadata("Math", "Remainder", true, ["Dividend", "Divisor"]),
      Cos: new MethodMetadata("Math", "Cos", true, ["Angle"]),
      Sin: new MethodMetadata("Math", "Sin", true, ["Angle"]),
      Tan: new MethodMetadata("Math", "Tan", true, ["Angle"]),
      ArcCos: new MethodMetadata("Math", "ArcCos", true, ["CosValue"]),
      ArcSin: new MethodMetadata("Math", "ArcSin", true, ["SinValue"]),
      ArcTan: new MethodMetadata("Math", "ArcTan", true, ["TanValue"]),
      Ceiling: new MethodMetadata("Math", "Ceiling", true, ["Number"]),
      Floor: new MethodMetadata("Math", "Floor", true, ["Number"]),
      Round: new MethodMetadata("Math", "Round", true, ["Number"]),
      GetDegrees: new MethodMetadata("Math", "GetDegrees", true, ["Angle"]),
      GetRadians: new MethodMetadata("Math", "GetRadians", true, ["Angle"]),
      GetRandomNumber: new MethodMetadata("Math", "GetRandomNumber", true, ["MaxNumber"]),
      Log: new MethodMetadata("Math", "Log", true, ["Number"]),
      NaturalLog: new MethodMetadata("Math", "NaturalLog", true, ["Number"]),
      Max: new MethodMetadata("Math", "Max", true, ["Number1", "Number2"]),
      Min: new MethodMetadata("Math", "Min", true, ["Number1", "Number2"]),
      Power: new MethodMetadata("Math", "Power", true, ["BaseNumber", "Exponent"]),
      SquareRoot: new MethodMetadata("Math", "SquareRoot", true, ["Number"])
    },
    {
      Pi: new PropertyMetadata("Math", "Pi", true, false)
    },
    {
      // No Events
    }
  );
  Program = new TypeMetadata(
    "Program",
    {
      Delay: new MethodMetadata("Program", "Delay", false, ["milliSeconds"]),
      Pause: new MethodMetadata("Program", "Pause", false, []),
      End: new MethodMetadata("Program", "End", false, [])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Shapes = new TypeMetadata(
    "Shapes",
    {
      AddRectangle: new MethodMetadata("Shapes", "AddRectangle", true, ["Width", "Height"]),
      AddEllipse: new MethodMetadata("Shapes", "AddEllipse", true, ["Width", "Height"]),
      AddTriangle: new MethodMetadata("Shapes", "AddTriangle", true, ["X1", "Y1", "X2", "Y2", "X3", "Y3"]),
      AddLine: new MethodMetadata("Shapes", "AddLine", true, ["X1", "Y1", "X2", "Y2"]),
      AddImage: new MethodMetadata("Shapes", "AddImage", true, ["ImageName"]),
      AddText: new MethodMetadata("Shapes", "AddText", true, ["Text"]),
      SetText: new MethodMetadata("Shapes", "SetText", false, ["ShapeName", "Text"]),
      Remove: new MethodMetadata("Shapes", "Remove", false, ["ShapeName"]),
      Move: new MethodMetadata("Shapes", "Move", false, ["ShapeName", "X", "Y"]),
      Rotate: new MethodMetadata("Shapes", "Rotate", false, ["ShapeName", "Angle"]),
      Zoom: new MethodMetadata("Shapes", "Zoom", false, ["ShapeName", "ScaleX", "ScaleY"]),
      Animate: new MethodMetadata("Shapes", "Animate", false, ["ShapeName", "X", "Y", "Duration"]),
      GetLeft: new MethodMetadata("Shapes", "GetLeft", true, ["ShapeName"]),
      GetTop: new MethodMetadata("Shapes", "GetTop", true, ["ShapeName"]),
      GetOpacity: new MethodMetadata("Shapes", "GetOpacity", true, ["ShapeName"]),
      SetOpacity: new MethodMetadata("Shapes", "SetOpacity", false, ["ShapeName", "Level"]),
      HideShape: new MethodMetadata("Shapes", "HideShape", false, ["ShapeName"]),
      ShowShape: new MethodMetadata("Shapes", "ShowShape", false, ["ShapeName"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Stack = new TypeMetadata(
    "Stack",
    {
      PushValue: new MethodMetadata("Stack", "PushValue", false, ["StackName", "Value"]),
      GetCount: new MethodMetadata("Stack", "GetCount", true, ["StackName"]),
      PopValue: new MethodMetadata("Stack", "PopValue", true, ["StackName"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  TextWindow = new TypeMetadata(
    "TextWindow",
    {
      Read: new MethodMetadata("TextWindow", "Read", true, []),
      ReadNumber: new MethodMetadata("TextWindow", "ReadNumber", true, []),
      Write: new MethodMetadata("TextWindow", "Write", false, ["Data"]),
      WriteLine: new MethodMetadata("TextWindow", "WriteLine", false, ["Data"])
    },
    {
      ForegroundColor: new PropertyMetadata("TextWindow", "ForegroundColor", true, true),
      BackgroundColor: new PropertyMetadata("TextWindow", "BackgroundColor", true, true)
    },
    {
      // No Events
    }
  );
  Turtle = new TypeMetadata(
    "Turtle",
    {
      Show: new MethodMetadata("Turtle", "Show", false, []),
      Hide: new MethodMetadata("Turtle", "Hide", false, []),
      PenDown: new MethodMetadata("Turtle", "PenDown", false, []),
      PenUp: new MethodMetadata("Turtle", "PenUp", false, []),
      Move: new MethodMetadata("Turtle", "Move", false, ["Distance"]),
      MoveTo: new MethodMetadata("Turtle", "MoveTo", false, ["X", "Y"]),
      Turn: new MethodMetadata("Turtle", "Turn", false, ["Angle"]),
      TurnLeft: new MethodMetadata("Turtle", "TurnLeft", false, []),
      TurnRight: new MethodMetadata("Turtle", "TurnRight", false, [])
    },
    {
      Speed: new PropertyMetadata("Turtle", "Speed", true, true),
      Angle: new PropertyMetadata("Turtle", "Angle", true, true),
      X: new PropertyMetadata("Turtle", "X", true, true),
      Y: new PropertyMetadata("Turtle", "Y", true, true)
    },
    {
      // No Events
    }
  );
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/math.ts
var MathLibrary = class {
  getPi() {
    return new NumberValue(Math.PI);
  }
  executeCalculation(engine, calculation) {
    const args = new Array(calculation.length);
    for (let i = args.length - 1; i >= 0; i--) {
      const value = engine.popEvaluationStack().tryConvertToNumber();
      if (value.kind === 1 /* Number */) {
        args[i] = value.value;
      } else {
        engine.pushEvaluationStack(new NumberValue(0));
        return;
      }
    }
    const result = calculation(...args);
    if (engine.state !== 3 /* Terminated */) {
      engine.pushEvaluationStack(new NumberValue(result));
    }
  }
  executeRemainder(engine, _, range) {
    return this.executeCalculation(engine, (dividend, divisor) => {
      if (divisor === 0) {
        engine.terminate(new Diagnostic(29 /* CannotDivideByZero */, range));
        return 0;
      }
      return dividend % divisor;
    });
  }
  methods = {
    Abs: { execute: (engine) => this.executeCalculation(engine, Math.abs) },
    Remainder: { execute: this.executeRemainder.bind(this) },
    Cos: { execute: (engine) => this.executeCalculation(engine, Math.cos) },
    Sin: { execute: (engine) => this.executeCalculation(engine, Math.sin) },
    Tan: { execute: (engine) => this.executeCalculation(engine, Math.tan) },
    ArcCos: { execute: (engine) => this.executeCalculation(engine, Math.acos) },
    ArcSin: { execute: (engine) => this.executeCalculation(engine, Math.asin) },
    ArcTan: { execute: (engine) => this.executeCalculation(engine, Math.atan) },
    Ceiling: { execute: (engine) => this.executeCalculation(engine, Math.ceil) },
    Floor: { execute: (engine) => this.executeCalculation(engine, Math.floor) },
    Round: { execute: (engine) => this.executeCalculation(engine, Math.round) },
    GetDegrees: { execute: (engine) => this.executeCalculation(engine, (angle) => 180 * angle / Math.PI % 360) },
    GetRadians: { execute: (engine) => this.executeCalculation(engine, (angle) => angle % 360 * Math.PI / 180) },
    GetRandomNumber: { execute: (engine) => this.executeCalculation(engine, (maxNumber) => Math.floor(Math.random() * (Math.max(1, maxNumber) - 1)) + 1) },
    Log: { execute: (engine) => this.executeCalculation(engine, (value) => Math.log(value) / Math.LN10) },
    NaturalLog: { execute: (engine) => this.executeCalculation(engine, Math.log) },
    Max: { execute: (engine) => this.executeCalculation(engine, (value1, value2) => Math.max(value1, value2)) },
    Min: { execute: (engine) => this.executeCalculation(engine, (value1, value2) => Math.min(value1, value2)) },
    Power: { execute: (engine) => this.executeCalculation(engine, (baseNumber, exponent) => Math.pow(baseNumber, exponent)) },
    SquareRoot: { execute: (engine) => this.executeCalculation(engine, (value) => value < 0 ? 0 : Math.sqrt(value)) }
  };
  properties = {
    Pi: { getter: this.getPi.bind(this) }
  };
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/graphics-window.ts
function toBooleanString(value) {
  return new StringValue(value ? Constants.True : Constants.False);
}
function popString(engine) {
  return engine.popEvaluationStack().toValueString();
}
function popNumber(engine) {
  const value = engine.popEvaluationStack().tryConvertToNumber();
  return value instanceof NumberValue ? value.value : 0;
}
function getNumber(value) {
  const converted = value.tryConvertToNumber();
  return converted instanceof NumberValue ? converted.value : 0;
}
var GraphicsWindowLibrary = class {
  _pluginInstance;
  keyDownEvent = new SubModuleLibraryEvent();
  keyUpEvent = new SubModuleLibraryEvent();
  mouseDownEvent = new SubModuleLibraryEvent();
  mouseMoveEvent = new SubModuleLibraryEvent();
  mouseUpEvent = new SubModuleLibraryEvent();
  textInputEvent = new SubModuleLibraryEvent();
  get plugin() {
    if (!this._pluginInstance) {
      throw new Error("Plugin is not set.");
    }
    return this._pluginInstance;
  }
  set plugin(plugin) {
    this._pluginInstance = plugin;
  }
  getString(getter) {
    return new StringValue(getter());
  }
  getNumber(getter) {
    return new NumberValue(getter());
  }
  getBoolean(getter) {
    return toBooleanString(getter());
  }
  executeDrawBoundText(engine) {
    const text = popString(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.drawBoundText(x, y, width, text);
  }
  executeDrawEllipse(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.drawEllipse(x, y, width, height);
  }
  executeDrawImage(engine) {
    const y = popNumber(engine);
    const x = popNumber(engine);
    const imageName = popString(engine);
    this.plugin.drawImage(imageName, x, y);
  }
  executeDrawLine(engine) {
    const y2 = popNumber(engine);
    const x2 = popNumber(engine);
    const y1 = popNumber(engine);
    const x1 = popNumber(engine);
    this.plugin.drawLine(x1, y1, x2, y2);
  }
  executeDrawRectangle(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.drawRectangle(x, y, width, height);
  }
  executeDrawResizedImage(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    const imageName = popString(engine);
    this.plugin.drawResizedImage(imageName, x, y, width, height);
  }
  executeDrawText(engine) {
    const text = popString(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.drawText(x, y, text);
  }
  executeDrawTriangle(engine) {
    const y3 = popNumber(engine);
    const x3 = popNumber(engine);
    const y2 = popNumber(engine);
    const x2 = popNumber(engine);
    const y1 = popNumber(engine);
    const x1 = popNumber(engine);
    this.plugin.drawTriangle(x1, y1, x2, y2, x3, y3);
  }
  executeFillEllipse(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.fillEllipse(x, y, width, height);
  }
  executeFillRectangle(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.fillRectangle(x, y, width, height);
  }
  executeFillTriangle(engine) {
    const y3 = popNumber(engine);
    const x3 = popNumber(engine);
    const y2 = popNumber(engine);
    const x2 = popNumber(engine);
    const y1 = popNumber(engine);
    const x1 = popNumber(engine);
    this.plugin.fillTriangle(x1, y1, x2, y2, x3, y3);
  }
  executeGetColorFromRGB(engine) {
    const blue = popNumber(engine);
    const green = popNumber(engine);
    const red = popNumber(engine);
    engine.pushEvaluationStack(new StringValue(this.plugin.getColorFromRGB(red, green, blue)));
  }
  executeGetPixel(engine) {
    const y = popNumber(engine);
    const x = popNumber(engine);
    engine.pushEvaluationStack(new StringValue(this.plugin.getPixel(x, y)));
  }
  executeGetRandomColor(engine) {
    engine.pushEvaluationStack(new StringValue(this.plugin.getRandomColor()));
  }
  executeSetPixel(engine) {
    const color = popString(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.setPixel(x, y, color);
  }
  executeShowMessage(engine) {
    const title = popString(engine);
    const text = popString(engine);
    this.plugin.showMessage(text, title);
  }
  methods = {
    Clear: { execute: () => this.plugin.clear() },
    DrawBoundText: { execute: this.executeDrawBoundText.bind(this) },
    DrawEllipse: { execute: this.executeDrawEllipse.bind(this) },
    DrawImage: { execute: this.executeDrawImage.bind(this) },
    DrawLine: { execute: this.executeDrawLine.bind(this) },
    DrawRectangle: { execute: this.executeDrawRectangle.bind(this) },
    DrawResizedImage: { execute: this.executeDrawResizedImage.bind(this) },
    DrawText: { execute: this.executeDrawText.bind(this) },
    DrawTriangle: { execute: this.executeDrawTriangle.bind(this) },
    FillEllipse: { execute: this.executeFillEllipse.bind(this) },
    FillRectangle: { execute: this.executeFillRectangle.bind(this) },
    FillTriangle: { execute: this.executeFillTriangle.bind(this) },
    GetColorFromRGB: { execute: this.executeGetColorFromRGB.bind(this) },
    GetPixel: { execute: this.executeGetPixel.bind(this) },
    GetRandomColor: { execute: this.executeGetRandomColor.bind(this) },
    Hide: { execute: () => this.plugin.hide() },
    SetPixel: { execute: this.executeSetPixel.bind(this) },
    Show: { execute: () => this.plugin.show() },
    ShowMessage: { execute: this.executeShowMessage.bind(this) }
  };
  properties = {
    BackgroundColor: {
      getter: () => this.getString(() => this.plugin.getBackgroundColor()),
      setter: (value) => this.plugin.setBackgroundColor(value.toValueString())
    },
    BrushColor: {
      getter: () => this.getString(() => this.plugin.getBrushColor()),
      setter: (value) => this.plugin.setBrushColor(value.toValueString())
    },
    CanResize: {
      getter: () => this.getBoolean(() => this.plugin.getCanResize()),
      setter: (value) => this.plugin.setCanResize(value.toBoolean())
    },
    FontBold: {
      getter: () => this.getBoolean(() => this.plugin.getFontBold()),
      setter: (value) => this.plugin.setFontBold(value.toBoolean())
    },
    FontItalic: {
      getter: () => this.getBoolean(() => this.plugin.getFontItalic()),
      setter: (value) => this.plugin.setFontItalic(value.toBoolean())
    },
    FontName: {
      getter: () => this.getString(() => this.plugin.getFontName()),
      setter: (value) => this.plugin.setFontName(value.toValueString())
    },
    FontSize: {
      getter: () => this.getNumber(() => this.plugin.getFontSize()),
      setter: (value) => this.plugin.setFontSize(getNumber(value))
    },
    Height: {
      getter: () => this.getNumber(() => this.plugin.getHeight()),
      setter: (value) => this.plugin.setHeight(getNumber(value))
    },
    LastKey: {
      getter: () => this.getString(() => this.plugin.getLastKey())
    },
    LastText: {
      getter: () => this.getString(() => this.plugin.getLastText())
    },
    Left: {
      getter: () => this.getNumber(() => this.plugin.getLeft()),
      setter: (value) => this.plugin.setLeft(getNumber(value))
    },
    MouseX: {
      getter: () => this.getNumber(() => this.plugin.getMouseX())
    },
    MouseY: {
      getter: () => this.getNumber(() => this.plugin.getMouseY())
    },
    PenColor: {
      getter: () => this.getString(() => this.plugin.getPenColor()),
      setter: (value) => this.plugin.setPenColor(value.toValueString())
    },
    PenWidth: {
      getter: () => this.getNumber(() => this.plugin.getPenWidth()),
      setter: (value) => this.plugin.setPenWidth(getNumber(value))
    },
    Title: {
      getter: () => this.getString(() => this.plugin.getTitle()),
      setter: (value) => this.plugin.setTitle(value.toValueString())
    },
    Top: {
      getter: () => this.getNumber(() => this.plugin.getTop()),
      setter: (value) => this.plugin.setTop(getNumber(value))
    },
    Width: {
      getter: () => this.getNumber(() => this.plugin.getWidth()),
      setter: (value) => this.plugin.setWidth(getNumber(value))
    }
  };
  events = {
    KeyDown: this.keyDownEvent,
    KeyUp: this.keyUpEvent,
    MouseDown: this.mouseDownEvent,
    MouseMove: this.mouseMoveEvent,
    MouseUp: this.mouseUpEvent,
    TextInput: this.textInputEvent
  };
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/shapes.ts
var ShapesLibrary = class {
  _pluginInstance;
  get plugin() {
    if (!this._pluginInstance) {
      throw new Error("Plugin is not set.");
    }
    return this._pluginInstance;
  }
  set plugin(plugin) {
    this._pluginInstance = plugin;
  }
  executeAddRectangle(engine) {
    const heightArg = engine.popEvaluationStack().tryConvertToNumber();
    const widthArg = engine.popEvaluationStack().tryConvertToNumber();
    const widthValue = widthArg.kind === 1 /* Number */ ? widthArg.value : 0;
    const heightValue = heightArg.kind === 1 /* Number */ ? heightArg.value : 0;
    const rectangleName = this.plugin.addRectangle(widthValue, heightValue);
    engine.pushEvaluationStack(new StringValue(rectangleName));
  }
  executeAddEllipse(engine) {
    const heightArg = engine.popEvaluationStack().tryConvertToNumber();
    const widthArg = engine.popEvaluationStack().tryConvertToNumber();
    const widthValue = widthArg.kind === 1 /* Number */ ? widthArg.value : 0;
    const heightValue = heightArg.kind === 1 /* Number */ ? heightArg.value : 0;
    const ellipseName = this.plugin.addEllipse(widthValue, heightValue);
    engine.pushEvaluationStack(new StringValue(ellipseName));
  }
  executeAddTriangle(engine) {
    const y3Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x3Arg = engine.popEvaluationStack().tryConvertToNumber();
    const y2Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x2Arg = engine.popEvaluationStack().tryConvertToNumber();
    const y1Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x1Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x1Value = x1Arg.kind === 1 /* Number */ ? x1Arg.value : 0;
    const y1Value = y1Arg.kind === 1 /* Number */ ? y1Arg.value : 0;
    const x2Value = x2Arg.kind === 1 /* Number */ ? x2Arg.value : 0;
    const y2Value = y2Arg.kind === 1 /* Number */ ? y2Arg.value : 0;
    const x3Value = x3Arg.kind === 1 /* Number */ ? x3Arg.value : 0;
    const y3Value = y3Arg.kind === 1 /* Number */ ? y3Arg.value : 0;
    const triangleName = this.plugin.addTriangle(x1Value, y1Value, x2Value, y2Value, x3Value, y3Value);
    engine.pushEvaluationStack(new StringValue(triangleName));
  }
  executeAddLine(engine) {
    const y2Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x2Arg = engine.popEvaluationStack().tryConvertToNumber();
    const y1Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x1Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x1Value = x1Arg.kind === 1 /* Number */ ? x1Arg.value : 0;
    const y1Value = y1Arg.kind === 1 /* Number */ ? y1Arg.value : 0;
    const x2Value = x2Arg.kind === 1 /* Number */ ? x2Arg.value : 0;
    const y2Value = y2Arg.kind === 1 /* Number */ ? y2Arg.value : 0;
    const lineName = this.plugin.addLine(x1Value, y1Value, x2Value, y2Value);
    engine.pushEvaluationStack(new StringValue(lineName));
  }
  executeAddText(engine) {
    const text = engine.popEvaluationStack().toValueString();
    const shapeName = this.plugin.addText(text);
    engine.pushEvaluationStack(new StringValue(shapeName));
  }
  executeSetText(engine) {
    const text = engine.popEvaluationStack().toValueString();
    const shapeName = engine.popEvaluationStack().toValueString();
    this.plugin.setText(shapeName, text);
  }
  executeRemove(engine) {
    const shapeName = engine.popEvaluationStack().toValueString();
    this.plugin.remove(shapeName);
  }
  executeMove(engine) {
    const yArg = engine.popEvaluationStack().tryConvertToNumber();
    const xArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const xValue = xArg.kind === 1 /* Number */ ? xArg.value : 0;
    const yValue = yArg.kind === 1 /* Number */ ? yArg.value : 0;
    this.plugin.move(shapeName, xValue, yValue);
  }
  executeRotate(engine) {
    const angleArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const angleValue = angleArg.kind === 1 /* Number */ ? angleArg.value : 0;
    this.plugin.rotate(shapeName, angleValue);
  }
  executeZoom(engine) {
    const scaleYArg = engine.popEvaluationStack().tryConvertToNumber();
    const scaleXArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const scaleX = scaleXArg.kind === 1 /* Number */ ? scaleXArg.value : 0;
    const scaleY = scaleYArg.kind === 1 /* Number */ ? scaleYArg.value : 0;
    this.plugin.zoom(shapeName, scaleX, scaleY);
  }
  executeAnimate(engine) {
    const durationArg = engine.popEvaluationStack().tryConvertToNumber();
    const yArg = engine.popEvaluationStack().tryConvertToNumber();
    const xArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const xValue = xArg.kind === 1 /* Number */ ? xArg.value : 0;
    const yValue = yArg.kind === 1 /* Number */ ? yArg.value : 0;
    const durationValue = durationArg.kind === 1 /* Number */ ? durationArg.value : 0;
    this.plugin.animate(shapeName, xValue, yValue, durationValue);
  }
  executeGetLeft(engine) {
    const shapeName = engine.popEvaluationStack().toValueString();
    const leftValue = this.plugin.getLeft(shapeName);
    engine.pushEvaluationStack(new NumberValue(leftValue));
  }
  executeGetTop(engine) {
    const shapeName = engine.popEvaluationStack().toValueString();
    const topValue = this.plugin.getTop(shapeName);
    engine.pushEvaluationStack(new NumberValue(topValue));
  }
  executeGetOpacity(engine) {
    const shapeName = engine.popEvaluationStack().toValueString();
    const opacityValue = this.plugin.getOpacity(shapeName);
    engine.pushEvaluationStack(new NumberValue(opacityValue));
  }
  executeSetOpacity(engine) {
    const levelArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const levelValue = levelArg.kind === 1 /* Number */ ? levelArg.value : 0;
    this.plugin.setOpacity(shapeName, levelValue);
  }
  executeSetVisibility(engine, isVisible) {
    const shapeName = engine.popEvaluationStack().toValueString();
    this.plugin.setVisibility(shapeName, isVisible);
  }
  // TODO: implement missing method
  methods = {
    AddRectangle: { execute: this.executeAddRectangle.bind(this) },
    AddEllipse: { execute: this.executeAddEllipse.bind(this) },
    AddTriangle: { execute: this.executeAddTriangle.bind(this) },
    AddLine: { execute: this.executeAddLine.bind(this) },
    AddImage: { execute: () => {
      throw new Error("Not Implemented yet.");
    } },
    AddText: { execute: this.executeAddText.bind(this) },
    SetText: { execute: this.executeSetText.bind(this) },
    Remove: { execute: this.executeRemove.bind(this) },
    Move: { execute: this.executeMove.bind(this) },
    Rotate: { execute: this.executeRotate.bind(this) },
    Zoom: { execute: this.executeZoom.bind(this) },
    Animate: { execute: this.executeAnimate.bind(this) },
    GetLeft: { execute: this.executeGetLeft.bind(this) },
    GetTop: { execute: this.executeGetTop.bind(this) },
    GetOpacity: { execute: this.executeGetOpacity.bind(this) },
    SetOpacity: { execute: this.executeSetOpacity.bind(this) },
    HideShape: { execute: (engine) => this.executeSetVisibility(engine, false) },
    ShowShape: { execute: (engine) => this.executeSetVisibility(engine, true) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/text.ts
function toBooleanString2(value) {
  return new StringValue(value ? Constants.True : Constants.False);
}
function popNumber2(engine) {
  const value = engine.popEvaluationStack().tryConvertToNumber();
  return value instanceof NumberValue ? value.value : 0;
}
function popString2(engine) {
  return engine.popEvaluationStack().toValueString();
}
var TextLibrary = class {
  executeAppend(engine) {
    const text2 = popString2(engine);
    const text1 = popString2(engine);
    engine.pushEvaluationStack(new StringValue(text1 + text2));
  }
  executeConvertToLowerCase(engine) {
    engine.pushEvaluationStack(new StringValue(popString2(engine).toLocaleLowerCase()));
  }
  executeConvertToUpperCase(engine) {
    engine.pushEvaluationStack(new StringValue(popString2(engine).toLocaleUpperCase()));
  }
  executeEndsWith(engine) {
    const subText = popString2(engine);
    const text = popString2(engine);
    engine.pushEvaluationStack(toBooleanString2(text.endsWith(subText)));
  }
  executeGetCharacter(engine) {
    engine.pushEvaluationStack(new StringValue(String.fromCharCode(popNumber2(engine))));
  }
  executeGetCharacterCode(engine) {
    const text = popString2(engine);
    engine.pushEvaluationStack(new NumberValue(text.length > 0 ? text.charCodeAt(0) : 0));
  }
  executeGetIndexOf(engine) {
    const subText = popString2(engine);
    const text = popString2(engine);
    engine.pushEvaluationStack(new NumberValue(text.indexOf(subText) + 1));
  }
  executeGetLength(engine) {
    engine.pushEvaluationStack(new NumberValue(popString2(engine).length));
  }
  executeGetSubText(engine) {
    const length = popNumber2(engine);
    const start = popNumber2(engine) - 1;
    const text = popString2(engine);
    if (start < 0 || start >= text.length || length < 1) {
      engine.pushEvaluationStack(new StringValue(""));
      return;
    }
    const safeLength = Math.min(length, text.length - start);
    engine.pushEvaluationStack(new StringValue(text.substring(start, start + safeLength)));
  }
  executeGetSubTextToEnd(engine) {
    const start = popNumber2(engine) - 1;
    const text = popString2(engine);
    if (start < 0 || start >= text.length) {
      engine.pushEvaluationStack(new StringValue(""));
      return;
    }
    engine.pushEvaluationStack(new StringValue(text.substring(start)));
  }
  executeGetWord(engine) {
    const index = popNumber2(engine) - 1;
    const text = popString2(engine);
    const words = text.trim().length === 0 ? [] : text.trim().split(/\s+/u);
    engine.pushEvaluationStack(new StringValue(index >= 0 && index < words.length ? words[index] : ""));
  }
  executeGetWordCount(engine) {
    const text = popString2(engine);
    const words = text.trim().length === 0 ? [] : text.trim().split(/\s+/u);
    engine.pushEvaluationStack(new NumberValue(words.length));
  }
  executeIsSubText(engine) {
    const subText = popString2(engine);
    const text = popString2(engine);
    engine.pushEvaluationStack(toBooleanString2(text.includes(subText)));
  }
  executeStartsWith(engine) {
    const subText = popString2(engine);
    const text = popString2(engine);
    engine.pushEvaluationStack(toBooleanString2(text.startsWith(subText)));
  }
  methods = {
    Append: { execute: this.executeAppend.bind(this) },
    ConvertToLowerCase: { execute: this.executeConvertToLowerCase.bind(this) },
    ConvertToUpperCase: { execute: this.executeConvertToUpperCase.bind(this) },
    EndsWith: { execute: this.executeEndsWith.bind(this) },
    GetCharacter: { execute: this.executeGetCharacter.bind(this) },
    GetCharacterCode: { execute: this.executeGetCharacterCode.bind(this) },
    GetIndexOf: { execute: this.executeGetIndexOf.bind(this) },
    GetLength: { execute: this.executeGetLength.bind(this) },
    GetSubText: { execute: this.executeGetSubText.bind(this) },
    GetSubTextToEnd: { execute: this.executeGetSubTextToEnd.bind(this) },
    GetWord: { execute: this.executeGetWord.bind(this) },
    GetWordCount: { execute: this.executeGetWordCount.bind(this) },
    IsSubText: { execute: this.executeIsSubText.bind(this) },
    StartsWith: { execute: this.executeStartsWith.bind(this) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries.ts
var SubModuleLibraryEvent = class {
  subModuleName;
  setSubModule(name) {
    this.subModuleName = name;
  }
  raise(engine) {
    if (this.subModuleName) {
      engine.raiseEvent(this.subModuleName);
    }
  }
};
var RuntimeLibraries = class {
  static Metadata = new LibrariesMetadata();
  Array = new ArrayLibrary();
  Clock = new ClockLibrary();
  // TODO: public readonly Controls: ControlsLibrary = new ControlsLibrary();
  GraphicsWindow = new GraphicsWindowLibrary();
  Math = new MathLibrary();
  Program = new ProgramLibrary();
  Shapes = new ShapesLibrary();
  Stack = new StackLibrary();
  Text = new TextLibrary();
  TextWindow = new TextWindowLibrary();
  // TODO: public readonly Turtle: TurtleLibrary = new TurtleLibrary();
};

// ../../vendor/SmallBasicOnline/src/compiler/utils/notifications.ts
var PubSub = __toESM(require_pubsub());
var PubSubPayloadChannel = class {
  id;
  constructor(name) {
    this.id = name + (/* @__PURE__ */ new Date()).getTime().toString();
  }
  subscribe(subscriber) {
    return PubSub.subscribe(this.id, (_, payload) => {
      subscriber(payload);
    });
  }
  publish(payload) {
    PubSub.publish(this.id, payload);
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/binding/bound-nodes.ts
var BoundKind = /* @__PURE__ */ ((BoundKind2) => {
  BoundKind2[BoundKind2["StatementBlock"] = 0] = "StatementBlock";
  BoundKind2[BoundKind2["IfHeaderStatement"] = 1] = "IfHeaderStatement";
  BoundKind2[BoundKind2["IfStatement"] = 2] = "IfStatement";
  BoundKind2[BoundKind2["WhileStatement"] = 3] = "WhileStatement";
  BoundKind2[BoundKind2["ForStatement"] = 4] = "ForStatement";
  BoundKind2[BoundKind2["LabelStatement"] = 5] = "LabelStatement";
  BoundKind2[BoundKind2["GoToStatement"] = 6] = "GoToStatement";
  BoundKind2[BoundKind2["SubModuleInvocationStatement"] = 7] = "SubModuleInvocationStatement";
  BoundKind2[BoundKind2["LibraryMethodInvocationStatement"] = 8] = "LibraryMethodInvocationStatement";
  BoundKind2[BoundKind2["EventAssignmentStatement"] = 9] = "EventAssignmentStatement";
  BoundKind2[BoundKind2["VariableAssignmentStatement"] = 10] = "VariableAssignmentStatement";
  BoundKind2[BoundKind2["PropertyAssignmentStatement"] = 11] = "PropertyAssignmentStatement";
  BoundKind2[BoundKind2["ArrayAssignmentStatement"] = 12] = "ArrayAssignmentStatement";
  BoundKind2[BoundKind2["InvalidExpressionStatement"] = 13] = "InvalidExpressionStatement";
  BoundKind2[BoundKind2["NegationExpression"] = 14] = "NegationExpression";
  BoundKind2[BoundKind2["OrExpression"] = 15] = "OrExpression";
  BoundKind2[BoundKind2["AndExpression"] = 16] = "AndExpression";
  BoundKind2[BoundKind2["NotEqualExpression"] = 17] = "NotEqualExpression";
  BoundKind2[BoundKind2["EqualExpression"] = 18] = "EqualExpression";
  BoundKind2[BoundKind2["LessThanExpression"] = 19] = "LessThanExpression";
  BoundKind2[BoundKind2["GreaterThanExpression"] = 20] = "GreaterThanExpression";
  BoundKind2[BoundKind2["LessThanOrEqualExpression"] = 21] = "LessThanOrEqualExpression";
  BoundKind2[BoundKind2["GreaterThanOrEqualExpression"] = 22] = "GreaterThanOrEqualExpression";
  BoundKind2[BoundKind2["AdditionExpression"] = 23] = "AdditionExpression";
  BoundKind2[BoundKind2["SubtractionExpression"] = 24] = "SubtractionExpression";
  BoundKind2[BoundKind2["MultiplicationExpression"] = 25] = "MultiplicationExpression";
  BoundKind2[BoundKind2["DivisionExpression"] = 26] = "DivisionExpression";
  BoundKind2[BoundKind2["ArrayAccessExpression"] = 27] = "ArrayAccessExpression";
  BoundKind2[BoundKind2["LibraryTypeExpression"] = 28] = "LibraryTypeExpression";
  BoundKind2[BoundKind2["LibraryPropertyExpression"] = 29] = "LibraryPropertyExpression";
  BoundKind2[BoundKind2["LibraryMethodExpression"] = 30] = "LibraryMethodExpression";
  BoundKind2[BoundKind2["LibraryEventExpression"] = 31] = "LibraryEventExpression";
  BoundKind2[BoundKind2["LibraryMethodInvocationExpression"] = 32] = "LibraryMethodInvocationExpression";
  BoundKind2[BoundKind2["SubModuleExpression"] = 33] = "SubModuleExpression";
  BoundKind2[BoundKind2["SubModuleInvocationExpression"] = 34] = "SubModuleInvocationExpression";
  BoundKind2[BoundKind2["VariableExpression"] = 35] = "VariableExpression";
  BoundKind2[BoundKind2["StringLiteralExpression"] = 36] = "StringLiteralExpression";
  BoundKind2[BoundKind2["NumberLiteralExpression"] = 37] = "NumberLiteralExpression";
  BoundKind2[BoundKind2["ParenthesisExpression"] = 38] = "ParenthesisExpression";
  return BoundKind2;
})(BoundKind || {});
var BaseBoundNode = class {
  constructor(kind, syntax) {
    this.kind = kind;
    this.syntax = syntax;
  }
  kind;
  syntax;
};
var BaseBoundStatement = class extends BaseBoundNode {
};
var BoundStatementBlock = class extends BaseBoundStatement {
  constructor(statements, syntax) {
    super(0 /* StatementBlock */, syntax);
    this.statements = statements;
  }
  statements;
  children() {
    return this.statements;
  }
};
var BoundIfHeaderStatement = class extends BaseBoundNode {
  constructor(condition, block, syntax) {
    super(1 /* IfHeaderStatement */, syntax);
    this.condition = condition;
    this.block = block;
  }
  condition;
  block;
  children() {
    return [this.condition, this.block];
  }
};
var BoundIfStatement = class extends BaseBoundStatement {
  constructor(ifPart, elseIfParts, elsePart, syntax) {
    super(2 /* IfStatement */, syntax);
    this.ifPart = ifPart;
    this.elseIfParts = elseIfParts;
    this.elsePart = elsePart;
  }
  ifPart;
  elseIfParts;
  elsePart;
  children() {
    return this.elsePart ? [this.ifPart, ...this.elseIfParts, this.elsePart] : [this.ifPart, ...this.elseIfParts];
  }
};
var BoundWhileStatement = class extends BaseBoundStatement {
  constructor(condition, block, syntax) {
    super(3 /* WhileStatement */, syntax);
    this.condition = condition;
    this.block = block;
  }
  condition;
  block;
  children() {
    return [this.condition, this.block];
  }
};
var BoundForStatement = class extends BaseBoundStatement {
  constructor(identifier, fromExpression, toExpression, stepExpression, block, syntax) {
    super(4 /* ForStatement */, syntax);
    this.identifier = identifier;
    this.fromExpression = fromExpression;
    this.toExpression = toExpression;
    this.stepExpression = stepExpression;
    this.block = block;
  }
  identifier;
  fromExpression;
  toExpression;
  stepExpression;
  block;
  children() {
    const children = [this.fromExpression, this.toExpression];
    if (this.stepExpression) {
      children.push(this.stepExpression);
    }
    children.push.apply(children);
    return children;
  }
};
var BoundLabelStatement = class extends BaseBoundStatement {
  constructor(labelName, syntax) {
    super(5 /* LabelStatement */, syntax);
    this.labelName = labelName;
  }
  labelName;
  children() {
    return [];
  }
};
var BoundGoToStatement = class extends BaseBoundStatement {
  constructor(labelName, syntax) {
    super(6 /* GoToStatement */, syntax);
    this.labelName = labelName;
  }
  labelName;
  children() {
    return [];
  }
};
var BoundSubModuleInvocationStatement = class extends BaseBoundStatement {
  constructor(subModuleName, syntax) {
    super(7 /* SubModuleInvocationStatement */, syntax);
    this.subModuleName = subModuleName;
  }
  subModuleName;
  children() {
    return [];
  }
};
var BoundLibraryMethodInvocationStatement = class extends BaseBoundStatement {
  constructor(libraryName, methodName, argumentsList, syntax) {
    super(8 /* LibraryMethodInvocationStatement */, syntax);
    this.libraryName = libraryName;
    this.methodName = methodName;
    this.argumentsList = argumentsList;
  }
  libraryName;
  methodName;
  argumentsList;
  children() {
    return this.argumentsList;
  }
};
var BoundEventAssignmentStatement = class extends BaseBoundStatement {
  constructor(libraryName, eventName, subModuleName, syntax) {
    super(9 /* EventAssignmentStatement */, syntax);
    this.libraryName = libraryName;
    this.eventName = eventName;
    this.subModuleName = subModuleName;
  }
  libraryName;
  eventName;
  subModuleName;
  children() {
    return [];
  }
};
var BoundVariableAssignmentStatement = class extends BaseBoundStatement {
  constructor(variableName, value, syntax) {
    super(10 /* VariableAssignmentStatement */, syntax);
    this.variableName = variableName;
    this.value = value;
  }
  variableName;
  value;
  children() {
    return [this.value];
  }
};
var BoundPropertyAssignmentStatement = class extends BaseBoundStatement {
  constructor(libraryName, propertyName, value, syntax) {
    super(11 /* PropertyAssignmentStatement */, syntax);
    this.libraryName = libraryName;
    this.propertyName = propertyName;
    this.value = value;
  }
  libraryName;
  propertyName;
  value;
  children() {
    return [this.value];
  }
};
var BoundArrayAssignmentStatement = class extends BaseBoundStatement {
  constructor(arrayName, indices, value, syntax) {
    super(12 /* ArrayAssignmentStatement */, syntax);
    this.arrayName = arrayName;
    this.indices = indices;
    this.value = value;
  }
  arrayName;
  indices;
  value;
  children() {
    return [this.value];
  }
};
var BoundInvalidExpressionStatement = class extends BaseBoundStatement {
  constructor(expression, syntax) {
    super(13 /* InvalidExpressionStatement */, syntax);
    this.expression = expression;
  }
  expression;
  children() {
    return [this.expression];
  }
};
var BaseBoundExpression = class extends BaseBoundNode {
  constructor(kind, hasValue, hasErrors, syntax) {
    super(kind, syntax);
    this.kind = kind;
    this.hasValue = hasValue;
    this.hasErrors = hasErrors;
  }
  kind;
  hasValue;
  hasErrors;
};
var BoundNegationExpression = class extends BaseBoundExpression {
  constructor(expression, hasErrors, syntax) {
    super(14 /* NegationExpression */, true, hasErrors, syntax);
    this.expression = expression;
  }
  expression;
  children() {
    return [this.expression];
  }
};
var BoundOrExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(15 /* OrExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundAndExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(16 /* AndExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundNotEqualExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(17 /* NotEqualExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundEqualExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(18 /* EqualExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundLessThanExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(19 /* LessThanExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundGreaterThanExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(20 /* GreaterThanExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundLessThanOrEqualExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(21 /* LessThanOrEqualExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundGreaterThanOrEqualExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(22 /* GreaterThanOrEqualExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundAdditionExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(23 /* AdditionExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundSubtractionExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(24 /* SubtractionExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundMultiplicationExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(25 /* MultiplicationExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundDivisionExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(26 /* DivisionExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundArrayAccessExpression = class extends BaseBoundExpression {
  constructor(arrayName, indices, hasErrors, syntax) {
    super(27 /* ArrayAccessExpression */, true, hasErrors, syntax);
    this.arrayName = arrayName;
    this.indices = indices;
  }
  arrayName;
  indices;
  children() {
    return this.indices;
  }
};
var BoundLibraryTypeExpression = class extends BaseBoundExpression {
  constructor(libraryName, hasErrors, syntax) {
    super(28 /* LibraryTypeExpression */, false, hasErrors, syntax);
    this.libraryName = libraryName;
  }
  libraryName;
  children() {
    return [];
  }
};
var BoundLibraryPropertyExpression = class extends BaseBoundExpression {
  constructor(libraryName, propertyName, hasValue, hasErrors, syntax) {
    super(29 /* LibraryPropertyExpression */, hasValue, hasErrors, syntax);
    this.libraryName = libraryName;
    this.propertyName = propertyName;
  }
  libraryName;
  propertyName;
  children() {
    return [];
  }
};
var BoundLibraryMethodExpression = class extends BaseBoundExpression {
  constructor(libraryName, methodName, hasValue, hasErrors, syntax) {
    super(30 /* LibraryMethodExpression */, hasValue, hasErrors, syntax);
    this.libraryName = libraryName;
    this.methodName = methodName;
  }
  libraryName;
  methodName;
  children() {
    return [];
  }
};
var BoundLibraryEventExpression = class extends BaseBoundExpression {
  constructor(libraryName, eventName, hasErrors, syntax) {
    super(31 /* LibraryEventExpression */, false, hasErrors, syntax);
    this.libraryName = libraryName;
    this.eventName = eventName;
  }
  libraryName;
  eventName;
  children() {
    return [];
  }
};
var BoundLibraryMethodInvocationExpression = class extends BaseBoundExpression {
  constructor(libraryName, methodName, argumentsList, hasValue, hasErrors, syntax) {
    super(32 /* LibraryMethodInvocationExpression */, hasValue, hasErrors, syntax);
    this.libraryName = libraryName;
    this.methodName = methodName;
    this.argumentsList = argumentsList;
  }
  libraryName;
  methodName;
  argumentsList;
  children() {
    return this.argumentsList;
  }
};
var BoundSubModuleExpression = class extends BaseBoundExpression {
  constructor(subModuleName, hasErrors, syntax) {
    super(33 /* SubModuleExpression */, false, hasErrors, syntax);
    this.subModuleName = subModuleName;
  }
  subModuleName;
  children() {
    return [];
  }
};
var BoundSubModuleInvocationExpression = class extends BaseBoundExpression {
  constructor(subModuleName, hasErrors, syntax) {
    super(34 /* SubModuleInvocationExpression */, false, hasErrors, syntax);
    this.subModuleName = subModuleName;
  }
  subModuleName;
  children() {
    return [];
  }
};
var BoundVariableExpression = class extends BaseBoundExpression {
  constructor(variableName, hasErrors, syntax) {
    super(35 /* VariableExpression */, true, hasErrors, syntax);
    this.variableName = variableName;
  }
  variableName;
  children() {
    return [];
  }
};
var BoundStringLiteralExpression = class extends BaseBoundExpression {
  constructor(value, hasErrors, syntax) {
    super(36 /* StringLiteralExpression */, true, hasErrors, syntax);
    this.value = value;
  }
  value;
  children() {
    return [];
  }
};
var BoundNumberLiteralExpression = class extends BaseBoundExpression {
  constructor(value, hasErrors, syntax) {
    super(37 /* NumberLiteralExpression */, true, hasErrors, syntax);
    this.value = value;
  }
  value;
  children() {
    return [];
  }
};
var BoundParenthesisExpression = class extends BaseBoundExpression {
  constructor(expression, hasErrors, syntax) {
    super(38 /* ParenthesisExpression */, true, hasErrors, syntax);
    this.expression = expression;
  }
  expression;
  children() {
    return [this.expression];
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/binding/expression-binder.ts
var ExpressionBinder = class {
  constructor(syntax, expectedValue, _definedSubModules, _diagnostics) {
    this._definedSubModules = _definedSubModules;
    this._diagnostics = _diagnostics;
    this._result = this.bindExpression(syntax, expectedValue);
  }
  _definedSubModules;
  _diagnostics;
  _result;
  get result() {
    return this._result;
  }
  bindExpression(syntax, expectedValue) {
    let expression;
    switch (syntax.kind) {
      case 25 /* ArrayAccessExpression */:
        expression = this.bindArrayAccess(syntax);
        break;
      case 23 /* BinaryOperatorExpression */:
        expression = this.bindBinaryOperator(syntax);
        break;
      case 27 /* InvocationExpression */:
        expression = this.bindInvocation(syntax, expectedValue);
        break;
      case 24 /* ObjectAccessExpression */:
        expression = this.bindObjectAccess(syntax, expectedValue);
        break;
      case 28 /* ParenthesisExpression */:
        expression = this.bindParenthesis(syntax);
        break;
      case 30 /* NumberLiteralExpression */:
        expression = this.bindNumberLiteral(syntax);
        break;
      case 31 /* StringLiteralExpression */:
        expression = this.bindStringLiteral(syntax);
        break;
      case 29 /* IdentifierExpression */:
        expression = this.bindIdentifier(syntax, expectedValue);
        break;
      case 22 /* UnaryOperatorExpression */:
        expression = this.bindUnaryOperator(syntax);
        break;
      default:
        throw new Error(`Unexpected syntax kind: ${SyntaxKind[syntax.kind]}`);
    }
    return expression;
  }
  bindArrayAccess(syntax) {
    const baseExpression = this.bindExpression(syntax.baseExpression, true);
    const indexExpression = this.bindExpression(syntax.indexExpression, true);
    let arrayName;
    let indices;
    let hasErrors = baseExpression.hasErrors || indexExpression.hasErrors;
    switch (baseExpression.kind) {
      case 27 /* ArrayAccessExpression */: {
        const arrayAccess = baseExpression;
        arrayName = arrayAccess.arrayName;
        indices = [...arrayAccess.indices, indexExpression];
        break;
      }
      case 35 /* VariableExpression */: {
        arrayName = baseExpression.variableName;
        indices = [indexExpression];
        break;
      }
      default: {
        if (!hasErrors) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(18 /* UnsupportedArrayBaseExpression */, baseExpression.syntax.range));
        }
        arrayName = "<array>";
        indices = [indexExpression];
        break;
      }
    }
    return new BoundArrayAccessExpression(arrayName, indices, hasErrors, syntax);
  }
  bindInvocation(syntax, expectedValue) {
    const baseExpression = this.bindExpression(syntax.baseExpression, false);
    const argumentsList = syntax.argumentsList.map((arg) => this.bindExpression(arg.expression, true));
    let hasErrors = baseExpression.hasErrors || argumentsList.some((arg) => arg.hasErrors);
    switch (baseExpression.kind) {
      case 30 /* LibraryMethodExpression */: {
        const method = baseExpression;
        const definition = RuntimeLibraries.Metadata[method.libraryName].methods[method.methodName];
        const parametersCount = definition.parameters.length;
        if (argumentsList.length !== parametersCount) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(20 /* UnexpectedArgumentsCount */, baseExpression.syntax.range, parametersCount.toString(), argumentsList.length.toString()));
        } else if (expectedValue && !definition.returnsValue) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
        }
        return new BoundLibraryMethodInvocationExpression(method.libraryName, method.methodName, argumentsList, definition.returnsValue, hasErrors, syntax);
      }
      case 33 /* SubModuleExpression */: {
        if (argumentsList.length !== 0) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(20 /* UnexpectedArgumentsCount */, baseExpression.syntax.range, "0", argumentsList.length.toString()));
        } else if (expectedValue) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
        }
        const subModule = baseExpression;
        return new BoundSubModuleInvocationExpression(subModule.subModuleName, hasErrors, syntax);
      }
      default: {
        hasErrors = true;
        this._diagnostics.push(new Diagnostic(19 /* UnsupportedCallBaseExpression */, baseExpression.syntax.range));
        return new BoundLibraryMethodInvocationExpression("<library>", "<method>", argumentsList, true, hasErrors, syntax);
      }
    }
  }
  bindObjectAccess(syntax, expectedValue) {
    const leftHandSide = this.bindExpression(syntax.baseExpression, false);
    const rightHandSide = syntax.identifierToken.token.text;
    let hasErrors = leftHandSide.hasErrors;
    if (leftHandSide.kind !== 28 /* LibraryTypeExpression */) {
      hasErrors = true;
      this._diagnostics.push(new Diagnostic(23 /* UnsupportedDotBaseExpression */, leftHandSide.syntax.range));
      return new BoundLibraryPropertyExpression("<library>", rightHandSide, true, hasErrors, syntax);
    }
    const libraryType = leftHandSide;
    const propertyName = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata[libraryType.libraryName].properties, rightHandSide);
    const propertyInfo = propertyName === void 0 ? void 0 : RuntimeLibraries.Metadata[libraryType.libraryName].properties[propertyName];
    if (propertyInfo) {
      if (expectedValue && !propertyInfo.hasGetter) {
        hasErrors = true;
        this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
      }
      return new BoundLibraryPropertyExpression(libraryType.libraryName, propertyName, propertyInfo.hasGetter, hasErrors, syntax);
    }
    const methodName = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata[libraryType.libraryName].methods, rightHandSide);
    const methodInfo = methodName === void 0 ? void 0 : RuntimeLibraries.Metadata[libraryType.libraryName].methods[methodName];
    if (methodInfo) {
      if (expectedValue) {
        hasErrors = true;
        this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
      }
      return new BoundLibraryMethodExpression(libraryType.libraryName, methodName, false, hasErrors, syntax);
    }
    const eventName = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata[libraryType.libraryName].events, rightHandSide);
    if (eventName !== void 0) {
      return new BoundLibraryEventExpression(libraryType.libraryName, eventName, hasErrors, syntax);
    }
    hasErrors = true;
    this._diagnostics.push(new Diagnostic(24 /* LibraryMemberNotFound */, leftHandSide.syntax.range, libraryType.libraryName, rightHandSide));
    return new BoundLibraryPropertyExpression(libraryType.libraryName, rightHandSide, true, hasErrors, syntax);
  }
  bindParenthesis(syntax) {
    const expression = this.bindExpression(syntax.expression, true);
    return new BoundParenthesisExpression(expression, expression.hasErrors, syntax);
  }
  bindNumberLiteral(syntax) {
    const value = parseFloat(syntax.numberToken.token.text);
    const isNotANumber = isNaN(value);
    const expression = new BoundNumberLiteralExpression(value, isNotANumber, syntax);
    if (isNotANumber) {
      this._diagnostics.push(new Diagnostic(12 /* ValueIsNotANumber */, expression.syntax.range, syntax.numberToken.token.text));
    }
    return expression;
  }
  bindStringLiteral(syntax) {
    let value = syntax.stringToken.token.text;
    if (value.length < 1 || value[0] !== '"') {
      throw new Error(`String literal '${value}' should have never been parsed without a starting double quotes`);
    }
    value = value.substr(1);
    if (value.length && value[value.length - 1] === '"') {
      value = value.substr(0, value.length - 1);
    }
    return new BoundStringLiteralExpression(value, false, syntax);
  }
  bindIdentifier(syntax, expectedValue) {
    let hasErrors = false;
    const name = syntax.identifierToken.token.text;
    const libraryKey = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata, name);
    const library = libraryKey === void 0 ? void 0 : RuntimeLibraries.Metadata[libraryKey];
    if (library) {
      if (expectedValue) {
        hasErrors = true;
        this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
      }
      return new BoundLibraryTypeExpression(libraryKey, hasErrors, syntax);
    } else {
      const subModuleName = this._definedSubModules[name.toLowerCase()];
      if (subModuleName !== void 0) {
        if (expectedValue) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
        }
        return new BoundSubModuleExpression(subModuleName, hasErrors, syntax);
      }
    }
    return new BoundVariableExpression(name, hasErrors, syntax);
  }
  bindUnaryOperator(syntax) {
    const expression = this.bindExpression(syntax.expression, true);
    if (syntax.operatorToken.token.kind === 24 /* Minus */) {
      return new BoundNegationExpression(expression, expression.hasErrors, syntax);
    } else {
      throw new Error(`Unsupported token kind: ${TokenKind[syntax.operatorToken.kind]}`);
    }
  }
  bindBinaryOperator(syntax) {
    const leftHandSide = this.bindExpression(syntax.leftExpression, true);
    const rightHandSide = this.bindExpression(syntax.rightExpression, leftHandSide.kind !== 31 /* LibraryEventExpression */);
    const hasErrors = leftHandSide.hasErrors || rightHandSide.hasErrors;
    switch (syntax.operatorToken.token.kind) {
      case 32 /* Or */:
        return new BoundOrExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 33 /* And */:
        return new BoundAndExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 22 /* NotEqual */:
        return new BoundNotEqualExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 21 /* Equal */:
        return new BoundEqualExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 28 /* LessThan */:
        return new BoundLessThanExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 29 /* GreaterThan */:
        return new BoundGreaterThanExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 30 /* LessThanOrEqual */:
        return new BoundLessThanOrEqualExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 31 /* GreaterThanOrEqual */:
        return new BoundGreaterThanOrEqualExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 23 /* Plus */:
        return new BoundAdditionExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 24 /* Minus */:
        return new BoundSubtractionExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 25 /* Multiply */:
        return new BoundMultiplicationExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 26 /* Divide */:
        return new BoundDivisionExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      default:
        throw new Error(`Unexpected token kind ${TokenKind[syntax.operatorToken.kind]}`);
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/binding/statement-binder.ts
var StatementBinder = class {
  constructor(statements, _definedSubModules, _diagnostics) {
    this._definedSubModules = _definedSubModules;
    this._diagnostics = _diagnostics;
    this.result = this.bindStatementsBlock(statements);
    this._goToStatements.forEach((statement) => {
      const identifier = statement.labelToken;
      if (!this._definedLabels[identifier.token.text]) {
        this._diagnostics.push(new Diagnostic(14 /* LabelDoesNotExist */, identifier.range, identifier.token.text));
      }
    });
  }
  _definedSubModules;
  _diagnostics;
  _definedLabels = {};
  _goToStatements = [];
  result;
  bindStatementsBlock(block) {
    const result = [];
    block.statements.forEach((statement) => {
      if (statement.kind !== 21 /* CommentCommand */) {
        result.push(this.bindStatement(statement));
      }
    });
    return new BoundStatementBlock(result, block);
  }
  bindStatement(syntax) {
    switch (syntax.kind) {
      case 6 /* ForStatement */:
        return this.bindForStatement(syntax);
      case 4 /* IfStatement */:
        return this.bindIfStatement(syntax);
      case 5 /* WhileStatement */:
        return this.bindWhileStatement(syntax);
      case 16 /* LabelCommand */:
        return this.bindLabelStatement(syntax);
      case 17 /* GoToCommand */:
        return this.bindGoToStatement(syntax);
      case 20 /* ExpressionCommand */:
        return this.bindExpressionStatement(syntax);
      default:
        throw new Error(`Unexpected statement of kind ${SyntaxKind[syntax.kind]} here`);
    }
  }
  bindForStatement(syntax) {
    const identifier = syntax.forCommand.identifierToken.token.text;
    const fromExpression = this.bindExpression(syntax.forCommand.fromExpression, true);
    const toExpression = this.bindExpression(syntax.forCommand.toExpression, true);
    let stepExpression;
    if (syntax.forCommand.stepClauseOpt) {
      stepExpression = this.bindExpression(syntax.forCommand.stepClauseOpt.expression, true);
    }
    const statementsList = this.bindStatementsBlock(syntax.statementsList);
    return new BoundForStatement(identifier, fromExpression, toExpression, stepExpression, statementsList, syntax);
  }
  bindIfStatement(syntax) {
    const ifPart = new BoundIfHeaderStatement(
      this.bindExpression(syntax.ifPart.headerCommand.expression, true),
      this.bindStatementsBlock(syntax.ifPart.statementsList),
      syntax.ifPart
    );
    const elseIfParts = syntax.elseIfParts.map((elseIfPart) => {
      return new BoundIfHeaderStatement(
        this.bindExpression(elseIfPart.headerCommand.expression, true),
        this.bindStatementsBlock(elseIfPart.statementsList),
        elseIfPart
      );
    });
    let elsePart;
    if (syntax.elsePartOpt) {
      elsePart = this.bindStatementsBlock(syntax.elsePartOpt.statementsList);
    }
    return new BoundIfStatement(ifPart, elseIfParts, elsePart, syntax);
  }
  bindWhileStatement(syntax) {
    const condition = this.bindExpression(syntax.whileCommand.expression, true);
    const statementsList = this.bindStatementsBlock(syntax.statementsList);
    return new BoundWhileStatement(condition, statementsList, syntax);
  }
  bindLabelStatement(syntax) {
    const labelName = syntax.labelToken.token.text;
    this._definedLabels[labelName] = true;
    return new BoundLabelStatement(labelName, syntax);
  }
  bindGoToStatement(syntax) {
    this._goToStatements.push(syntax);
    return new BoundGoToStatement(syntax.labelToken.token.text, syntax);
  }
  bindExpressionStatement(syntax) {
    const expression = this.bindExpression(syntax.expression, false);
    if (expression.hasErrors) {
      return new BoundInvalidExpressionStatement(expression, syntax);
    }
    switch (expression.kind) {
      case 18 /* EqualExpression */: {
        const binaryExpression = expression;
        switch (binaryExpression.leftExpression.kind) {
          case 35 /* VariableExpression */: {
            const variable = binaryExpression.leftExpression;
            return new BoundVariableAssignmentStatement(variable.variableName, binaryExpression.rightExpression, syntax);
          }
          case 27 /* ArrayAccessExpression */: {
            const array = binaryExpression.leftExpression;
            return new BoundArrayAssignmentStatement(array.arrayName, array.indices, binaryExpression.rightExpression, syntax);
          }
          case 29 /* LibraryPropertyExpression */: {
            const property = binaryExpression.leftExpression;
            if (!RuntimeLibraries.Metadata[property.libraryName].properties[property.propertyName].hasSetter) {
              this._diagnostics.push(new Diagnostic(21 /* PropertyHasNoSetter */, property.syntax.range));
            }
            return new BoundPropertyAssignmentStatement(property.libraryName, property.propertyName, binaryExpression.rightExpression, syntax);
          }
          case 31 /* LibraryEventExpression */: {
            const eventExpression = binaryExpression.leftExpression;
            if (binaryExpression.rightExpression.kind === 33 /* SubModuleExpression */) {
              const subModule = binaryExpression.rightExpression;
              return new BoundEventAssignmentStatement(eventExpression.libraryName, eventExpression.eventName, subModule.subModuleName, syntax);
            }
            this._diagnostics.push(new Diagnostic(22 /* AssigningNonSubModuleToEvent */, eventExpression.syntax.range));
            return new BoundInvalidExpressionStatement(expression, syntax);
          }
          default: {
            this._diagnostics.push(new Diagnostic(
              25 /* ValueIsNotAssignable */,
              binaryExpression.leftExpression.syntax.range
            ));
            return new BoundInvalidExpressionStatement(expression, syntax);
          }
        }
      }
      case 32 /* LibraryMethodInvocationExpression */: {
        const call = expression;
        return new BoundLibraryMethodInvocationStatement(call.libraryName, call.methodName, call.argumentsList, syntax);
      }
      case 34 /* SubModuleInvocationExpression */: {
        const call = expression;
        return new BoundSubModuleInvocationStatement(call.subModuleName, syntax);
      }
    }
    const errorCode = expression.hasValue ? 15 /* UnassignedExpressionStatement */ : 16 /* InvalidExpressionStatement */;
    this._diagnostics.push(new Diagnostic(errorCode, syntax.expression.range));
    return new BoundInvalidExpressionStatement(expression, syntax);
  }
  bindExpression(syntax, expectedValue) {
    return new ExpressionBinder(syntax, expectedValue, this._definedSubModules, this._diagnostics).result;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/binding/modules-binder.ts
var ModulesBinder = class _ModulesBinder {
  constructor(parseTree, _diagnostics) {
    this._diagnostics = _diagnostics;
    this.constructSubModulesMap(parseTree);
    this._boundModules[_ModulesBinder.MainModuleName] = this.bindModule(parseTree.mainModule);
    parseTree.subModules.forEach((subModule) => {
      this._boundModules[subModule.subCommand.nameToken.token.text] = this.bindModule(subModule.statementsList);
    });
  }
  _diagnostics;
  static MainModuleName = "<Main>";
  _definedSubModules = {};
  _boundModules = {};
  get boundModules() {
    return this._boundModules;
  }
  constructSubModulesMap(parseTree) {
    parseTree.subModules.forEach((subModule) => {
      const nameToken = subModule.subCommand.nameToken;
      if (this._definedSubModules[nameToken.token.text.toLowerCase()]) {
        this._diagnostics.push(new Diagnostic(
          13 /* TwoSubModulesWithTheSameName */,
          nameToken.range,
          nameToken.token.text
        ));
      } else {
        this._definedSubModules[nameToken.token.text.toLowerCase()] = nameToken.token.text;
      }
    });
  }
  bindModule(statements) {
    return new StatementBinder(statements, this._definedSubModules, this._diagnostics).result;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/execution-engine.ts
var ExecutionState = /* @__PURE__ */ ((ExecutionState2) => {
  ExecutionState2[ExecutionState2["Running"] = 0] = "Running";
  ExecutionState2[ExecutionState2["Paused"] = 1] = "Paused";
  ExecutionState2[ExecutionState2["BlockedOnInput"] = 2] = "BlockedOnInput";
  ExecutionState2[ExecutionState2["Terminated"] = 3] = "Terminated";
  return ExecutionState2;
})(ExecutionState || {});
var ExecutionEngine4 = class {
  _libraries = new RuntimeLibraries();
  _executionStack = [];
  _evaluationStack = [];
  _memory = new ArrayValue();
  _modules;
  _exception;
  _currentLine = 0;
  _state = 0 /* Running */;
  programTerminated = new PubSubPayloadChannel("programTerminated");
  get libraries() {
    return this._libraries;
  }
  get executionStack() {
    return this._executionStack;
  }
  get evaluationStack() {
    return this._evaluationStack;
  }
  get memory() {
    return this._memory;
  }
  get modules() {
    return this._modules;
  }
  get exception() {
    return this._exception;
  }
  get state() {
    return this._state;
  }
  set state(newState) {
    this._state = newState;
  }
  constructor(compilation) {
    if (compilation.diagnostics.length) {
      throw new Error(`Cannot execute a compilation with errors`);
    }
    this._modules = compilation.emit();
    this._executionStack.push({
      moduleName: ModulesBinder.MainModuleName,
      instructionIndex: 0
    });
  }
  execute(mode) {
    if (this._state === 1 /* Paused */) {
      this._state = 0 /* Running */;
    }
    while (true) {
      if (this._state === 3 /* Terminated */) {
        return;
      }
      if (this._executionStack.length === 0) {
        this.terminate();
        return;
      }
      const frame = this._executionStack[this._executionStack.length - 1];
      if (frame.instructionIndex === this._modules[frame.moduleName].length) {
        this._executionStack.pop();
        continue;
      }
      const instruction = this._modules[frame.moduleName][frame.instructionIndex];
      if (instruction.sourceRange.start.line !== this._currentLine && mode === 2 /* NextStatement */) {
        this._currentLine = instruction.sourceRange.start.line;
        this._state = 1 /* Paused */;
        return;
      }
      instruction.execute(this, mode, frame);
      switch (this.state) {
        case 0 /* Running */:
          break;
        case 1 /* Paused */:
        case 3 /* Terminated */:
        case 2 /* BlockedOnInput */:
          return;
        default:
          throw new Error(`Unexpected execution state: '${ExecutionState[this.state]}'`);
      }
    }
  }
  terminate(exception) {
    this._state = 3 /* Terminated */;
    this._exception = exception;
    this.programTerminated.publish(exception);
  }
  popEvaluationStack() {
    const value = this._evaluationStack.pop();
    if (value) {
      return value;
    }
    throw new Error("Evaluation stack empty");
  }
  pushEvaluationStack(value) {
    this._evaluationStack.push(value);
  }
  pushSubModule(name) {
    if (this._modules[name]) {
      this._executionStack.push({
        moduleName: name,
        instructionIndex: 0
      });
    } else {
      throw new Error(`SubModule ${name} not found`);
    }
  }
  raiseEvent(subModuleName) {
    const existingIndex = this._executionStack.findIndex(
      (frame, index) => index < this._executionStack.length - 1 && frame.moduleName === subModuleName
    );
    if (existingIndex >= 0) {
      this._executionStack.splice(existingIndex, 1);
    }
    this.pushSubModule(subModuleName);
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/emitting/instructions.ts
var InstructionKind = /* @__PURE__ */ ((InstructionKind2) => {
  InstructionKind2[InstructionKind2["TempLabel"] = 0] = "TempLabel";
  InstructionKind2[InstructionKind2["TempJump"] = 1] = "TempJump";
  InstructionKind2[InstructionKind2["TempConditionalJump"] = 2] = "TempConditionalJump";
  InstructionKind2[InstructionKind2["Jump"] = 3] = "Jump";
  InstructionKind2[InstructionKind2["ConditionalJump"] = 4] = "ConditionalJump";
  InstructionKind2[InstructionKind2["InvokeSubModule"] = 5] = "InvokeSubModule";
  InstructionKind2[InstructionKind2["SetEventHandler"] = 6] = "SetEventHandler";
  InstructionKind2[InstructionKind2["StoreVariable"] = 7] = "StoreVariable";
  InstructionKind2[InstructionKind2["StoreArrayElement"] = 8] = "StoreArrayElement";
  InstructionKind2[InstructionKind2["StoreProperty"] = 9] = "StoreProperty";
  InstructionKind2[InstructionKind2["LoadVariable"] = 10] = "LoadVariable";
  InstructionKind2[InstructionKind2["LoadArrayElement"] = 11] = "LoadArrayElement";
  InstructionKind2[InstructionKind2["LoadProperty"] = 12] = "LoadProperty";
  InstructionKind2[InstructionKind2["MethodInvocation"] = 13] = "MethodInvocation";
  InstructionKind2[InstructionKind2["Negate"] = 14] = "Negate";
  InstructionKind2[InstructionKind2["Equal"] = 15] = "Equal";
  InstructionKind2[InstructionKind2["LessThan"] = 16] = "LessThan";
  InstructionKind2[InstructionKind2["GreaterThan"] = 17] = "GreaterThan";
  InstructionKind2[InstructionKind2["LessThanOrEqual"] = 18] = "LessThanOrEqual";
  InstructionKind2[InstructionKind2["GreaterThanOrEqual"] = 19] = "GreaterThanOrEqual";
  InstructionKind2[InstructionKind2["Add"] = 20] = "Add";
  InstructionKind2[InstructionKind2["Subtract"] = 21] = "Subtract";
  InstructionKind2[InstructionKind2["Multiply"] = 22] = "Multiply";
  InstructionKind2[InstructionKind2["Divide"] = 23] = "Divide";
  InstructionKind2[InstructionKind2["PushNumber"] = 24] = "PushNumber";
  InstructionKind2[InstructionKind2["PushString"] = 25] = "PushString";
  InstructionKind2[InstructionKind2["Duplicate"] = 26] = "Duplicate";
  InstructionKind2[InstructionKind2["DeleteVariable"] = 27] = "DeleteVariable";
  return InstructionKind2;
})(InstructionKind || {});
var BaseInstruction = class {
  constructor(kind, sourceRange) {
    this.kind = kind;
    this.sourceRange = sourceRange;
  }
  kind;
  sourceRange;
};
var TempLabelInstruction = class extends BaseInstruction {
  constructor(name, range) {
    super(0 /* TempLabel */, range);
    this.name = name;
  }
  name;
  execute(_1, _2, _3) {
    throw new Error("This should have been removed during emit");
  }
};
var TempJumpInstruction = class extends BaseInstruction {
  constructor(target, range) {
    super(1 /* TempJump */, range);
    this.target = target;
  }
  target;
  execute(_1, _2, _3) {
    throw new Error("This should have been removed during emit");
  }
};
var TempConditionalJumpInstruction = class extends BaseInstruction {
  constructor(trueTarget, falseTarget, range) {
    super(2 /* TempConditionalJump */, range);
    this.trueTarget = trueTarget;
    this.falseTarget = falseTarget;
  }
  trueTarget;
  falseTarget;
  execute(_1, _2, _3) {
    throw new Error("This should have been removed during emit");
  }
};
var JumpInstruction = class extends BaseInstruction {
  constructor(target, range) {
    super(3 /* Jump */, range);
    this.target = target;
  }
  target;
  execute(_1, _2, frame) {
    frame.instructionIndex = this.target;
  }
};
var ConditionalJumpInstruction = class extends BaseInstruction {
  constructor(trueTarget, falseTarget, range) {
    super(4 /* ConditionalJump */, range);
    this.trueTarget = trueTarget;
    this.falseTarget = falseTarget;
  }
  trueTarget;
  falseTarget;
  execute(engine, _2, frame) {
    const value = engine.popEvaluationStack();
    if (value.toBoolean()) {
      if (this.trueTarget) {
        frame.instructionIndex = this.trueTarget;
      } else {
        frame.instructionIndex++;
      }
    } else {
      if (this.falseTarget) {
        frame.instructionIndex = this.falseTarget;
      } else {
        frame.instructionIndex++;
      }
    }
  }
};
var InvokeSubModuleInstruction = class extends BaseInstruction {
  constructor(name, range) {
    super(5 /* InvokeSubModule */, range);
    this.name = name;
  }
  name;
  execute(engine, _2, frame) {
    frame.instructionIndex++;
    engine.pushSubModule(this.name);
  }
};
var SetEventHandlerInstruction = class extends BaseInstruction {
  constructor(library, eventName, subModuleName, range) {
    super(6 /* SetEventHandler */, range);
    this.library = library;
    this.eventName = eventName;
    this.subModuleName = subModuleName;
  }
  library;
  eventName;
  subModuleName;
  execute(engine, _2, frame) {
    engine.libraries[this.library].events[this.eventName].setSubModule(this.subModuleName);
    frame.instructionIndex++;
  }
};
var StoreVariableInstruction = class extends BaseInstruction {
  constructor(name, range) {
    super(7 /* StoreVariable */, range);
    this.name = name;
  }
  name;
  execute(engine, _2, frame) {
    const value = engine.popEvaluationStack();
    engine.memory.setIndex(this.name, value);
    frame.instructionIndex++;
  }
};
var StoreArrayElementInstruction = class extends BaseInstruction {
  constructor(name, indices, range) {
    super(8 /* StoreArrayElement */, range);
    this.name = name;
    this.indices = indices;
  }
  name;
  indices;
  execute(engine, _2, frame) {
    const value = engine.popEvaluationStack();
    let index = this.name;
    let current = engine.memory;
    let remainingIndices = this.indices;
    while (remainingIndices-- > 0) {
      const existing = current.getValue(index);
      if (!existing || existing.kind !== 2 /* Array */) {
        current.setIndex(index, new ArrayValue());
      }
      current = current.getValue(index);
      const indexValue = engine.popEvaluationStack();
      switch (indexValue.kind) {
        case 1 /* Number */:
        case 0 /* String */:
          index = indexValue.toValueString();
          break;
        case 2 /* Array */:
          engine.terminate(new Diagnostic(26 /* CannotUseAnArrayAsAnIndexToAnotherArray */, this.sourceRange));
          return;
        default:
          throw new Error(`Unexpected value kind ${ValueKind[indexValue.kind]}`);
      }
    }
    current.setIndex(index, value);
    frame.instructionIndex++;
  }
};
var StorePropertyInstruction = class extends BaseInstruction {
  constructor(library, property, range) {
    super(9 /* StoreProperty */, range);
    this.library = library;
    this.property = property;
  }
  library;
  property;
  execute(engine, _2, frame) {
    const setter = engine.libraries[this.library].properties[this.property].setter;
    if (!setter) {
      throw new Error(`Property ${this.library}.${this.property} has no setter`);
    }
    const value = engine.popEvaluationStack();
    setter(value);
    frame.instructionIndex++;
  }
};
var LoadVariableInstruction = class extends BaseInstruction {
  constructor(name, range) {
    super(10 /* LoadVariable */, range);
    this.name = name;
  }
  name;
  execute(engine, _2, frame) {
    let value = engine.memory.getValue(this.name);
    if (!value) {
      value = new StringValue("");
    }
    engine.pushEvaluationStack(value);
    frame.instructionIndex++;
  }
};
var LoadArrayElementInstruction = class extends BaseInstruction {
  constructor(name, indices, range) {
    super(11 /* LoadArrayElement */, range);
    this.name = name;
    this.indices = indices;
  }
  name;
  indices;
  execute(engine, _2, frame) {
    let index = this.name;
    let remainingIndices = this.indices;
    let current = engine.memory;
    while (remainingIndices-- > 0) {
      const existing = current.getValue(index);
      if (!existing || existing.kind !== 2 /* Array */) {
        current.setIndex(index, new ArrayValue());
      }
      current = current.getValue(index);
      const indexValue = engine.popEvaluationStack();
      switch (indexValue.kind) {
        case 1 /* Number */:
        case 0 /* String */:
          index = indexValue.toValueString();
          break;
        case 2 /* Array */:
          engine.terminate(new Diagnostic(26 /* CannotUseAnArrayAsAnIndexToAnotherArray */, this.sourceRange));
          return;
        default:
          throw new Error(`Unexpected value kind ${ValueKind[indexValue.kind]}`);
      }
    }
    if (!current.getValue(index)) {
      current.setIndex(index, new StringValue(""));
    }
    engine.pushEvaluationStack(current.getValue(index));
    frame.instructionIndex++;
  }
};
var LoadPropertyInstruction = class extends BaseInstruction {
  constructor(library, property, range) {
    super(12 /* LoadProperty */, range);
    this.library = library;
    this.property = property;
  }
  library;
  property;
  execute(engine, _2, frame) {
    const getter = engine.libraries[this.library].properties[this.property].getter;
    if (!getter) {
      throw new Error(`Property ${this.library}.${this.property} has no getter`);
    }
    const value = getter();
    engine.pushEvaluationStack(value);
    frame.instructionIndex++;
  }
};
var MethodInvocationInstruction = class extends BaseInstruction {
  constructor(library, method, range) {
    super(13 /* MethodInvocation */, range);
    this.library = library;
    this.method = method;
  }
  library;
  method;
  execute(engine, mode, frame) {
    engine.libraries[this.library].methods[this.method].execute(engine, mode, this.sourceRange);
    switch (engine.state) {
      case 2 /* BlockedOnInput */:
        break;
      case 1 /* Paused */:
      case 3 /* Terminated */:
      case 0 /* Running */:
        frame.instructionIndex++;
        break;
      default:
        throw new Error(`Unexpected execution state '${ExecutionState[engine.state]}'`);
    }
  }
};
var NegateInstruction = class extends BaseInstruction {
  constructor(range) {
    super(14 /* Negate */, range);
  }
  execute(engine, _2, frame) {
    const value = engine.popEvaluationStack().tryConvertToNumber();
    switch (value.kind) {
      case 1 /* Number */:
        engine.pushEvaluationStack(new NumberValue(-value.value));
        frame.instructionIndex++;
        break;
      case 0 /* String */:
        engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, this.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
        break;
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, this.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
        break;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[value.kind]}`);
    }
  }
};
var BaseBinaryInstruction = class extends BaseInstruction {
  constructor(kind, sourceRange) {
    super(kind, sourceRange);
    this.kind = kind;
    this.sourceRange = sourceRange;
  }
  kind;
  sourceRange;
  execute(engine, _2, frame) {
    const rightHandSide = engine.popEvaluationStack();
    const leftHandSide = engine.popEvaluationStack();
    const result = this.calculateResult(engine, rightHandSide, leftHandSide);
    engine.pushEvaluationStack(result);
    frame.instructionIndex++;
  }
};
var EqualInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(15 /* Equal */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isEqualTo(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var LessThanInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(16 /* LessThan */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isLessThan(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var GreaterThanInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(17 /* GreaterThan */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isGreaterThan(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var LessThanOrEqualInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(18 /* LessThanOrEqual */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isLessThan(rightHandSide) || leftHandSide.isEqualTo(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var GreaterThanOrEqualInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(19 /* GreaterThanOrEqual */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isGreaterThan(rightHandSide) || leftHandSide.isEqualTo(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var AddInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(20 /* Add */, range);
  }
  calculateResult(engine, rightHandSide, leftHandSide) {
    return leftHandSide.add(rightHandSide, engine, this);
  }
};
var SubtractInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(21 /* Subtract */, range);
  }
  calculateResult(engine, rightHandSide, leftHandSide) {
    return leftHandSide.subtract(rightHandSide, engine, this);
  }
};
var MultiplyInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(22 /* Multiply */, range);
  }
  calculateResult(engine, rightHandSide, leftHandSide) {
    return leftHandSide.multiply(rightHandSide, engine, this);
  }
};
var DivideInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(23 /* Divide */, range);
  }
  calculateResult(engine, rightHandSide, leftHandSide) {
    return leftHandSide.divide(rightHandSide, engine, this);
  }
};
var PushNumberInstruction = class extends BaseInstruction {
  constructor(value, range) {
    super(24 /* PushNumber */, range);
    this.value = value;
  }
  value;
  execute(engine, _2, frame) {
    engine.pushEvaluationStack(new NumberValue(this.value));
    frame.instructionIndex++;
  }
};
var PushStringInstruction = class extends BaseInstruction {
  constructor(value, range) {
    super(25 /* PushString */, range);
    this.value = value;
  }
  value;
  execute(engine, _2, frame) {
    engine.pushEvaluationStack(new StringValue(this.value));
    frame.instructionIndex++;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/emitting/temp-labels-remover.ts
var TempLabelsRemover;
((TempLabelsRemover2) => {
  function remove(instructions) {
    const map = {};
    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i].kind === 0 /* TempLabel */) {
        const label = instructions[i];
        if (map[label.name]) {
          throw new Error(`Label '${label.name}' exists twice in the same instruction set at '${map[label.name]}' and '${i}'`);
        }
        map[label.name] = i;
        instructions.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < instructions.length; i++) {
      switch (instructions[i].kind) {
        case 1 /* TempJump */: {
          const jump = instructions[i];
          instructions[i] = new JumpInstruction(replaceJump(jump.target, map), jump.sourceRange);
          break;
        }
        case 2 /* TempConditionalJump */: {
          const jump = instructions[i];
          instructions[i] = new ConditionalJumpInstruction(replaceJump(jump.trueTarget, map), replaceJump(jump.falseTarget, map), jump.sourceRange);
          break;
        }
        case 3 /* Jump */:
        case 4 /* ConditionalJump */: {
          throw new Error(`Unexpected instruction kind: ${InstructionKind[instructions[i].kind]}`);
        }
      }
    }
  }
  TempLabelsRemover2.remove = remove;
  function replaceJump(target, map) {
    if (target) {
      const index = map[target];
      if (index === void 0) {
        throw new Error(`Index for label ${target} was not calculated`);
      } else {
        return index;
      }
    } else {
      return void 0;
    }
  }
})(TempLabelsRemover || (TempLabelsRemover = {}));

// ../../vendor/SmallBasicOnline/src/compiler/emitting/module-emitter.ts
var ModuleEmitter = class {
  _jumpLabelCounter = 1;
  _instructions = [];
  get instructions() {
    return this._instructions;
  }
  constructor(block) {
    this.emitStatement(block);
    TempLabelsRemover.remove(this._instructions);
  }
  emitStatement(statement) {
    switch (statement.kind) {
      case 0 /* StatementBlock */:
        this.emitStatementBlock(statement);
        break;
      case 2 /* IfStatement */:
        this.emitIfStatement(statement);
        break;
      case 3 /* WhileStatement */:
        this.emitWhileStatement(statement);
        break;
      case 4 /* ForStatement */:
        this.emitForStatement(statement);
        break;
      case 5 /* LabelStatement */:
        this.emitLabelStatement(statement);
        break;
      case 6 /* GoToStatement */:
        this.emitGoToStatement(statement);
        break;
      case 7 /* SubModuleInvocationStatement */:
        this.emitSubModuleInvocation(statement);
        break;
      case 8 /* LibraryMethodInvocationStatement */:
        this.emitLibraryMethodInvocation(statement);
        break;
      case 9 /* EventAssignmentStatement */:
        this.emitEventAssignment(statement);
        break;
      case 10 /* VariableAssignmentStatement */:
        this.emitVariableAssignment(statement);
        break;
      case 11 /* PropertyAssignmentStatement */:
        this.emitPropertyAssignment(statement);
        break;
      case 12 /* ArrayAssignmentStatement */:
        this.emitArrayAssignment(statement);
        break;
      default:
        throw new Error(`Unexpected statement kind: ${BoundKind[statement.kind]}`);
    }
  }
  emitStatementBlock(statement) {
    statement.statements.forEach((child) => {
      this.emitStatement(child);
    });
  }
  emitIfStatement(statement) {
    const endOfBlockLabel = this.generateJumpLabel();
    this.emitIfHeader(statement.ifPart.condition, statement.ifPart.block, endOfBlockLabel);
    statement.elseIfParts.forEach((part) => this.emitIfHeader(part.condition, part.block, endOfBlockLabel));
    if (statement.elsePart) {
      this.emitStatement(statement.elsePart);
    }
    this._instructions.push(new TempLabelInstruction(endOfBlockLabel, statement.syntax.range));
  }
  emitIfHeader(condition, block, endOfBlockLabel) {
    const endOfPartLabel = this.generateJumpLabel();
    this.emitExpression(condition);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, endOfPartLabel, condition.syntax.range));
    block.statements.forEach((statement) => this.emitStatement(statement));
    const endOfPartRange = this._instructions[this._instructions.length - 1].sourceRange;
    this._instructions.push(new TempJumpInstruction(endOfBlockLabel, endOfPartRange));
    this._instructions.push(new TempLabelInstruction(endOfPartLabel, endOfPartRange));
  }
  emitWhileStatement(statement) {
    const startOfLoopLabel = this.generateJumpLabel();
    const endOfLoopLabel = this.generateJumpLabel();
    this._instructions.push(new TempLabelInstruction(startOfLoopLabel, statement.syntax.range));
    this.emitExpression(statement.condition);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, endOfLoopLabel, statement.condition.syntax.range));
    this.emitStatement(statement.block);
    const endOfLoopRange = this._instructions[this._instructions.length - 1].sourceRange;
    this._instructions.push(new TempJumpInstruction(startOfLoopLabel, endOfLoopRange));
    this._instructions.push(new TempLabelInstruction(endOfLoopLabel, endOfLoopRange));
  }
  emitForStatement(statement) {
    const beforeCheckLabel = this.generateJumpLabel();
    const positiveLoopLabel = this.generateJumpLabel();
    const negativeLoopLabel = this.generateJumpLabel();
    const afterCheckLabel = this.generateJumpLabel();
    const endOfBlockLabel = this.generateJumpLabel();
    this.emitExpression(statement.fromExpression);
    this._instructions.push(new StoreVariableInstruction(statement.identifier, statement.syntax.range));
    this._instructions.push(new TempLabelInstruction(beforeCheckLabel, statement.syntax.range));
    if (statement.stepExpression) {
      this.emitExpression(statement.stepExpression);
      this._instructions.push(new PushNumberInstruction(0, statement.stepExpression.syntax.range));
      this._instructions.push(new LessThanInstruction(statement.stepExpression.syntax.range));
      this._instructions.push(new TempConditionalJumpInstruction(negativeLoopLabel, positiveLoopLabel, statement.stepExpression.syntax.range));
    }
    this._instructions.push(new TempLabelInstruction(positiveLoopLabel, statement.toExpression.syntax.range));
    this.emitExpression(statement.toExpression);
    this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.toExpression.syntax.range));
    this._instructions.push(new LessThanInstruction(statement.toExpression.syntax.range));
    this._instructions.push(new TempConditionalJumpInstruction(endOfBlockLabel, afterCheckLabel, statement.toExpression.syntax.range));
    this._instructions.push(new TempLabelInstruction(negativeLoopLabel, statement.toExpression.syntax.range));
    this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.toExpression.syntax.range));
    this.emitExpression(statement.toExpression);
    this._instructions.push(new LessThanInstruction(statement.toExpression.syntax.range));
    this._instructions.push(new TempConditionalJumpInstruction(endOfBlockLabel, void 0, statement.toExpression.syntax.range));
    this._instructions.push(new TempLabelInstruction(afterCheckLabel, statement.toExpression.syntax.range));
    this.emitStatement(statement.block);
    this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.syntax.range));
    if (statement.stepExpression) {
      this.emitExpression(statement.stepExpression);
    } else {
      this._instructions.push(new PushNumberInstruction(1, statement.syntax.range));
    }
    this._instructions.push(new AddInstruction(statement.syntax.range));
    this._instructions.push(new StoreVariableInstruction(statement.identifier, statement.syntax.range));
    this._instructions.push(new TempJumpInstruction(beforeCheckLabel, statement.syntax.range));
    const endOfLoopRange = this._instructions[this._instructions.length - 1].sourceRange;
    this._instructions.push(new TempLabelInstruction(endOfBlockLabel, endOfLoopRange));
  }
  emitLabelStatement(statement) {
    this._instructions.push(new TempLabelInstruction(statement.labelName, statement.syntax.range));
  }
  emitGoToStatement(statement) {
    this._instructions.push(new TempJumpInstruction(statement.labelName, statement.syntax.range));
  }
  emitLibraryMethodInvocation(statement) {
    statement.argumentsList.forEach((argument) => this.emitExpression(argument));
    this._instructions.push(new MethodInvocationInstruction(statement.libraryName, statement.methodName, statement.syntax.range));
  }
  emitSubModuleInvocation(statement) {
    this._instructions.push(new InvokeSubModuleInstruction(statement.subModuleName, statement.syntax.range));
  }
  emitVariableAssignment(statement) {
    this.emitExpression(statement.value);
    this._instructions.push(new StoreVariableInstruction(statement.variableName, statement.syntax.range));
  }
  emitEventAssignment(statement) {
    this._instructions.push(new SetEventHandlerInstruction(
      statement.libraryName,
      statement.eventName,
      statement.subModuleName,
      statement.syntax.range
    ));
  }
  emitArrayAssignment(statement) {
    for (let i = statement.indices.length - 1; i >= 0; i--) {
      this.emitExpression(statement.indices[i]);
    }
    this.emitExpression(statement.value);
    this._instructions.push(new StoreArrayElementInstruction(statement.arrayName, statement.indices.length, statement.syntax.range));
  }
  emitPropertyAssignment(statement) {
    this.emitExpression(statement.value);
    this._instructions.push(new StorePropertyInstruction(statement.libraryName, statement.propertyName, statement.value.syntax.range));
  }
  emitExpression(expression) {
    switch (expression.kind) {
      case 14 /* NegationExpression */:
        this.emitNegationExpression(expression);
        break;
      case 15 /* OrExpression */:
        this.emitOrExpression(expression);
        break;
      case 16 /* AndExpression */:
        this.emitAndExpression(expression);
        break;
      case 17 /* NotEqualExpression */:
        this.emitNotEqualExpression(expression);
        break;
      case 18 /* EqualExpression */:
        this.emitEqualExpression(expression);
        break;
      case 19 /* LessThanExpression */:
        this.emitComparisonExpression(expression, new LessThanInstruction(expression.syntax.range));
        break;
      case 20 /* GreaterThanExpression */:
        this.emitComparisonExpression(expression, new GreaterThanInstruction(expression.syntax.range));
        break;
      case 21 /* LessThanOrEqualExpression */:
        this.emitComparisonExpression(expression, new LessThanOrEqualInstruction(expression.syntax.range));
        break;
      case 22 /* GreaterThanOrEqualExpression */:
        this.emitComparisonExpression(expression, new GreaterThanOrEqualInstruction(expression.syntax.range));
        break;
      case 23 /* AdditionExpression */:
        this.emitAdditionExpression(expression);
        break;
      case 24 /* SubtractionExpression */:
        this.emitSubtractionExpression(expression);
        break;
      case 25 /* MultiplicationExpression */:
        this.emitMultiplicationExpression(expression);
        break;
      case 26 /* DivisionExpression */:
        this.emitDivisionExpression(expression);
        break;
      case 27 /* ArrayAccessExpression */:
        this.emitArrayAccessExpression(expression);
        break;
      case 29 /* LibraryPropertyExpression */:
        this.emitLibraryPropertyExpression(expression);
        break;
      case 32 /* LibraryMethodInvocationExpression */:
        this.emitLibraryMethodInvocationExpression(expression);
        break;
      case 35 /* VariableExpression */:
        this.emitVariableExpression(expression);
        break;
      case 36 /* StringLiteralExpression */:
        this.emitStringLiteralExpression(expression);
        break;
      case 37 /* NumberLiteralExpression */:
        this.emitNumberLiteralExpression(expression);
        break;
      case 38 /* ParenthesisExpression */:
        this.emitParenthesisExpression(expression);
        break;
      default:
        throw new Error(`Unexpected bound expression kind: ${BoundKind[expression.kind]}`);
    }
  }
  emitNegationExpression(expression) {
    this.emitExpression(expression.expression);
    this._instructions.push(new NegateInstruction(expression.syntax.range));
  }
  emitOrExpression(expression) {
    const trySecondLabel = this.generateJumpLabel();
    const trueLabel = this.generateJumpLabel();
    const falseLabel = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this._instructions.push(new TempConditionalJumpInstruction(trueLabel, trySecondLabel, expression.syntax.range));
    this._instructions.push(new TempLabelInstruction(trySecondLabel, expression.syntax.range));
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, falseLabel, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new TempLabelInstruction(trueLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(falseLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitAndExpression(expression) {
    const falseLabel = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, falseLabel, expression.syntax.range));
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, falseLabel, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(falseLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitEqualExpression(expression) {
    const notEqualLabel = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new EqualInstruction(expression.syntax.range));
    this._instructions.push(new TempConditionalJumpInstruction(void 0, notEqualLabel, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(notEqualLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitNotEqualExpression(expression) {
    const notEqualLabel = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new EqualInstruction(expression.syntax.range));
    this._instructions.push(new TempConditionalJumpInstruction(void 0, notEqualLabel, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(notEqualLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitComparisonExpression(expression, comparison) {
    const comparisonFailed = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(comparison);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, comparisonFailed, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(comparisonFailed, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitAdditionExpression(expression) {
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new AddInstruction(expression.syntax.range));
  }
  emitSubtractionExpression(expression) {
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new SubtractInstruction(expression.syntax.range));
  }
  emitMultiplicationExpression(expression) {
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new MultiplyInstruction(expression.syntax.range));
  }
  emitDivisionExpression(expression) {
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new DivideInstruction(expression.syntax.range));
  }
  emitArrayAccessExpression(expression) {
    for (let i = expression.indices.length - 1; i >= 0; i--) {
      this.emitExpression(expression.indices[i]);
    }
    this._instructions.push(new LoadArrayElementInstruction(expression.arrayName, expression.indices.length, expression.syntax.range));
  }
  emitLibraryPropertyExpression(expression) {
    this._instructions.push(new LoadPropertyInstruction(expression.libraryName, expression.propertyName, expression.syntax.range));
  }
  emitLibraryMethodInvocationExpression(expression) {
    expression.argumentsList.forEach((argument) => this.emitExpression(argument));
    this._instructions.push(new MethodInvocationInstruction(expression.libraryName, expression.methodName, expression.syntax.range));
  }
  emitVariableExpression(expression) {
    this._instructions.push(new LoadVariableInstruction(expression.variableName, expression.syntax.range));
  }
  emitStringLiteralExpression(expression) {
    this._instructions.push(new PushStringInstruction(expression.value, expression.syntax.range));
  }
  emitNumberLiteralExpression(expression) {
    this._instructions.push(new PushNumberInstruction(expression.value, expression.syntax.range));
  }
  emitParenthesisExpression(expression) {
    this.emitExpression(expression.expression);
  }
  generateJumpLabel() {
    return `internal_$$_${this._jumpLabelCounter++}`;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/command-parser.ts
var CommandsParser = class _CommandsParser {
  constructor(_tokens, _diagnostics) {
    this._tokens = _tokens;
    this._diagnostics = _diagnostics;
    this._tokens = this._tokens.filter((token) => {
      switch (token.kind) {
        // Ignore tokens that shouldn't be parsed.
        case 0 /* UnrecognizedToken */:
          return false;
        default:
          return true;
      }
    });
    while (this._index < this._tokens.length) {
      this._currentLineHasErrors = false;
      this.parseNextCommand();
      while (this._index < this._tokens.length && this._line === this._tokens[this._index].range.start.line) {
        this._index++;
      }
      this._line++;
    }
  }
  _tokens;
  _diagnostics;
  static MissingTokenText = "?";
  _index = 0;
  _line = 0;
  _currentLineHasErrors = false;
  _result = [];
  get result() {
    return this._result;
  }
  parseNextCommand() {
    let current = this.peek();
    if (current) {
      switch (current.kind) {
        case 37 /* Comment */:
          this._result.push(this.parseCommentCommand());
          break;
        case 1 /* IfKeyword */:
          this._result.push(this.parseIfCommand());
          break;
        case 3 /* ElseKeyword */:
          this._result.push(this.parseElseCommand());
          break;
        case 4 /* ElseIfKeyword */:
          this._result.push(this.parseElseIfCommand());
          break;
        case 5 /* EndIfKeyword */:
          this._result.push(this.parseEndIfCommand());
          break;
        case 6 /* ForKeyword */:
          this._result.push(this.parseForCommand());
          break;
        case 9 /* EndForKeyword */:
          this._result.push(this.parseEndForCommand());
          break;
        case 11 /* WhileKeyword */:
          this._result.push(this.parseWhileCommand());
          break;
        case 12 /* EndWhileKeyword */:
          this._result.push(this.parseEndWhileCommand());
          break;
        case 10 /* GoToKeyword */:
          this._result.push(this.parseGoToCommand());
          break;
        case 34 /* Identifier */:
          if (this.isNext(27 /* Colon */, 1)) {
            this._result.push(this.parseLabelCommand());
          } else {
            this._result.push(this.parseExpressionCommand());
          }
          break;
        case 13 /* SubKeyword */:
          this._result.push(this.parseSubCommand());
          break;
        case 14 /* EndSubKeyword */:
          this._result.push(this.parseEndSubCommand());
          break;
        case 24 /* Minus */:
        case 35 /* NumberLiteral */:
        case 36 /* StringLiteral */:
        case 17 /* LeftParen */:
          this._result.push(this.parseExpressionCommand());
          break;
        default:
          this.eat(current.kind);
          this.reportError(new Diagnostic(2 /* UnrecognizedCommand */, current.range, current.text));
          break;
      }
    }
    current = this.peek();
    if (current) {
      if (current.kind === 37 /* Comment */) {
        this._result.push(this.parseCommentCommand());
      } else {
        this.reportError(new Diagnostic(5 /* UnexpectedToken_ExpectingEOL */, current.range, current.text));
      }
    }
  }
  parseCommentCommand() {
    const comment = this.eat(37 /* Comment */);
    return new CommentCommandSyntax(comment);
  }
  parseIfCommand() {
    const ifKeyword = this.eat(1 /* IfKeyword */);
    const expression = this.parseBaseExpression();
    const thenKeyword = this.eat(2 /* ThenKeyword */);
    return new IfCommandSyntax(ifKeyword, expression, thenKeyword);
  }
  parseElseIfCommand() {
    const elseIfKeyword = this.eat(4 /* ElseIfKeyword */);
    const expression = this.parseBaseExpression();
    const thenKeyword = this.eat(2 /* ThenKeyword */);
    return new ElseIfCommandSyntax(elseIfKeyword, expression, thenKeyword);
  }
  parseElseCommand() {
    const elseKeyword = this.eat(3 /* ElseKeyword */);
    return new ElseCommandSyntax(elseKeyword);
  }
  parseEndIfCommand() {
    const endIfKeyword = this.eat(5 /* EndIfKeyword */);
    return new EndIfCommandSyntax(endIfKeyword);
  }
  parseForCommand() {
    const forKeyword = this.eat(6 /* ForKeyword */);
    const identifierToken = this.eat(34 /* Identifier */);
    const equalToken = this.eat(21 /* Equal */);
    const fromExpression = this.parseBaseExpression();
    const toToken = this.eat(7 /* ToKeyword */);
    const toExpression = this.parseBaseExpression();
    let stepClauseSyntax;
    if (this.isNext(8 /* StepKeyword */)) {
      const stepToken = this.eat(8 /* StepKeyword */);
      const stepExpression = this.parseBaseExpression();
      stepClauseSyntax = new ForStepClauseSyntax(stepToken, stepExpression);
    }
    return new ForCommandSyntax(forKeyword, identifierToken, equalToken, fromExpression, toToken, toExpression, stepClauseSyntax);
  }
  parseEndForCommand() {
    const endForKeyword = this.eat(9 /* EndForKeyword */);
    return new EndForCommandSyntax(endForKeyword);
  }
  parseWhileCommand() {
    const whileToken = this.eat(11 /* WhileKeyword */);
    const expression = this.parseBaseExpression();
    return new WhileCommandSyntax(whileToken, expression);
  }
  parseEndWhileCommand() {
    const endWhileKeyword = this.eat(12 /* EndWhileKeyword */);
    return new EndWhileCommandSyntax(endWhileKeyword);
  }
  parseLabelCommand() {
    const labelToken = this.eat(34 /* Identifier */);
    const colonToken = this.eat(27 /* Colon */);
    return new LabelCommandSyntax(labelToken, colonToken);
  }
  parseGoToCommand() {
    const gotoToken = this.eat(10 /* GoToKeyword */);
    const labelToken = this.eat(34 /* Identifier */);
    return new GoToCommandSyntax(gotoToken, labelToken);
  }
  parseSubCommand() {
    const subToken = this.eat(13 /* SubKeyword */);
    const nameToken = this.eat(34 /* Identifier */);
    return new SubCommandSyntax(subToken, nameToken);
  }
  parseEndSubCommand() {
    const endSubToken = this.eat(14 /* EndSubKeyword */);
    return new EndSubCommandSyntax(endSubToken);
  }
  parseExpressionCommand() {
    const expression = this.parseBaseExpression();
    return new ExpressionCommandSyntax(expression);
  }
  parseBaseExpression() {
    return this.parseBinaryOperator(0);
  }
  parseBinaryOperator(precedence) {
    if (precedence >= _CommandsParser.BinaryOperatorPrecedence.length) {
      return this.parseUnaryOperator();
    }
    let expression = this.parseBinaryOperator(precedence + 1);
    const expectedOperatorKind = _CommandsParser.BinaryOperatorPrecedence[precedence];
    while (this.isNext(expectedOperatorKind)) {
      const operatorToken = this.eat(expectedOperatorKind);
      const rightHandSide = this.parseBinaryOperator(precedence + 1);
      expression = new BinaryOperatorExpressionSyntax(expression, operatorToken, rightHandSide);
    }
    return expression;
  }
  parseUnaryOperator() {
    if (this.isNext(24 /* Minus */)) {
      const minusToken = this.eat(24 /* Minus */);
      const expression = this.parseBaseExpression();
      return new UnaryOperatorExpressionSyntax(minusToken, expression);
    }
    return this.parseCoreExpression();
  }
  parseCoreExpression() {
    let expression = this.parseTerminalExpression();
    while (true) {
      const currentToken = this.peek();
      if (!currentToken) {
        return expression;
      }
      switch (currentToken.kind) {
        case 15 /* Dot */:
          expression = this.parseObjectAccessExpression(expression);
          break;
        case 19 /* LeftSquareBracket */:
          expression = this.parseArrayAccessExpressoin(expression);
          break;
        case 17 /* LeftParen */:
          expression = this.parseCallExpression(expression);
          break;
        default:
          return expression;
      }
    }
  }
  parseObjectAccessExpression(leftHandSide) {
    const dotToken = this.eat(15 /* Dot */);
    const identifierToken = this.eat(34 /* Identifier */);
    return new ObjectAccessExpressionSyntax(leftHandSide, dotToken, identifierToken);
  }
  parseArrayAccessExpressoin(leftHandSide) {
    const leftSquareBracket = this.eat(19 /* LeftSquareBracket */);
    const indexExpression = this.parseBaseExpression();
    const rightSquareBracket = this.eat(18 /* RightSquareBracket */);
    return new ArrayAccessExpressionSyntax(leftHandSide, leftSquareBracket, indexExpression, rightSquareBracket);
  }
  parseCallExpression(leftHandSide) {
    const leftParen = this.eat(17 /* LeftParen */);
    const argumentsList = [];
    let currentToken = this.peek();
    let currentArgument;
    loop: while (currentToken) {
      if (currentArgument) {
        switch (currentToken.kind) {
          case 20 /* Comma */: {
            const comma = this.eat(20 /* Comma */);
            argumentsList.push(new ArgumentSyntax(currentArgument, comma));
            currentArgument = void 0;
            break;
          }
          case 16 /* RightParen */: {
            argumentsList.push(new ArgumentSyntax(currentArgument, void 0));
            currentArgument = void 0;
            break loop;
          }
          default: {
            this.reportError(new Diagnostic(
              4 /* UnexpectedToken_ExpectingToken */,
              currentToken.range,
              currentToken.text,
              CompilerUtils.tokenToDisplayString(20 /* Comma */)
            ));
            argumentsList.push(new ArgumentSyntax(currentArgument, void 0));
            currentArgument = void 0;
            break;
          }
        }
      } else if (currentToken.kind === 16 /* RightParen */) {
        break loop;
      } else {
        currentArgument = this.parseBaseExpression();
      }
      currentToken = this.peek();
    }
    if (currentArgument) {
      argumentsList.push(new ArgumentSyntax(currentArgument, void 0));
    }
    const rightParen = this.eat(16 /* RightParen */);
    return new InvocationExpressionSyntax(leftHandSide, leftParen, argumentsList, rightParen);
  }
  parseTerminalExpression() {
    const current = this.peek();
    if (!current) {
      const range = this._tokens[this._index - 1].range;
      this.reportError(new Diagnostic(6 /* UnexpectedEOL_ExpectingExpression */, range));
      return new IdentifierExpressionSyntax(this.createMissingToken(range, 34 /* Identifier */));
    }
    switch (current.kind) {
      case 34 /* Identifier */: {
        const identifierToken = this.eat(34 /* Identifier */);
        return new IdentifierExpressionSyntax(identifierToken);
      }
      case 35 /* NumberLiteral */: {
        const numberToken = this.eat(35 /* NumberLiteral */);
        return new NumberLiteralExpressionSyntax(numberToken);
      }
      case 36 /* StringLiteral */: {
        const stringToken = this.eat(36 /* StringLiteral */);
        return new StringLiteralExpressionSyntax(stringToken);
      }
      case 17 /* LeftParen */: {
        const leftParen = this.eat(17 /* LeftParen */);
        const expression = this.parseBaseExpression();
        const rightParen = this.eat(16 /* RightParen */);
        return new ParenthesisExpressionSyntax(leftParen, expression, rightParen);
      }
      default: {
        this.eat(current.kind);
        this.reportError(new Diagnostic(3 /* UnexpectedToken_ExpectingExpression */, current.range, current.text));
        return new IdentifierExpressionSyntax(this.createMissingToken(current.range, 34 /* Identifier */));
      }
    }
  }
  isNext(kind, offset) {
    const current = this.peek(offset);
    return !!current && current.kind === kind;
  }
  peek(offset) {
    offset || (offset = 0);
    if (this._index + offset < this._tokens.length) {
      const current = this._tokens[this._index + offset];
      if (current.range.start.line === this._line) {
        return current;
      }
    }
    return;
  }
  eat(kind) {
    if (this._index < this._tokens.length) {
      const current = this._tokens[this._index];
      if (current.range.start.line === this._line) {
        if (current.kind === kind) {
          this._index++;
          return new TokenSyntax(current);
        } else {
          this.reportError(new Diagnostic(4 /* UnexpectedToken_ExpectingToken */, current.range, current.text, CompilerUtils.tokenToDisplayString(kind)));
          return this.createMissingToken(current.range, kind);
        }
      }
    }
    const range = this._tokens[this._index - 1].range;
    this.reportError(new Diagnostic(7 /* UnexpectedEOL_ExpectingToken */, range, CompilerUtils.tokenToDisplayString(kind)));
    return this.createMissingToken(range, kind);
  }
  createMissingToken(range, kind) {
    return new TokenSyntax(new Token(_CommandsParser.MissingTokenText, kind, range));
  }
  reportError(error) {
    if (!this._currentLineHasErrors) {
      this._diagnostics.push(error);
      this._currentLineHasErrors = true;
    }
  }
  static BinaryOperatorPrecedence = [
    32 /* Or */,
    33 /* And */,
    21 /* Equal */,
    22 /* NotEqual */,
    28 /* LessThan */,
    29 /* GreaterThan */,
    30 /* LessThanOrEqual */,
    31 /* GreaterThanOrEqual */,
    23 /* Plus */,
    24 /* Minus */,
    25 /* Multiply */,
    26 /* Divide */
  ];
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/scanner.ts
var Scanner = class _Scanner {
  constructor(_text, _diagnostics) {
    this._text = _text;
    this._diagnostics = _diagnostics;
    while (this.scanNextToken()) ;
  }
  _text;
  _diagnostics;
  _index = 0;
  _line = 0;
  _column = 0;
  _result = [];
  get result() {
    return this._result;
  }
  scanNextToken() {
    let current = void 0;
    let next = void 0;
    if (this._index + 1 < this._text.length) {
      current = this._text[this._index];
      next = this._text[this._index + 1];
    } else if (this._index < this._text.length) {
      current = this._text[this._index];
    } else {
      return false;
    }
    switch (current) {
      case "\r":
        switch (next) {
          case "\n":
            this._index += 2;
            this._line++;
            this._column = 0;
            return true;
          default:
            this._index++;
            this._line++;
            this._column = 0;
            return true;
        }
      case "\n":
        this._index++;
        this._line++;
        this._column = 0;
        return true;
      case " ":
        this._index++;
        this._column++;
        return true;
      case "	":
        this._index++;
        this._column++;
        return true;
      case "(":
        this.addToken(current, 17 /* LeftParen */);
        return true;
      case ")":
        this.addToken(current, 16 /* RightParen */);
        return true;
      case "[":
        this.addToken(current, 19 /* LeftSquareBracket */);
        return true;
      case "]":
        this.addToken(current, 18 /* RightSquareBracket */);
        return true;
      case ".":
        this.addToken(current, 15 /* Dot */);
        return true;
      case ",":
        this.addToken(current, 20 /* Comma */);
        return true;
      case "=":
        this.addToken(current, 21 /* Equal */);
        return true;
      case ":":
        this.addToken(current, 27 /* Colon */);
        return true;
      case "+":
        this.addToken(current, 23 /* Plus */);
        return true;
      case "-":
        this.addToken(current, 24 /* Minus */);
        return true;
      case "*":
        this.addToken(current, 25 /* Multiply */);
        return true;
      case "/":
        this.addToken(current, 26 /* Divide */);
        return true;
      case "<":
        switch (next) {
          case ">":
            this.addToken(current + next, 22 /* NotEqual */);
            return true;
          case "=":
            this.addToken(current + next, 30 /* LessThanOrEqual */);
            return true;
          default:
            this.addToken(current, 28 /* LessThan */);
            return true;
        }
      case ">":
        switch (next) {
          case "=":
            this.addToken(current + next, 31 /* GreaterThanOrEqual */);
            return true;
          default:
            this.addToken(current, 29 /* GreaterThan */);
            return true;
        }
      case "'":
        this.scanCommentToken();
        return true;
      case '"':
        this.scanStringToken();
        return true;
    }
    if ("0" <= current && current <= "9") {
      this.scanNumberToken();
      return true;
    } else if (current === "_" || "a" <= current && current <= "z" || "A" <= current && current <= "Z") {
      this.scanWordToken();
      return true;
    }
    const token = this.addToken(current, 0 /* UnrecognizedToken */);
    this._diagnostics.push(new Diagnostic(0 /* UnrecognizedCharacter */, token.range, current));
    return true;
  }
  scanCommentToken() {
    let lookAhead = this._index;
    while (lookAhead < this._text.length) {
      const current = this._text[lookAhead];
      if (current === "\r" || current === "\n") {
        break;
      }
      lookAhead++;
    }
    this.addToken(this._text.substr(this._index, lookAhead - this._index).trim(), 37 /* Comment */);
  }
  scanStringToken() {
    let lookAhead = this._index + 1;
    while (lookAhead < this._text.length) {
      const ch = this._text[lookAhead];
      switch (ch) {
        case '"':
          this.addToken(this._text.substr(this._index, lookAhead - this._index + 1), 36 /* StringLiteral */);
          return;
        case "\r":
        case "\n":
          const token = this.addToken(this._text.substr(this._index, lookAhead - this._index), 36 /* StringLiteral */);
          this._diagnostics.push(new Diagnostic(1 /* UnterminatedStringLiteral */, token.range));
          return;
        default:
          if (!_Scanner.isSupportedCharacter(ch)) {
            const column = this._column + lookAhead - this._index;
            const range = CompilerRange.fromValues(this._line, column, this._line, column);
            this._diagnostics.push(new Diagnostic(0 /* UnrecognizedCharacter */, range, ch));
          }
          lookAhead++;
          break;
      }
    }
    const unrecognizedToken = this.addToken(this._text.substr(this._index, lookAhead - this._index), 36 /* StringLiteral */);
    this._diagnostics.push(new Diagnostic(1 /* UnterminatedStringLiteral */, unrecognizedToken.range));
  }
  scanNumberToken() {
    let lookAhead = this._index;
    while (lookAhead < this._text.length && "0" <= this._text[lookAhead] && this._text[lookAhead] <= "9") {
      lookAhead++;
    }
    if (lookAhead < this._text.length && this._text[lookAhead] === ".") {
      lookAhead++;
      while (lookAhead < this._text.length && "0" <= this._text[lookAhead] && this._text[lookAhead] <= "9") {
        lookAhead++;
      }
    }
    this.addToken(this._text.substr(this._index, lookAhead - this._index), 35 /* NumberLiteral */);
  }
  scanWordToken() {
    let lookAhead = this._index;
    while (lookAhead < this._text.length) {
      const current = this._text[lookAhead];
      if (current === "_" || "a" <= current && current <= "z" || "A" <= current && current <= "Z" || "0" <= current && current <= "9") {
        lookAhead++;
      } else {
        break;
      }
    }
    const word = this._text.substr(this._index, lookAhead - this._index);
    switch (word.toLowerCase()) {
      case "if":
        this.addToken(word, 1 /* IfKeyword */);
        return;
      case "then":
        this.addToken(word, 2 /* ThenKeyword */);
        return;
      case "else":
        this.addToken(word, 3 /* ElseKeyword */);
        return;
      case "elseif":
        this.addToken(word, 4 /* ElseIfKeyword */);
        return;
      case "endif":
        this.addToken(word, 5 /* EndIfKeyword */);
        return;
      case "for":
        this.addToken(word, 6 /* ForKeyword */);
        return;
      case "to":
        this.addToken(word, 7 /* ToKeyword */);
        return;
      case "step":
        this.addToken(word, 8 /* StepKeyword */);
        return;
      case "endfor":
        this.addToken(word, 9 /* EndForKeyword */);
        return;
      case "goto":
        this.addToken(word, 10 /* GoToKeyword */);
        return;
      case "while":
        this.addToken(word, 11 /* WhileKeyword */);
        return;
      case "endwhile":
        this.addToken(word, 12 /* EndWhileKeyword */);
        return;
      case "sub":
        this.addToken(word, 13 /* SubKeyword */);
        return;
      case "endsub":
        this.addToken(word, 14 /* EndSubKeyword */);
        return;
      case "or":
        this.addToken(word, 32 /* Or */);
        return;
      case "and":
        this.addToken(word, 33 /* And */);
        return;
      default:
        this.addToken(word, 34 /* Identifier */);
        return;
    }
  }
  addToken(current, kind) {
    const token = new Token(current, kind, CompilerRange.fromValues(this._line, this._column, this._line, this._column + current.length));
    this._index += current.length;
    this._column += current.length;
    this._result.push(token);
    return token;
  }
  static isSupportedCharacter(ch) {
    if (ch.length !== 1) {
      throw `Must pass a single character at a time`;
    }
    const keycode = ch.charCodeAt(0);
    return 32 <= keycode && keycode <= 126;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/statements-parser.ts
var StatementsParser = class {
  constructor(_commands, _diagnostics) {
    this._commands = _commands;
    this._diagnostics = _diagnostics;
    let startModuleCommand;
    let currentModuleStatements = [];
    while (this._index < this._commands.length) {
      const current = this._commands[this._index];
      switch (current.kind) {
        case 18 /* SubCommand */: {
          if (startModuleCommand) {
            this.eat(current.kind);
            this._diagnostics.push(new Diagnostic(10 /* CannotDefineASubInsideAnotherSub */, current.range));
          } else {
            this._mainModule.push(...currentModuleStatements);
            currentModuleStatements = [];
            startModuleCommand = this.eat(current.kind);
          }
          break;
        }
        case 19 /* EndSubCommand */: {
          if (startModuleCommand) {
            const endModuleCommand = this.eat(current.kind);
            this._subModules.push(new SubModuleDeclarationSyntax(
              startModuleCommand,
              new StatementBlockSyntax(currentModuleStatements),
              endModuleCommand
            ));
            startModuleCommand = void 0;
            currentModuleStatements = [];
          } else {
            this.eat(current.kind);
            this._diagnostics.push(new Diagnostic(
              11 /* CannotHaveCommandWithoutPreviousCommand */,
              current.range,
              CompilerUtils.commandToDisplayString(19 /* EndSubCommand */),
              CompilerUtils.commandToDisplayString(18 /* SubCommand */)
            ));
          }
          break;
        }
        default: {
          const statement = this.parseStatement(current);
          if (statement) {
            currentModuleStatements.push(statement);
          }
          break;
        }
      }
    }
    if (startModuleCommand) {
      const endModuleCommand = this.eat(19 /* EndSubCommand */);
      this._subModules.push(new SubModuleDeclarationSyntax(
        startModuleCommand,
        new StatementBlockSyntax(currentModuleStatements),
        endModuleCommand
      ));
    } else {
      this._mainModule.push(...currentModuleStatements);
    }
  }
  _commands;
  _diagnostics;
  _index = 0;
  _mainModule = [];
  _subModules = [];
  get result() {
    return new ParseTreeSyntax(new StatementBlockSyntax(this._mainModule), this._subModules);
  }
  parseStatement(current) {
    switch (current.kind) {
      case 7 /* IfCommand */: {
        return this.parseIfStatement();
      }
      case 8 /* ElseCommand */:
      case 9 /* ElseIfCommand */:
      case 10 /* EndIfCommand */: {
        this.eat(current.kind);
        this._diagnostics.push(new Diagnostic(
          11 /* CannotHaveCommandWithoutPreviousCommand */,
          current.range,
          CompilerUtils.commandToDisplayString(current.kind),
          CompilerUtils.commandToDisplayString(7 /* IfCommand */)
        ));
        return;
      }
      case 12 /* ForCommand */: {
        return this.parseForStatement();
      }
      case 13 /* EndForCommand */: {
        this.eat(current.kind);
        this._diagnostics.push(new Diagnostic(
          11 /* CannotHaveCommandWithoutPreviousCommand */,
          current.range,
          CompilerUtils.commandToDisplayString(current.kind),
          CompilerUtils.commandToDisplayString(12 /* ForCommand */)
        ));
        return;
      }
      case 14 /* WhileCommand */: {
        return this.parseWhileStatement();
      }
      case 15 /* EndWhileCommand */: {
        this.eat(current.kind);
        this._diagnostics.push(new Diagnostic(
          11 /* CannotHaveCommandWithoutPreviousCommand */,
          current.range,
          CompilerUtils.commandToDisplayString(current.kind),
          CompilerUtils.commandToDisplayString(14 /* WhileCommand */)
        ));
        return;
      }
      case 16 /* LabelCommand */: {
        return this.eat(16 /* LabelCommand */);
      }
      case 17 /* GoToCommand */: {
        return this.eat(17 /* GoToCommand */);
      }
      case 20 /* ExpressionCommand */: {
        return this.eat(20 /* ExpressionCommand */);
      }
      case 21 /* CommentCommand */: {
        return this.eat(21 /* CommentCommand */);
      }
      default: {
        throw new Error(`Unexpected command ${SyntaxKind[current.kind]} here`);
      }
    }
  }
  parseIfStatement() {
    const ifCommand = this.eat(7 /* IfCommand */);
    const ifPartStatements = this.parseStatementsExcept(
      9 /* ElseIfCommand */,
      8 /* ElseCommand */,
      10 /* EndIfCommand */
    );
    const ifPart = new IfHeaderSyntax(ifCommand, ifPartStatements);
    const elseIfParts = [];
    while (this.isNext(9 /* ElseIfCommand */)) {
      const elseIfCommand = this.eat(9 /* ElseIfCommand */);
      const statements = this.parseStatementsExcept(
        9 /* ElseIfCommand */,
        8 /* ElseCommand */,
        10 /* EndIfCommand */
      );
      elseIfParts.push(new IfHeaderSyntax(elseIfCommand, statements));
    }
    let elsePart;
    if (this.isNext(8 /* ElseCommand */)) {
      const elseCommand = this.eat(8 /* ElseCommand */);
      const statements = this.parseStatementsExcept(
        9 /* ElseIfCommand */,
        8 /* ElseCommand */,
        10 /* EndIfCommand */
      );
      elsePart = new IfHeaderSyntax(elseCommand, statements);
    }
    let endIfPart = this.eat(10 /* EndIfCommand */);
    return new IfStatementSyntax(ifPart, elseIfParts, elsePart, endIfPart);
  }
  parseForStatement() {
    const forCommand = this.eat(12 /* ForCommand */);
    const statements = this.parseStatementsExcept(13 /* EndForCommand */);
    const endForCommand = this.eat(13 /* EndForCommand */);
    return new ForStatementSyntax(forCommand, statements, endForCommand);
  }
  parseWhileStatement() {
    const whileCommand = this.eat(14 /* WhileCommand */);
    const statements = this.parseStatementsExcept(15 /* EndWhileCommand */);
    const endWhileCommand = this.eat(15 /* EndWhileCommand */);
    return new WhileStatementSyntax(whileCommand, statements, endWhileCommand);
  }
  parseStatementsExcept(...kinds) {
    const statements = [];
    let next;
    while ((next = this.peek()) && !kinds.some((kind) => kind === next.kind)) {
      const statement = this.parseStatement(next);
      if (statement) {
        statements.push(statement);
      }
    }
    return new StatementBlockSyntax(statements);
  }
  isNext(kind) {
    if (this._index < this._commands.length) {
      return this._commands[this._index].kind === kind;
    }
    return false;
  }
  peek() {
    if (this._index < this._commands.length) {
      return this._commands[this._index];
    }
    return;
  }
  eat(kind) {
    if (this._index < this._commands.length) {
      const current = this._commands[this._index];
      if (current.kind === kind) {
        this._index++;
        return current;
      } else {
        this._diagnostics.push(new Diagnostic(
          8 /* UnexpectedCommand_ExpectingCommand */,
          current.range,
          CompilerUtils.commandToDisplayString(current.kind),
          CompilerUtils.commandToDisplayString(kind)
        ));
        return new MissingCommandSyntax(kind, current.range);
      }
    } else {
      const range = this._commands[this._commands.length - 1].range;
      this._diagnostics.push(new Diagnostic(
        9 /* UnexpectedEOF_ExpectingCommand */,
        range,
        CompilerUtils.commandToDisplayString(kind)
      ));
      return new MissingCommandSyntax(kind, range);
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/compilation.ts
var Compilation = class {
  constructor(text) {
    this.text = text;
    this.diagnostics = [];
    this.tokens = new Scanner(this.text, this.diagnostics).result;
    const commands2 = new CommandsParser(this.tokens, this.diagnostics).result;
    this.parseTree = new StatementsParser(commands2, this.diagnostics).result;
    this.setParentNode(this.parseTree);
    const binder = new ModulesBinder(this.parseTree, this.diagnostics);
    this.boundSubModules = binder.boundModules;
  }
  text;
  _outputKindDetector;
  tokens;
  parseTree;
  boundSubModules;
  diagnostics = [];
  get isReadyToRun() {
    return !!this.text.trim() && !this.diagnostics.length;
  }
  get kind() {
    if (!this._outputKindDetector) {
      this._outputKindDetector = new OutputKindDetector();
      this._outputKindDetector.visit(this.parseTree);
    }
    return this._outputKindDetector;
  }
  emit() {
    if (!this.isReadyToRun) {
      throw new Error(`Cannot emit an empty or errornous compilation`);
    }
    const result = {};
    for (const name in this.boundSubModules) {
      result[name] = new ModuleEmitter(this.boundSubModules[name]).instructions;
    }
    return result;
  }
  getSyntaxNode(position, kind) {
    function getSyntaxNodeAux(node, position2) {
      if (node.range.containsPosition(position2)) {
        let children = node.children();
        for (let i = 0; i < children.length; i++) {
          const result = getSyntaxNodeAux(children[i], position2);
          if (result) {
            return result;
          }
        }
        if (node.kind === kind) {
          return node;
        }
      }
      return void 0;
    }
    return getSyntaxNodeAux(this.parseTree, position);
  }
  setParentNode(node) {
    node.children().forEach((child) => {
      child.parentOpt = node;
      this.setParentNode(child);
    });
  }
};
var OutputKindDetector = class extends SyntaxNodeVisitor {
  _writesToTextWindow = false;
  _drawsShapes = false;
  writesToTextWindow() {
    return this._writesToTextWindow;
  }
  drawsShapes() {
    return this._drawsShapes;
  }
  visitIdentifierExpression(node) {
    const identifier = node.identifierToken.token.text.toLowerCase();
    if (identifier === "textwindow") {
      this._writesToTextWindow = true;
    }
    switch (identifier) {
      case "graphicswindow":
      case "shapes":
      case "controls":
      case "turtle":
        this._drawsShapes = true;
        break;
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/services/completion-service.ts
var CompletionService;
((CompletionService2) => {
  let ResultKind;
  ((ResultKind2) => {
    ResultKind2[ResultKind2["Class"] = 0] = "Class";
    ResultKind2[ResultKind2["Method"] = 1] = "Method";
    ResultKind2[ResultKind2["Property"] = 2] = "Property";
    ResultKind2[ResultKind2["Snippet"] = 3] = "Snippet";
    ResultKind2[ResultKind2["Event"] = 4] = "Event";
  })(ResultKind = CompletionService2.ResultKind || (CompletionService2.ResultKind = {}));
  function provideCompletion(compilation, position) {
    const objectAccessExpression = compilation.getSyntaxNode(position, 24 /* ObjectAccessExpression */);
    if (objectAccessExpression) {
      const visitor = new CompletionVisitor(compilation);
      visitor.visit(objectAccessExpression);
      return visitor.results;
    }
    const identifierExpression = compilation.getSyntaxNode(position, 29 /* IdentifierExpression */);
    if (identifierExpression) {
      const visitor = new CompletionVisitor(compilation);
      visitor.visit(identifierExpression);
      return visitor.results;
    }
    if (!compilation.text.trim()) {
      return getResultsBeforeDot("", compilation);
    }
    const wordAtCursor = extractWordAtPosition(compilation.text, position);
    return getResultsBeforeDot(wordAtCursor, compilation);
  }
  CompletionService2.provideCompletion = provideCompletion;
  class CompletionVisitor extends SyntaxNodeVisitor {
    constructor(compilation) {
      super();
      this.compilation = compilation;
    }
    compilation;
    _allResults = [];
    get results() {
      return this._allResults;
    }
    addResult(result) {
      this._allResults.push(result);
    }
    visitObjectAccessExpression(node) {
      if (node.baseExpression.kind !== 29 /* IdentifierExpression */) {
        return;
      }
      const libraryName = node.baseExpression.identifierToken.token.text;
      const library = CompilerUtils.lookupIgnoreCase(RuntimeLibraries.Metadata, libraryName);
      if (!library) {
        return;
      }
      let memberName = node.identifierToken.token.text;
      if (memberName === CommandsParser.MissingTokenText) {
        memberName = "";
      }
      CompilerUtils.values(library.methods).forEach((method) => {
        if (CompilerUtils.stringStartsWith(method.methodName, memberName)) {
          this.addResult({
            title: method.methodName,
            description: method.description,
            kind: 1 /* Method */,
            insertText: `${method.methodName}(${method.parameters.map((parameter, i) => `\${${i + 1}:${parameter}}`).join(", ")})`
          });
        }
      });
      CompilerUtils.values(library.properties).forEach((property) => {
        if (CompilerUtils.stringStartsWith(property.propertyName, memberName)) {
          this.addResult({
            title: property.propertyName,
            description: property.description,
            kind: 2 /* Property */
          });
        }
      });
      CompilerUtils.values(library.events).forEach((event) => {
        if (CompilerUtils.stringStartsWith(event.eventName, memberName)) {
          this.addResult({
            title: event.eventName,
            description: event.description,
            kind: 4 /* Event */
          });
        }
      });
    }
    visitIdentifierExpression(node) {
      const libraryName = node.identifierToken.token.text;
      this._allResults = getResultsBeforeDot(libraryName, this.compilation);
    }
  }
  function getResultsBeforeDot(prefix, compilation) {
    const results = [];
    collectVariablesAndSubModules(compilation).forEach((name) => {
      if (CompilerUtils.stringStartsWith(name, prefix)) {
        results.push({
          title: name,
          description: name,
          kind: name in compilation.boundSubModules ? 1 /* Method */ : 2 /* Property */
        });
      }
    });
    CompilerUtils.values(RuntimeLibraries.Metadata).forEach((library) => {
      if (CompilerUtils.stringStartsWith(library.typeName, prefix)) {
        results.push({
          title: library.typeName,
          description: library.description,
          kind: 0 /* Class */
        });
      }
    });
    keywordSnippets().forEach((snippet3) => {
      if (CompilerUtils.stringStartsWith(snippet3.title, prefix)) {
        results.push(snippet3);
      }
    });
    return results;
  }
  function collectVariablesAndSubModules(compilation) {
    const names = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (name) => {
      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        names.push(name);
      }
    };
    for (const [name, module2] of Object.entries(compilation.boundSubModules)) {
      if (name !== "<Main>") {
        add(name);
      }
      visit(module2, add);
    }
    return names;
  }
  function visit(node, add) {
    switch (node.kind) {
      case 10 /* VariableAssignmentStatement */:
        add(node.variableName);
        break;
      case 12 /* ArrayAssignmentStatement */:
        add(node.arrayName);
        break;
      case 8 /* LibraryMethodInvocationStatement */:
        collectArrayLibraryName(node, add);
        break;
      case 32 /* LibraryMethodInvocationExpression */:
        collectArrayLibraryName(node, add);
        break;
      default:
        break;
    }
    node.children().forEach((child) => visit(child, add));
  }
  function collectArrayLibraryName(node, add) {
    if (node.libraryName.toLowerCase() !== "array") {
      return;
    }
    switch (node.methodName.toLowerCase()) {
      case "setvalue":
      case "getvalue":
      case "removevalue":
        break;
      default:
        return;
    }
    const [firstArgument] = node.argumentsList;
    if (firstArgument?.kind === 36 /* StringLiteralExpression */) {
      add(firstArgument.value);
    }
  }
  function keywordSnippets() {
    return [
      snippet2("If", "If ${1:condition} Then\nEndIf"),
      snippet2("ElseIf", "ElseIf ${1:condition} Then"),
      snippet2("Else", "Else"),
      snippet2("EndIf", "EndIf"),
      snippet2("GoTo", "GoTo ${1:label}"),
      snippet2("While", "While ${1:condition}\nEndWhile"),
      snippet2("EndWhile", "EndWhile"),
      snippet2("For", "For ${1:name} = ${2:start} To ${3:end}\nEndFor"),
      snippet2("For Step", "For ${1:name} = ${2:start} To ${3:end} Step ${4:increment}\nEndFor"),
      snippet2("EndFor", "EndFor"),
      snippet2("Sub", "Sub ${1:name}\nEndSub"),
      snippet2("EndSub", "EndSub")
    ];
  }
  function snippet2(title, insertText) {
    return {
      kind: 3 /* Snippet */,
      title,
      description: title,
      insertText
    };
  }
  function extractWordAtPosition(text, position) {
    const lineEnd = text.indexOf("\n", position.line > 0 ? nthLineStart(text, position.line) : 0);
    const lineStart = position.line > 0 ? nthLineStart(text, position.line) : 0;
    const line = text.substring(
      lineStart,
      lineEnd === -1 ? text.length : lineEnd
    );
    const col = Math.min(position.column, line.length);
    let start = col;
    while (start > 0 && isWordChar(line.charCodeAt(start - 1))) {
      start -= 1;
    }
    return line.substring(start, col);
  }
  function nthLineStart(text, line) {
    let pos = 0;
    for (let i = 0; i < line; i++) {
      const next = text.indexOf("\n", pos);
      if (next === -1) {
        return text.length;
      }
      pos = next + 1;
    }
    return pos;
  }
  function isWordChar(code) {
    return code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 95;
  }
})(CompletionService || (CompletionService = {}));

// ../../vendor/SmallBasicOnline/src/compiler/services/hover-service.ts
var HoverService;
((HoverService2) => {
  function provideHover(compilation, position) {
    for (let i = 0; i < compilation.diagnostics.length; i++) {
      const diagnostic = compilation.diagnostics[i];
      if (diagnostic.range.containsPosition(position)) {
        return {
          range: diagnostic.range,
          text: [diagnostic.toString()]
        };
      }
    }
    const node = compilation.getSyntaxNode(position, 24 /* ObjectAccessExpression */);
    if (node) {
      const visitor = new HoverVisitor();
      visitor.visit(node);
      return visitor.result;
    }
    return void 0;
  }
  HoverService2.provideHover = provideHover;
  class HoverVisitor extends SyntaxNodeVisitor {
    _firstResult;
    get result() {
      return this._firstResult;
    }
    setResult(result) {
      if (!this._firstResult) {
        this._firstResult = result;
      }
    }
    visitObjectAccessExpression(node) {
      if (node.baseExpression.kind !== 29 /* IdentifierExpression */) {
        return;
      }
      const libraryNameText = node.baseExpression.identifierToken.token.text;
      const libraryName = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata, libraryNameText);
      const library = libraryName === void 0 ? void 0 : RuntimeLibraries.Metadata[libraryName];
      if (!library) {
        return;
      }
      let description;
      const memberNameText = node.identifierToken.token.text;
      const methodKey = CompilerUtils.findKeyIgnoreCase(library.methods, memberNameText);
      const propertyKey = methodKey === void 0 ? CompilerUtils.findKeyIgnoreCase(library.properties, memberNameText) : void 0;
      const eventKey = methodKey === void 0 && propertyKey === void 0 ? CompilerUtils.findKeyIgnoreCase(library.events, memberNameText) : void 0;
      const memberName = methodKey !== void 0 ? methodKey : propertyKey ?? eventKey;
      if (methodKey !== void 0) {
        description = library.methods[methodKey].description;
      } else if (propertyKey !== void 0) {
        description = library.properties[propertyKey].description;
      } else if (eventKey !== void 0) {
        description = library.events[eventKey].description;
      } else {
        return;
      }
      this.setResult({
        range: node.range,
        text: [
          `${libraryName}.${memberName}`,
          description
        ]
      });
    }
  }
})(HoverService || (HoverService = {}));

// src/language/compilation-cache.ts
var CompilationCache = class {
  cache = /* @__PURE__ */ new Map();
  get(document) {
    const key = document.uri.toString();
    const hit = this.cache.get(key);
    if (hit && hit.version === document.version) {
      return hit.compilation;
    }
    const compilation = new Compilation(document.getText());
    this.cache.set(key, { version: document.version, compilation });
    return compilation;
  }
  delete(uri) {
    this.cache.delete(uri.toString());
  }
  clear() {
    this.cache.clear();
  }
};

// src/language/providers.ts
var vscode3 = __toESM(require("vscode"));

// src/language/completion-span.ts
var completionSeparatorPattern = /[\s()\[\],.:+\-*/=<>"']/u;
function isCompletionWordChar(char) {
  return char.length > 0 && !completionSeparatorPattern.test(char);
}
function getCompletionSpan(lineText, character) {
  const safeCharacter = Math.max(0, Math.min(character, lineText.length));
  let start = safeCharacter;
  while (start > 0 && isCompletionWordChar(lineText[start - 1])) {
    start -= 1;
  }
  let end = safeCharacter;
  while (end < lineText.length && isCompletionWordChar(lineText[end])) {
    end += 1;
  }
  return { start, end };
}

// src/language/contextual-completions.ts
function startsWithIgnoreCase(value, prefix) {
  return value.toLowerCase().startsWith(prefix.toLowerCase());
}
function stripComment(line) {
  let inString = false;
  for (let index = 0; index < line.length; index += 1) {
    const current = line[index];
    if (current === '"') {
      inString = !inString;
      continue;
    }
    if (current === "'" && !inString) {
      return line.slice(0, index);
    }
  }
  return line;
}
function detectOpenBlocks(sourceBeforeCursor) {
  const stack = [];
  for (const rawLine of sourceBeforeCursor.split(/\r?\n/u)) {
    const line = stripComment(rawLine).trim();
    if (!line) {
      continue;
    }
    if (/^endif\b/i.test(line)) {
      popLatest(stack, "if");
      continue;
    }
    if (/^endfor\b/i.test(line)) {
      popLatest(stack, "for");
      continue;
    }
    if (/^endwhile\b/i.test(line)) {
      popLatest(stack, "while");
      continue;
    }
    if (/^endsub\b/i.test(line)) {
      popLatest(stack, "sub");
      continue;
    }
    if (/^if\b.*\bthen\b/i.test(line) && !/^elseif\b/i.test(line)) {
      stack.push("if");
      continue;
    }
    if (/^for\b.*\bto\b/i.test(line)) {
      stack.push("for");
      continue;
    }
    if (/^while\b/i.test(line)) {
      stack.push("while");
      continue;
    }
    if (/^sub\b\s+[^\s(]+/i.test(line)) {
      stack.push("sub");
    }
  }
  return stack;
}
function popLatest(stack, kind) {
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    if (stack[index] === kind) {
      stack.splice(index, 1);
      return;
    }
  }
}
function snippet(title, insertText, priority, preselect = false) {
  return {
    item: {
      kind: CompletionService.ResultKind.Snippet,
      title,
      description: title,
      insertText
    },
    priority,
    preselect
  };
}
function getContextualCompletions(sourceBeforeCursor, prefix) {
  const results = [];
  const activeBlock = detectOpenBlocks(sourceBeforeCursor).at(-1);
  switch (activeBlock) {
    case "if":
      results.push(snippet("EndIf", "EndIf", 0, true));
      results.push(snippet("ElseIf", "ElseIf ${1:condition} Then", 1));
      results.push(snippet("Else", "Else", 2));
      break;
    case "for":
      results.push(snippet("EndFor", "EndFor", 0, true));
      break;
    case "while":
      results.push(snippet("EndWhile", "EndWhile", 0, true));
      break;
    case "sub":
      results.push(snippet("EndSub", "EndSub", 0, true));
      break;
    default:
      break;
  }
  const filtered = results.filter((entry) => startsWithIgnoreCase(entry.item.title, prefix));
  const unique = /* @__PURE__ */ new Map();
  for (const entry of filtered.sort((left, right) => left.priority - right.priority || left.item.title.localeCompare(right.item.title))) {
    const key = entry.item.title.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, entry);
    }
  }
  return [...unique.values()];
}

// src/util/positions.ts
var vscode2 = __toESM(require("vscode"));
function toCompilerPosition(position) {
  return new CompilerPosition(position.line, position.character);
}
function toVsCodeRange(range) {
  return new vscode2.Range(
    range.start.line,
    range.start.column,
    range.end.line,
    range.end.column
  );
}

// src/language/providers.ts
var semanticTokenTypes = [
  "keyword",
  "comment",
  "string",
  "number",
  "class",
  "function",
  "variable"
];
var legend = new vscode3.SemanticTokensLegend([...semanticTokenTypes]);
var keywordKinds = /* @__PURE__ */ new Set([
  1 /* IfKeyword */,
  2 /* ThenKeyword */,
  3 /* ElseKeyword */,
  4 /* ElseIfKeyword */,
  5 /* EndIfKeyword */,
  6 /* ForKeyword */,
  7 /* ToKeyword */,
  8 /* StepKeyword */,
  9 /* EndForKeyword */,
  10 /* GoToKeyword */,
  11 /* WhileKeyword */,
  12 /* EndWhileKeyword */,
  13 /* SubKeyword */,
  14 /* EndSubKeyword */,
  33 /* And */,
  32 /* Or */
]);
function isSmallBasicDocument(document) {
  return document.languageId === "smallbasic";
}
var completionTriggerCharacters = [
  ".",
  ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(97 + index)),
  ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index)),
  "_"
];
function mapCompletionKind(kind) {
  switch (kind) {
    case CompletionService.ResultKind.Class:
      return vscode3.CompletionItemKind.Class;
    case CompletionService.ResultKind.Method:
      return vscode3.CompletionItemKind.Method;
    case CompletionService.ResultKind.Snippet:
      return vscode3.CompletionItemKind.Snippet;
    case CompletionService.ResultKind.Event:
      return vscode3.CompletionItemKind.Event;
    default:
      return vscode3.CompletionItemKind.Property;
  }
}
var lazyEmptyCompilation;
function emptyCompilation() {
  if (!lazyEmptyCompilation) {
    lazyEmptyCompilation = new Compilation("");
  }
  return lazyEmptyCompilation;
}
function baselineCompletions() {
  return CompletionService.provideCompletion(emptyCompilation(), new CompilerPosition(0, 0));
}
function registerLanguageFeatures(context, cache, diagnostics) {
  context.subscriptions.push(
    vscode3.languages.registerCompletionItemProvider(
      { language: "smallbasic" },
      {
        provideCompletionItems(document, position) {
          const compilation = cache.get(document);
          const lineText = document.lineAt(position.line).text;
          const span = getCompletionSpan(lineText, position.character);
          const prefix = lineText.slice(span.start, position.character);
          const results = CompletionService.provideCompletion(compilation, toCompilerPosition(position));
          const sourceBeforeCursor = document.getText(new vscode3.Range(new vscode3.Position(0, 0), position));
          const isMemberAccess = span.start > 0 && lineText[span.start - 1] === ".";
          const contextual = isMemberAccess ? [] : getContextualCompletions(sourceBeforeCursor, prefix);
          const baseline = results.length === 0 && prefix.length === 0 ? baselineCompletions().map((item) => ({ item, priority: 20 })) : [];
          const combined = dedupeCompletions([...contextual, ...results.map((item) => ({ item, priority: 10 })), ...baseline]);
          const replacing = new vscode3.Range(position.line, span.start, position.line, span.end);
          const inserting = new vscode3.Range(new vscode3.Position(position.line, span.start), position);
          return new vscode3.CompletionList(
            combined.map(({ item, priority, preselect }) => {
              const kind = mapCompletionKind(item.kind);
              const completion = new vscode3.CompletionItem(item.title, kind);
              completion.detail = item.description;
              completion.filterText = item.title;
              completion.range = { inserting, replacing };
              completion.sortText = `${priority.toString().padStart(2, "0")}_${item.title}`;
              completion.preselect = !!preselect;
              if (item.insertText !== void 0) {
                completion.insertText = new vscode3.SnippetString(item.insertText);
              } else {
                completion.insertText = item.title;
              }
              return completion;
            }),
            false
          );
        }
      },
      ...completionTriggerCharacters
    ),
    vscode3.languages.registerHoverProvider({ language: "smallbasic" }, {
      provideHover(document, position) {
        const compilation = cache.get(document);
        const hover = HoverService.provideHover(compilation, toCompilerPosition(position));
        if (!hover) {
          return void 0;
        }
        return new vscode3.Hover(
          hover.text.map((line) => new vscode3.MarkdownString(line)),
          toVsCodeRange(hover.range)
        );
      }
    }),
    vscode3.languages.registerDocumentSemanticTokensProvider(
      { language: "smallbasic" },
      {
        provideDocumentSemanticTokens(document) {
          const compilation = cache.get(document);
          const builder = new vscode3.SemanticTokensBuilder(legend);
          for (const token of compilation.tokens) {
            const tokenType = mapTokenType(compilation, token.kind, token.text);
            if (tokenType === void 0) {
              continue;
            }
            builder.push(
              token.range.start.line,
              token.range.start.column,
              Math.max(1, token.text.length),
              tokenType,
              0
            );
          }
          return builder.build();
        }
      },
      legend
    )
  );
  context.subscriptions.push(diagnostics);
}
function publishDiagnostics(document, cache, diagnostics) {
  if (!isSmallBasicDocument(document)) {
    return;
  }
  const compilation = cache.get(document);
  diagnostics.set(
    document.uri,
    compilation.diagnostics.map((diagnostic) => toVsCodeDiagnostic(diagnostic))
  );
}
function toVsCodeDiagnostic(diagnostic) {
  return new vscode3.Diagnostic(
    toVsCodeRange(diagnostic.range),
    diagnostic.toString(),
    vscode3.DiagnosticSeverity.Error
  );
}
function mapTokenType(compilation, kind, text) {
  if (keywordKinds.has(kind)) {
    return semanticTokenTypes.indexOf("keyword");
  }
  switch (kind) {
    case 37 /* Comment */:
      return semanticTokenTypes.indexOf("comment");
    case 36 /* StringLiteral */:
      return semanticTokenTypes.indexOf("string");
    case 35 /* NumberLiteral */:
      return semanticTokenTypes.indexOf("number");
    case 34 /* Identifier */:
      if (CompilerUtils.lookupIgnoreCase(RuntimeLibraries.Metadata, text) !== void 0) {
        return semanticTokenTypes.indexOf("class");
      }
      if (CompilerUtils.lookupIgnoreCase(compilation.boundSubModules, text) !== void 0) {
        return semanticTokenTypes.indexOf("function");
      }
      return semanticTokenTypes.indexOf("variable");
    default:
      return void 0;
  }
}
function dedupeCompletions(items) {
  const seen = /* @__PURE__ */ new Set();
  const deduped = [];
  for (const item of items) {
    const key = item.item.title.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(item);
  }
  return deduped;
}

// src/run/terminal-session.ts
var vscode4 = __toESM(require("vscode"));
var ansiForeground = {
  [0 /* Black */]: 30,
  [1 /* DarkBlue */]: 34,
  [2 /* DarkGreen */]: 32,
  [3 /* DarkCyan */]: 36,
  [4 /* DarkRed */]: 31,
  [5 /* DarkMagenta */]: 35,
  [6 /* DarkYellow */]: 33,
  [7 /* Gray */]: 37,
  [8 /* DarkGray */]: 90,
  [9 /* Blue */]: 94,
  [10 /* Green */]: 92,
  [11 /* Cyan */]: 96,
  [12 /* Red */]: 91,
  [13 /* Magenta */]: 95,
  [14 /* Yellow */]: 93,
  [15 /* White */]: 97
};
var ansiBackground = {
  [0 /* Black */]: 40,
  [1 /* DarkBlue */]: 44,
  [2 /* DarkGreen */]: 42,
  [3 /* DarkCyan */]: 46,
  [4 /* DarkRed */]: 41,
  [5 /* DarkMagenta */]: 45,
  [6 /* DarkYellow */]: 43,
  [7 /* Gray */]: 47,
  [8 /* DarkGray */]: 100,
  [9 /* Blue */]: 104,
  [10 /* Green */]: 102,
  [11 /* Cyan */]: 106,
  [12 /* Red */]: 101,
  [13 /* Magenta */]: 105,
  [14 /* Yellow */]: 103,
  [15 /* White */]: 107
};
var SmallBasicTerminalSession = class {
  writeEmitter = new vscode4.EventEmitter();
  closeEmitter = new vscode4.EventEmitter();
  inputBuffer = [];
  lineBuffer = [];
  engine;
  scheduled = false;
  disposed = false;
  pendingInputKind;
  waitingForExitConfirmation = false;
  exitCode = 0;
  foreground = 15 /* White */;
  background = 0 /* Black */;
  onDidWrite = this.writeEmitter.event;
  onDidClose = this.closeEmitter.event;
  run(compilation) {
    this.engine = new ExecutionEngine4(compilation);
    this.engine.libraries.TextWindow.plugin = this;
    this.schedule(0);
  }
  open() {
    this.writeEmitter.fire("\x1B[2J\x1B[3J\x1B[;H");
  }
  close() {
    this.disposed = true;
    if (this.engine && this.engine.state !== 3 /* Terminated */) {
      this.engine.terminate();
    }
  }
  handleInput(data) {
    if (this.disposed) {
      return;
    }
    if (this.waitingForExitConfirmation) {
      if (data === "\r") {
        this.closeEmitter.fire(this.exitCode);
      }
      return;
    }
    switch (data) {
      case "\r": {
        const line = this.lineBuffer.join("");
        this.lineBuffer.length = 0;
        this.writeEmitter.fire("\r\n");
        if (this.pendingInputKind === 1 /* Number */) {
          const parsed = Number(line);
          this.inputBuffer.push(new NumberValue(Number.isFinite(parsed) ? parsed : 0));
        } else {
          this.inputBuffer.push(new StringValue(line));
        }
        this.pendingInputKind = void 0;
        this.schedule(0);
        return;
      }
      case "\x7F": {
        if (this.lineBuffer.length > 0) {
          this.lineBuffer.pop();
          this.writeEmitter.fire("\b \b");
        }
        return;
      }
      default:
        this.lineBuffer.push(data);
        this.writeEmitter.fire(data);
    }
  }
  inputIsNeeded(kind) {
    this.pendingInputKind = kind;
  }
  checkInputBuffer() {
    return this.inputBuffer.shift();
  }
  writeText(value, appendNewLine) {
    this.writeEmitter.fire(this.colorize(value + (appendNewLine ? "\r\n" : "")));
  }
  getForegroundColor() {
    return this.foreground;
  }
  setForegroundColor(color) {
    this.foreground = color;
  }
  getBackgroundColor() {
    return this.background;
  }
  setBackgroundColor(color) {
    this.background = color;
  }
  schedule(delayMs) {
    if (this.scheduled || this.disposed) {
      return;
    }
    this.scheduled = true;
    setTimeout(() => {
      this.scheduled = false;
      this.tick();
    }, delayMs);
  }
  tick() {
    if (this.disposed || !this.engine) {
      return;
    }
    this.engine.execute(0 /* RunToEnd */);
    switch (this.engine.state) {
      case 0 /* Running */:
        this.schedule(0);
        break;
      case 2 /* BlockedOnInput */:
        this.schedule(this.pendingInputKind === void 0 ? 10 : 50);
        break;
      case 3 /* Terminated */:
        if (this.engine.exception) {
          this.writeEmitter.fire(this.colorize(`\r
[Runtime Error] ${this.engine.exception.toString()}\r
`));
        }
        this.pauseBeforeClose(0);
        break;
      case 1 /* Paused */:
        this.schedule(10);
        break;
      default:
        this.pauseBeforeClose(1);
        break;
    }
  }
  colorize(text) {
    return `\x1B[${ansiForeground[this.foreground]};${ansiBackground[this.background]}m${text}\x1B[0m`;
  }
  pauseBeforeClose(exitCode) {
    this.waitingForExitConfirmation = true;
    this.exitCode = exitCode;
    this.writeEmitter.fire(this.colorize("\r\n[Program finished] \u6309 Enter \u5173\u95ED\u7EC8\u7AEF...\r\n"));
  }
};

// src/common/activation.ts
function activateCommon(context, platform) {
  const cache = new CompilationCache();
  const diagnostics = vscode5.languages.createDiagnosticCollection("smallbasic");
  const debounceMs = () => vscode5.workspace.getConfiguration("smallbasic").get("diagnostics.debounceMs", 150);
  const pending = /* @__PURE__ */ new Map();
  const scheduleDiagnostics = (document) => {
    if (!isSmallBasicDocument(document)) {
      return;
    }
    const key = document.uri.toString();
    const existing = pending.get(key);
    if (existing) {
      clearTimeout(existing);
    }
    pending.set(key, setTimeout(() => {
      pending.delete(key);
      publishDiagnostics(document, cache, diagnostics);
    }, debounceMs()));
  };
  registerLanguageFeatures(context, cache, diagnostics);
  registerSmallBasicInlineValues(context);
  context.subscriptions.push(
    vscode5.debug.registerDebugAdapterDescriptorFactory("smallbasic", platform.debugAdapterFactory),
    vscode5.debug.registerDebugConfigurationProvider(
      "smallbasic",
      platform.debugConfigurationProvider,
      vscode5.DebugConfigurationProviderTriggerKind.Initial
    )
  );
  for (const document of vscode5.workspace.textDocuments) {
    scheduleDiagnostics(document);
  }
  const subscriptions = [
    vscode5.workspace.onDidOpenTextDocument(scheduleDiagnostics),
    vscode5.workspace.onDidChangeTextDocument((event) => {
      cache.delete(event.document.uri);
      scheduleDiagnostics(event.document);
      if (shouldTriggerSuggest(event)) {
        setTimeout(() => {
          void vscode5.commands.executeCommand("editor.action.triggerSuggest");
        }, 0);
      }
    }),
    vscode5.workspace.onDidCloseTextDocument((document) => {
      const key = document.uri.toString();
      const existing = pending.get(key);
      if (existing) {
        clearTimeout(existing);
        pending.delete(key);
      }
      cache.delete(document.uri);
      diagnostics.delete(document.uri);
    }),
    vscode5.commands.registerCommand("smallbasic.newFile", async (resource) => {
      await createNewFile(resource);
    }),
    vscode5.commands.registerCommand("smallbasic.run", async () => {
      await runActiveDocument(cache, diagnostics);
    })
  ];
  if (platform.runCSharp) {
    subscriptions.push(vscode5.commands.registerCommand("smallbasic.runCSharp", platform.runCSharp));
  }
  context.subscriptions.push(...subscriptions);
}
async function createNewFile(resource) {
  const folder = await resolveTargetFolder(resource);
  if (!folder) {
    const document2 = await vscode5.workspace.openTextDocument({
      language: "smallbasic",
      content: `' My first SmallBasic program
TextWindow.WriteLine("Hello World")
`
    });
    await vscode5.window.showTextDocument(document2, { preview: false });
    return;
  }
  const file = await nextAvailableFile(folder);
  await vscode5.workspace.fs.writeFile(
    file,
    new TextEncoder().encode(`' My first SmallBasic program
TextWindow.WriteLine("Hello World")
`)
  );
  const document = await vscode5.workspace.openTextDocument(file);
  await vscode5.window.showTextDocument(document, { preview: false });
}
async function resolveTargetFolder(resource) {
  if (resource) {
    try {
      const stat = await vscode5.workspace.fs.stat(resource);
      return stat.type === vscode5.FileType.Directory ? resource : vscode5.Uri.joinPath(resource, "..");
    } catch {
      return vscode5.Uri.joinPath(resource, "..");
    }
  }
  return vscode5.workspace.workspaceFolders?.[0]?.uri;
}
async function nextAvailableFile(folder) {
  for (let index = 1; index < 1e3; index += 1) {
    const candidate = vscode5.Uri.joinPath(folder, `Untitled-${index}.sb`);
    try {
      await vscode5.workspace.fs.stat(candidate);
    } catch {
      return candidate;
    }
  }
  return vscode5.Uri.joinPath(folder, `Untitled-${Date.now()}.sb`);
}
async function runActiveDocument(cache, diagnostics) {
  const editor = vscode5.window.activeTextEditor;
  if (!editor || !isSmallBasicDocument(editor.document)) {
    void vscode5.window.showWarningMessage("\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A SmallBasic (.sb) \u6587\u4EF6\u3002");
    return;
  }
  if (!editor.document.isUntitled) {
    const saved = await editor.document.save();
    if (!saved) {
      void vscode5.window.showWarningMessage("\u8FD0\u884C\u524D\u9700\u8981\u5148\u4FDD\u5B58\u5F53\u524D\u6587\u4EF6\u3002");
      return;
    }
  }
  publishDiagnostics(editor.document, cache, diagnostics);
  const compilation = cache.get(editor.document);
  if (!compilation.isReadyToRun) {
    void vscode5.window.showErrorMessage("\u5F53\u524D\u7A0B\u5E8F\u5B58\u5728\u7F16\u8BD1\u9519\u8BEF\uFF0C\u8BF7\u5148\u4FEE\u590D\u540E\u518D\u8FD0\u884C\u3002");
    return;
  }
  if (compilation.kind.drawsShapes()) {
    void vscode5.window.showErrorMessage("\u5F53\u524D JS \u540E\u7AEF\u5C1A\u4E0D\u652F\u6301 GraphicsWindow/Shapes/Turtle/Controls \u56FE\u5F62\u5BBF\u4E3B\u3002Windows \u684C\u9762\u7248\u8BF7\u4F7F\u7528 \u201CSmallBasic: Run with C# Backend\u201D\u3002");
    return;
  }
  const session = new SmallBasicTerminalSession();
  const terminal = vscode5.window.createTerminal({
    name: `SmallBasic: ${documentName(editor.document)}`,
    pty: session
  });
  terminal.show(true);
  session.run(compilation);
}
function documentName(document) {
  const segments = document.uri.path.split("/");
  return segments[segments.length - 1] || "program.sb";
}
function shouldTriggerSuggest(event) {
  if (!isSmallBasicDocument(event.document)) {
    return false;
  }
  const editor = vscode5.window.activeTextEditor;
  if (!editor || editor.document.uri.toString() !== event.document.uri.toString()) {
    return false;
  }
  if (event.contentChanges.length !== 1) {
    return false;
  }
  const [change] = event.contentChanges;
  if (change.rangeLength !== 0 || change.text.length === 0) {
    return false;
  }
  return /^\.?$|^[\r\n]+$|^[\p{L}\p{N}_]$/u.test(change.text);
}

// src/debug/factory.ts
var import_node_path2 = __toESM(require("path"));
var vscode7 = __toESM(require("vscode"));

// src/run/csharp-runner.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));
var vscode6 = __toESM(require("vscode"));
var CSharpRunner = class _CSharpRunner {
  static async runActiveDocument(extensionPath) {
    const editor = vscode6.window.activeTextEditor;
    if (!editor || editor.document.languageId !== "smallbasic") {
      void vscode6.window.showWarningMessage("\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A SmallBasic (.sb) \u6587\u4EF6\u3002");
      return;
    }
    await _CSharpRunner.runDocument(editor.document, extensionPath);
  }
  static async runDocument(document, extensionPath) {
    if (!document.isUntitled) {
      const saved = await document.save();
      if (!saved) {
        void vscode6.window.showWarningMessage("\u8FD0\u884C\u524D\u9700\u8981\u5148\u4FDD\u5B58\u5F53\u524D\u6587\u4EF6\u3002");
        return;
      }
    } else {
      void vscode6.window.showWarningMessage("\u8BF7\u5148\u4FDD\u5B58\u6587\u4EF6\u540E\u518D\u4F7F\u7528 C# \u540E\u7AEF\u8FD0\u884C\u3002");
      return;
    }
    await _CSharpRunner.runProgram(document.uri.fsPath, extensionPath);
  }
  static async runProgram(filePath, extensionPath) {
    const host = _CSharpRunner.resolveHostCommand(extensionPath);
    if (!host) {
      void vscode6.window.showErrorMessage(
        "\u672A\u627E\u5230\u53EF\u7528\u7684 SmallBasic C# \u8FD0\u884C\u5BBF\u4E3B\u3002\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u914D\u7F6E smallbasic.csharp.runHostPath\uFF0C\u6216\u5B89\u88C5 .NET 8 \u540E\u91CD\u65B0\u5B89\u88C5\u5B8C\u6574\u7684\u6269\u5C55\u5305\u3002"
      );
      return;
    }
    if (!_CSharpRunner.fileExists(filePath)) {
      void vscode6.window.showErrorMessage(`\u627E\u4E0D\u5230 SmallBasic \u7A0B\u5E8F\u6587\u4EF6\uFF1A${filePath}`);
      return;
    }
    const terminal = vscode6.window.createTerminal({
      name: `SmallBasic (C#): ${import_node_path.default.basename(filePath)}`,
      shellPath: host.executable,
      shellArgs: [...host.argumentsPrefix, "run", "--file", filePath, "--pause"],
      cwd: import_node_path.default.dirname(filePath)
    });
    terminal.show(true);
  }
  static resolveHostCommand(extensionPath) {
    const configPath = vscode6.workspace.getConfiguration("smallbasic").get("csharp.runHostPath");
    if (configPath && _CSharpRunner.fileExists(configPath)) {
      return _CSharpRunner.toHostCommand(configPath);
    }
    const roots = vscode6.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) ?? [];
    const repositoryCandidates = (root, framework, fileName) => [
      import_node_path.default.join(root, "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Release", framework, fileName),
      import_node_path.default.join(root, "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Debug", framework, fileName),
      import_node_path.default.join(root, "src", "SmallBasic.RunHost", "bin", "Release", framework, fileName),
      import_node_path.default.join(root, "src", "SmallBasic.RunHost", "bin", "Debug", framework, fileName),
      import_node_path.default.resolve(root, "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Release", framework, fileName),
      import_node_path.default.resolve(root, "..", "VisualStudioPlugin", "src", "SmallBasic.RunHost", "bin", "Debug", framework, fileName)
    ];
    const developmentRoot = import_node_path.default.resolve(extensionPath, "..", "..", "..");
    const searchRoots = [developmentRoot, ...roots];
    const windowsCandidates = [
      import_node_path.default.join(extensionPath, "RunHost", "windows", "SmallBasic.RunHost.exe"),
      import_node_path.default.join(extensionPath, "RunHost", "SmallBasic.RunHost.exe"),
      ...searchRoots.flatMap((root) => [
        ...repositoryCandidates(root, "net8.0-windows", "SmallBasic.RunHost.exe"),
        ...repositoryCandidates(root, "net48", "SmallBasic.RunHost.exe")
      ])
    ];
    const portableCandidates = [
      import_node_path.default.join(extensionPath, "RunHost", "portable", "SmallBasic.RunHost.dll"),
      ...searchRoots.flatMap((root) => repositoryCandidates(root, "net8.0", "SmallBasic.RunHost.dll"))
    ];
    const candidates = process.platform === "win32" ? [...windowsCandidates, ...portableCandidates] : portableCandidates;
    for (const candidate of candidates) {
      if (_CSharpRunner.fileExists(candidate)) {
        return _CSharpRunner.toHostCommand(candidate);
      }
    }
    return void 0;
  }
  static resolveHostPath(extensionPath) {
    return _CSharpRunner.resolveHostCommand(extensionPath)?.artifactPath;
  }
  static toHostCommand(artifactPath) {
    const resolved = import_node_path.default.resolve(artifactPath);
    if (import_node_path.default.extname(resolved).toLowerCase() === ".dll") {
      return {
        executable: "dotnet",
        argumentsPrefix: [resolved],
        cwd: import_node_path.default.dirname(resolved),
        artifactPath: resolved
      };
    }
    return {
      executable: resolved,
      argumentsPrefix: [],
      cwd: import_node_path.default.dirname(resolved),
      artifactPath: resolved
    };
  }
  static fileExists(filePath) {
    return import_node_fs.default.existsSync(filePath);
  }
};

// src/debug/factory.ts
var SmallBasicDebugAdapterFactory = class {
  constructor(context) {
    this.context = context;
  }
  context;
  createDebugAdapterDescriptor(session) {
    const backend = session.configuration.backend === "csharp" ? "csharp" : "javascript";
    if (backend === "csharp") {
      const host = CSharpRunner.resolveHostCommand(this.context.extensionPath);
      if (!host) {
        void vscode7.window.showErrorMessage(
          "\u672A\u627E\u5230\u53EF\u7528\u7684 SmallBasic C# \u8C03\u8BD5\u5BBF\u4E3B\u3002\u8BF7\u5B89\u88C5 .NET 8\u3001\u91CD\u65B0\u5B89\u88C5\u5B8C\u6574\u6269\u5C55\uFF0C\u6216\u5728 smallbasic.csharp.runHostPath \u4E2D\u6307\u5B9A\u5BBF\u4E3B\u8DEF\u5F84\u3002"
        );
        return void 0;
      }
      return new vscode7.DebugAdapterExecutable(host.executable, [...host.argumentsPrefix, "debug"], {
        cwd: host.cwd
      });
    }
    const adapterPath = import_node_path2.default.join(this.context.extensionPath, "dist", "debug", "adapter.js");
    return new vscode7.DebugAdapterExecutable(process.execPath, [adapterPath], {
      cwd: this.context.extensionPath,
      env: {
        ...process.env,
        SBPLUGIN_EXTENSION_ROOT: this.context.extensionPath
      }
    });
  }
};

// src/extension.ts
function activate(context) {
  activateCommon(context, {
    debugAdapterFactory: new SmallBasicDebugAdapterFactory(context),
    debugConfigurationProvider: createDebugConfigurationProvider(context.extensionPath),
    runCSharp: async () => CSharpRunner.runActiveDocument(context.extensionPath)
  });
}
function deactivate() {
}
function createDebugConfigurationProvider(extensionPath) {
  const baseConfig = (program, backend = "javascript") => ({
    type: "smallbasic",
    request: "launch",
    name: backend === "csharp" ? "SmallBasic: Debug current file with C# backend" : "SmallBasic: Launch current file (JS debugger)",
    program,
    backend,
    stopOnEntry: true
  });
  const activeSmallBasicPath = () => {
    const editor = vscode8.window.activeTextEditor;
    return editor && isSmallBasicDocument(editor.document) ? editor.document.uri.fsPath : void 0;
  };
  return {
    resolveDebugConfiguration(_folder, config) {
      if (config.type === "smallbasic" && typeof config.program === "string") {
        if (config.backend !== "csharp" && config.backend !== "javascript") {
          config.backend = "javascript";
        }
        return config;
      }
      const program = activeSmallBasicPath();
      return program ? baseConfig(program, "javascript") : void 0;
    },
    async resolveDebugConfigurationWithSubstitutedVariables(_folder, config) {
      if (config.type !== "smallbasic") {
        return config;
      }
      if (config.backend !== "csharp" && config.backend !== "javascript") {
        config.backend = "javascript";
      }
      let program = typeof config.program === "string" ? config.program.trim() : "";
      if (!program) {
        program = activeSmallBasicPath() ?? "";
      }
      if (!program) {
        void vscode8.window.showErrorMessage("\u8C03\u8BD5\u914D\u7F6E\u7F3A\u5C11\u6709\u6548\u7684 program \u8DEF\u5F84\u3002\u8BF7\u6253\u5F00\u4E00\u4E2A .sb \u6587\u4EF6\u540E\u518D\u542F\u52A8\u8C03\u8BD5\u3002");
        return void 0;
      }
      if (config.backend === "csharp") {
        if (config.noDebug === true) {
          await CSharpRunner.runProgram(program, extensionPath);
          return void 0;
        }
        if (!CSharpRunner.resolveHostCommand(extensionPath)) {
          void vscode8.window.showErrorMessage(
            "\u672A\u627E\u5230\u53EF\u7528\u7684 SmallBasic C# \u8FD0\u884C\u5BBF\u4E3B\u3002\u8BF7\u5B89\u88C5 .NET 8\u3001\u91CD\u65B0\u5B89\u88C5\u5B8C\u6574\u6269\u5C55\uFF0C\u6216\u5728 smallbasic.csharp.runHostPath \u4E2D\u6307\u5B9A\u5BBF\u4E3B\u8DEF\u5F84\u3002"
          );
          return void 0;
        }
      }
      config.program = program;
      return config;
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
