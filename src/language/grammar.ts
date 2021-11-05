/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
import moo from 'moo';
import VarToken from './tokens/VarToken';
import StringToken from './tokens/StringToken';
import SymbolToken from './tokens/SymbolToken';
import ArrayModelToken from './tokens/ArrayModelToken';
import BlockToken from './tokens/BlockToken';
import CallToken from './tokens/CallToken';
import NumberToken from './tokens/NumberToken';
import AttrToken from './tokens/AttrToken';

function id(d: any[]): any {
  return d[0];
}
declare let openPar: any;
declare let closePar: any;
declare let comment: any;
declare let number: any;
declare let string: any;
declare let colon: any;
declare let dot: any;
declare let arobase: any;
declare let dollar: any;
declare let openCur: any;
declare let closeCur: any;
declare let openSqu: any;
declare let closeSqu: any;
declare let ident: any;
declare let operator: any;
declare let ws: any;

const ignore = (_arr: any) => null;

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
  number: { match: /\d+\.?\d*/, value: (str: string) => parseFloat(str) },
  string: {
    match: /"(?:[^"]|\\")*"/,
    value: (str: string | any[]) => str.slice(1, -1),
  },
  ident: /[A-Za-z_][A-Za-z0-9_]*/,
  operator: /[!%&*+./<=>?^|\-~]+/,

  // spaces
  ws: { match: /\s+/, lineBreaks: true },
});

interface NearleyToken {
  value: any;
  [key: string]: any;
}

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
}

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
}

type NearleySymbol =
  | string
  | { literal: any }
  | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
}

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    { name: 'main$ebnf$1', symbols: ['phrase'] },
    {
      name: 'main$ebnf$1',
      symbols: ['main$ebnf$1', 'phrase'],
      postprocess: (d) => d[0].concat([d[1]]),
    },
    { name: 'main', symbols: ['main$ebnf$1'], postprocess: id },
    {
      name: 'phrase',
      symbols: [
        lexer.has('openPar') ? { type: 'openPar' } : openPar,
        '_',
        'vallist',
        '_',
        lexer.has('closePar') ? { type: 'closePar' } : closePar,
        '_',
      ],
      postprocess(arr) {
        const list = arr[2].filter((x: any) => x);
        return new CallToken(list[0], list.slice(1));
      },
    },
    {
      name: 'phrase',
      symbols: [lexer.has('comment') ? { type: 'comment' } : comment, '_'],
      postprocess: ignore,
    },
    {
      name: 'vallist',
      symbols: ['vallist', '__', 'value'],
      postprocess(arr) {
        return arr[0].concat([arr[2]]);
      },
    },
    {
      name: 'vallist',
      symbols: ['value'],
      postprocess(arr) {
        return [arr[0]];
      },
    },
    {
      name: 'value',
      symbols: [lexer.has('number') ? { type: 'number' } : number],
      postprocess: (arr) => new NumberToken(arr[0].value),
    },
    {
      name: 'value',
      symbols: [lexer.has('string') ? { type: 'string' } : string],
      postprocess: (arr) => new StringToken(arr[0].value),
    },
    {
      name: 'value',
      symbols: [lexer.has('colon') ? { type: 'colon' } : colon, 'name'],
      postprocess: (arr) => new SymbolToken(arr[1].value),
    },
    { name: 'value', symbols: ['var'], postprocess: id },
    { name: 'value', symbols: ['block'], postprocess: id },
    { name: 'value', symbols: ['array'], postprocess: id },
    { name: 'value', symbols: ['phrase'], postprocess: id },
    {
      name: 'var',
      symbols: ['name'],
      postprocess: (arr) => new VarToken(arr[0].value),
    },
    {
      name: 'var',
      symbols: ['value', lexer.has('dot') ? { type: 'dot' } : dot, 'attrlist'],
      postprocess: (arr) =>
        new AttrToken(
          arr[0].value,
          arr[2].map((attr: { value: any }) => attr.value)
        ),
    },
    {
      name: 'attrlist',
      symbols: ['attrlist', lexer.has('dot') ? { type: 'dot' } : dot, 'name'],
      postprocess(arr) {
        return arr[0].concat([arr[2]]);
      },
    },
    {
      name: 'attrlist',
      symbols: ['name'],
      postprocess(arr) {
        return [arr[0]];
      },
    },
    {
      name: 'curried',
      symbols: [lexer.has('arobase') ? { type: 'arobase' } : arobase, 'value'],
      postprocess(arr) {
        return { type: 'curried', value: arr[1] };
      },
    },
    {
      name: 'macro',
      symbols: [lexer.has('dollar') ? { type: 'dollar' } : dollar, 'value'],
      postprocess(arr) {
        return { type: 'macro', value: arr[1] };
      },
    },
    { name: 'block$ebnf$1', symbols: ['vallist'], postprocess: id },
    { name: 'block$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'block',
      symbols: [
        lexer.has('openCur') ? { type: 'openCur' } : openCur,
        '_',
        'block$ebnf$1',
        '_',
        lexer.has('closeCur') ? { type: 'closeCur' } : closeCur,
      ],
      postprocess: (arr) =>
        new BlockToken((arr[2] ?? []).filter((x: any) => x)),
    },
    {
      name: 'block',
      symbols: [lexer.has('colon') ? { type: 'colon' } : colon, 'phrase'],
      postprocess: (arr) => new BlockToken([arr[1]]),
    },
    { name: 'array$ebnf$1', symbols: ['vallist'], postprocess: id },
    { name: 'array$ebnf$1', symbols: [], postprocess: () => null },
    {
      name: 'array',
      symbols: [
        lexer.has('openSqu') ? { type: 'openSqu' } : openSqu,
        '_',
        'array$ebnf$1',
        '_',
        lexer.has('closeSqu') ? { type: 'closeSqu' } : closeSqu,
      ],
      postprocess: (arr) =>
        new ArrayModelToken((arr[2] ?? []).filter((x: any) => x)),
    },
    {
      name: 'name',
      symbols: [lexer.has('ident') ? { type: 'ident' } : ident],
      postprocess: id,
    },
    {
      name: 'name',
      symbols: [lexer.has('operator') ? { type: 'operator' } : operator],
      postprocess: id,
    },
    {
      name: '_$ebnf$1',
      symbols: [lexer.has('ws') ? { type: 'ws' } : ws],
      postprocess: id,
    },
    { name: '_$ebnf$1', symbols: [], postprocess: () => null },
    { name: '_', symbols: ['_$ebnf$1'], postprocess: ignore },
    {
      name: '__',
      symbols: [lexer.has('ws') ? { type: 'ws' } : ws],
      postprocess: ignore,
    },
  ],
  ParserStart: 'main',
};

export default grammar;
