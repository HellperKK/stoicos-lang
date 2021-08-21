@{%
import moo from "moo";
import VarToken from "./tokens/VarToken"
import StringToken from "./tokens/StringToken"
import SymbolToken from "./tokens/SymbolToken"
import ArrayModelToken from "./tokens/ArrayModelToken"
import BlockToken from "./tokens/BlockToken"
import CallToken from "./tokens/CallToken"
import NumberToken from "./tokens/NumberToken"
import AttrToken from "./tokens/AttrToken"

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
  number: { match:/\d+\.?\d*/, value: str => parseFloat(str) },
  string: { match:/"(?:[^"]|\\")*"/, value: str => str.slice(1, -1) },
  ident: /[A-Za-z_][A-Za-z0-9_]*/,
  operator: /[!%&*+./<=>?^|\-~:]+/,

  // spaces
  ws: {match: /\s+/, lineBreaks: true}
});
%}

@lexer lexer

@preprocessor typescript

main -> phrase:+ {% id %}

phrase -> %openPar _ vallist _ %closePar _ {% function(arr) { const list = arr[2].filter(x => x); return new CallToken(list[0], list.slice(1)) } %}
        | %comment _ {% ignore %}

vallist -> vallist __ value {% function(arr) { return arr[0].concat([arr[2]]) } %}
        | value {% function(arr) { return [arr[0]] } %}

value -> %number {% arr => new NumberToken(arr[0].value) %}
        | %string {% arr => new StringToken(arr[0].value) %}
        | %colon name {% arr => new SymbolToken(arr[1].value) %}
        | var {% id %}
        #| curried {% id %}
        #| macro {% id %}
        | block {% id %}
        | array {% id %}
        | phrase {% id %}

var -> name {% arr => new VarToken(arr[0].value) %}
        | value %dot attrlist {% arr => new AttrToken(arr[0].value, arr[2].map(attr => attr.value)) %}
        #| %arobase name {% function(arr) { return { type: "dynvar", name: arr[1] } } %}

attrlist -> attrlist %dot name {% function(arr) { return arr[0].concat([arr[2]]) } %}
        | name {% function(arr) { return [arr[0]] } %}

curried -> %arobase value {% function(arr) { return { type: "curried", value: arr[1] } } %}

macro -> %dollar value {% function(arr) { return { type: "macro", value: arr[1] } } %}

block -> %openCur _ vallist _ %closeCur {% arr => new BlockToken(arr[2].filter(x => x)) %}
        | %colon phrase {% arr => new BlockToken([arr[1]]) %}

array -> %openSqu _ vallist _ %closeSqu {% arr => new ArrayModelToken(arr[2].filter(x => x)) %}

name -> %ident {% id %}
        | %operator {% id %}

_ -> %ws:? {% ignore %}

__ -> %ws {% ignore %}