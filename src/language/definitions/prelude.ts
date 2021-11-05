import VarManager from '../manager/VarManager';
import FunToken from '../tokens/FunToken';
import NumberToken from '../tokens/NumberToken';
import BoolToken from '../tokens/BoolToken';
import arrayInit from './arrayModule';
import stringInit from './stringModule';
import structInit from './structModule';

const prelude = () => {
  const stdOut = { content: '' };
  const vars = VarManager.get();

  // Imports
  vars.setVar(
    'import',
    FunToken.native((toks) => {
      const mod = toks[0].request('symbol');
      switch (mod) {
        case 'Array':
          return arrayInit();

        case 'String':
          return stringInit();

        case 'Struct':
          return structInit();

        default:
          throw new Error(`unknown module ${mod}`);
      }
    }),
    true
  );

  // Constants
  vars.setVar('unit', VarManager.unit, false);
  vars.setVar('true', new BoolToken(true), false);
  vars.setVar('false', new BoolToken(false), false);

  // Conditionnals
  vars.setVar(
    'if',
    FunToken.native((toks) => {
      const cond = toks[0].request('bool');
      const block = toks[1];
      const other = toks[2];
      return cond ? block.calculate() : other.calculate();
    }),
    true
  );

  // Constructors
  vars.setVar(
    'fun',
    FunToken.native((toks) => {
      const args = toks[0].request('array');
      const block = toks[1];
      return FunToken.custom(args, block);
    }),
    true
  );

  // IO
  vars.setVar(
    'println',
    FunToken.native((toks) => {
      stdOut.content += `${toks[0].request('string')}\n`;
      return VarManager.unit;
    }),
    true
  );
  vars.setVar(
    'print',
    FunToken.native((toks) => {
      stdOut.content += toks[0].request('string');
      return VarManager.unit;
    }),
    true
  );
  vars.setVar(
    'debug',
    FunToken.native((toks) => {
      stdOut.content += `${JSON.stringify(toks[0])}\n`;
      // eslint-disable-next-line no-console
      console.log(toks[0]);
      return VarManager.unit;
    }),
    true
  );
  /* vars.setVar("stack", FunToken.native(toks => {
        console.log(VarManager.get().getStack())
        return VarManager.unit
    }), true) */

  // Defining
  vars.setVar(
    'def',
    FunToken.native((toks) => {
      const name = toks[0].request('symbol');
      const value = toks[1];
      vars.setVar(name, value, false);
      return value;
    }),
    true
  );
  vars.setVar(
    'deffun',
    FunToken.native((toks) => {
      const name = toks[0].request('symbol');
      const args = toks[1].request('array');
      const block = toks[2];
      const fn = FunToken.custom(args, block);
      vars.setVar(name, fn, false);
      return fn;
    }),
    true
  );

  // Numerics
  vars.setVar(
    '+',
    FunToken.native((toks) => {
      const x = toks[0].request('number');
      const y = toks[1].request('number');
      return new NumberToken(x + y);
    }),
    true
  );
  vars.setVar(
    '-',
    FunToken.native((toks) => {
      const x = toks[0].request('number');
      const y = toks[1].request('number');
      return new NumberToken(x - y);
    }),
    true
  );
  vars.setVar(
    '*',
    FunToken.native((toks) => {
      const x = toks[0].request('number');
      const y = toks[1].request('number');
      return new NumberToken(x * y);
    }),
    true
  );
  vars.setVar(
    '/',
    FunToken.native((toks) => {
      const x = toks[0].request('number');
      const y = toks[1].request('number');
      return new NumberToken(x / y);
    }),
    true
  );
  vars.setVar(
    '// ',
    FunToken.native((toks) => {
      const x = toks[0].request('number');
      const y = toks[1].request('number');
      return new NumberToken(Math.floor(x / y));
    }),
    true
  );
  vars.setVar(
    '**',
    FunToken.native((toks) => {
      const x = toks[0].request('number');
      const y = toks[1].request('number');
      return new NumberToken(x ** y);
    }),
    true
  );
  vars.setVar(
    '%',
    FunToken.native((toks) => {
      const x = toks[0].request('number');
      const y = toks[1].request('number');
      return new NumberToken(x % y);
    }),
    true
  );

  // Comparisons
  vars.setVar(
    '==',
    FunToken.native((toks) => {
      const tok = toks[0];
      const other = toks[1];
      return new BoolToken(tok.compare(other) === 0);
    }),
    true
  );
  vars.setVar(
    '!=',
    FunToken.native((toks) => {
      const tok = toks[0];
      const other = toks[1];
      return new BoolToken(tok.compare(other) !== 0);
    }),
    true
  );
  vars.setVar(
    '<',
    FunToken.native((toks) => {
      const tok = toks[0];
      const other = toks[1];
      return new BoolToken(tok.compare(other) === -1);
    }),
    true
  );
  vars.setVar(
    '>',
    FunToken.native((toks) => {
      const tok = toks[0];
      const other = toks[1];
      return new BoolToken(tok.compare(other) === 1);
    }),
    true
  );
  vars.setVar(
    '<=',
    FunToken.native((toks) => {
      const tok = toks[0];
      const other = toks[1];
      return new BoolToken(tok.compare(other) !== 1);
    }),
    true
  );
  vars.setVar(
    '>=',
    FunToken.native((toks) => {
      const tok = toks[0];
      const other = toks[1];
      return new BoolToken(tok.compare(other) !== -1);
    }),
    true
  );

  // Logical operation
  vars.setVar(
    '&&',
    FunToken.native((toks) => {
      const bool = toks[0].request('bool');
      const boolb = toks[1].request('bool');
      return new NumberToken(bool && boolb);
    }),
    true
  );
  vars.setVar(
    '||',
    FunToken.native((toks) => {
      const bool = toks[0].request('bool');
      const boolb = toks[1].request('bool');
      return new NumberToken(bool || boolb);
    }),
    true
  );

  // Miscs
  vars.setVar(
    'eval',
    FunToken.native((toks) => {
      const block = toks[0];
      return block.calculate();
    }),
    true
  );

  return stdOut;
};

export default prelude;
