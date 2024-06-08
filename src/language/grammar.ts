// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var openPar: any;
declare var closePar: any;
declare var comment: any;
declare var number: any;
declare var string: any;
declare var colon: any;
declare var dot: any;
declare var hash: any;
declare var dollar: any;
declare var openCur: any;
declare var closeCur: any;
declare var openSqu: any;
declare var closeSqu: any;
declare var ident: any;
declare var operator: any;
declare var ws: any;

import moo from "moo";
import VarToken from "./tokens/VarToken"
import StringToken from "./tokens/StringToken"
import SymbolToken from "./tokens/SymbolToken"
import ArrayModelToken from "./tokens/ArrayModelToken"
import BlockToken from "./tokens/BlockToken"
import CallToken from "./tokens/CallToken"
import NumberToken from "./tokens/NumberToken"
import AttrToken from "./tokens/AttrToken"
import FunToken from "./tokens/FunToken"
import PartialFunToken from "./tokens/PartialFunToken"

const ignore = arr => null 

const lexer = moo.compile({
  // comments
  comment: /;.*/,

  // symbols
  arobase: /@/,
  dollar: /\$/,
  hash: /#/,
  dot: /\./,
  colon: /:/,
  singleQuote: /'/,

  // group symbols
  openPar: /\(/,
  closePar: /\)/,
  openCur: /\{/,
  closeCur: /\}/,
  openSqu: /\[/,
  closeSqu: /\]/,

  // tokens
  number: { match:/-?\d+\.?\d*/, value: str => parseFloat(str) },
  string: { match:/"(?:[^"]|\\")*"/, value: str => str.slice(1, -1) },
  ident: /[A-Za-z_][A-Za-z0-9_]*/,
  operator: /[!%&*+./<=>?^|\-~]+/,

  // spaces
  ws: {match: /\s+/, lineBreaks: true}
});

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "main$ebnf$1", "symbols": ["phrase"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "phrase"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "main", "symbols": ["main$ebnf$1"], "postprocess": id},
    {"name": "phrase", "symbols": [(lexer.has("openPar") ? {type: "openPar"} : openPar), "_", "vallist", "_", (lexer.has("closePar") ? {type: "closePar"} : closePar), "_"], "postprocess": function(arr) { const list = arr[2].filter(x => x); return new CallToken(list.shift(), list) }},
    {"name": "phrase", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment), "_"], "postprocess": ignore},
    {"name": "vallist", "symbols": ["vallist", "__", "value"], "postprocess": function(arr) { return arr[0].concat([arr[2]]) }},
    {"name": "vallist", "symbols": ["value"], "postprocess": function(arr) { return [arr[0]] }},
    {"name": "value", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": arr => new NumberToken(arr[0].value)},
    {"name": "value", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": arr => new StringToken(arr[0].value)},
    {"name": "value", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon), "name"], "postprocess": arr => new SymbolToken(arr[1].value)},
    {"name": "value", "symbols": ["var"], "postprocess": id},
    {"name": "value", "symbols": ["curried"], "postprocess": id},
    {"name": "value", "symbols": ["block"], "postprocess": id},
    {"name": "value", "symbols": ["array"], "postprocess": id},
    {"name": "value", "symbols": ["phrase"], "postprocess": id},
    {"name": "var", "symbols": ["name"], "postprocess": arr => new VarToken(arr[0].value)},
    {"name": "var", "symbols": ["name", (lexer.has("dot") ? {type: "dot"} : dot), "attrlist"], "postprocess": arr => { return new AttrToken(arr[0].value, arr[2].map(attr => attr.value))}},
    {"name": "attrlist", "symbols": ["attrlist", (lexer.has("dot") ? {type: "dot"} : dot), "name"], "postprocess": function(arr) { return arr[0].concat([arr[2]]) }},
    {"name": "attrlist", "symbols": ["name"], "postprocess": function(arr) { return [arr[0]] }},
    {"name": "curried", "symbols": [(lexer.has("hash") ? {type: "hash"} : hash), "var"], "postprocess": function(arr) { return new PartialFunToken(arr[1]) }},
    {"name": "macro", "symbols": [(lexer.has("dollar") ? {type: "dollar"} : dollar), "value"], "postprocess": function(arr) { return { type: "macro", value: arr[1] } }},
    {"name": "block$ebnf$1", "symbols": ["vallist"], "postprocess": id},
    {"name": "block$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "block", "symbols": [(lexer.has("openCur") ? {type: "openCur"} : openCur), "_", "block$ebnf$1", "_", (lexer.has("closeCur") ? {type: "closeCur"} : closeCur)], "postprocess": arr => new BlockToken((arr[2] ?? []).filter(x => x))},
    {"name": "block", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon), "phrase"], "postprocess": arr => new BlockToken([arr[1]])},
    {"name": "array$ebnf$1", "symbols": ["vallist"], "postprocess": id},
    {"name": "array$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "array", "symbols": [(lexer.has("openSqu") ? {type: "openSqu"} : openSqu), "_", "array$ebnf$1", "_", (lexer.has("closeSqu") ? {type: "closeSqu"} : closeSqu)], "postprocess": arr => new ArrayModelToken((arr[2] ?? []).filter(x => x))},
    {"name": "name", "symbols": [(lexer.has("ident") ? {type: "ident"} : ident)], "postprocess": id},
    {"name": "name", "symbols": [(lexer.has("operator") ? {type: "operator"} : operator)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": ignore},
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": ignore}
  ],
  ParserStart: "main",
};

export default grammar;
