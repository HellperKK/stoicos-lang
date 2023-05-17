import VarManager from '../manager/VarManager';
import FunToken from '../tokens/FunToken';
import NumberToken from '../tokens/NumberToken';
import BoolToken from '../tokens/BoolToken';
import BaseToken from '../tokens/BaseToken';
import arrayInit from './arrayModule';
import stringInit from './stringModule';
import structInit from './structModule';
import typeInit from './typeModule';
import loopInit from './loopModule';
import mapInit from './mapModule';
// import serverInit from './serverModule';

const prelude = () => {
  const { stdOut } = VarManager;
  const vars = VarManager.get();

  // Imports
  vars.setVar(
    'import',
    FunToken.native((toks) => {
      const mod = toks[0].request('symbol');
      let val: BaseToken;
      switch (mod) {
        case 'Array':
          val = arrayInit();
          break;

        case 'String':
          val = stringInit();
          break;

        case 'Struct':
          val = structInit();
          break;

        case 'Map':
          val = mapInit();
          break;

        case 'Type':
          val = typeInit();
          break;

        case 'Loop':
          val = loopInit();
          break;

        /*
        case 'Server':
          val = serverInit();
          break;
          */

        default:
          throw new Error(`unknown module ${mod}`);
      }
      VarManager.get().setVar(mod, val, true);
      return VarManager.unit;
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

  vars.setVar(
    'cond',
    FunToken.native((toks) => {
      const conds = toks[0].request('array');

      // eslint-disable-next-line no-restricted-syntax
      for (const cond of conds) {
        const [trueCond, tok] = cond.request('array');
        if (trueCond.calculate().request('bool')) {
          return tok.calculate();
        }
      }
      return VarManager.unit;
    }),
    true
  );

  vars.setVar(
    'switch',
    FunToken.native((toks) => {
      const value = toks[0];
      const conds = toks[1].request('array');

      // eslint-disable-next-line no-restricted-syntax
      for (const cond of conds) {
        const [trueCond, tok] = cond.request('array');
        if (trueCond.calculate().compare(value) === 0) {
          return tok.calculate();
        }
      }
      return VarManager.unit;
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

  // Defining
  vars.setVar(
    'type',
    FunToken.native((toks) => {
      const name = toks[0].request('symbol');
      const type = toks[1].request('type');
      vars.typeVar(name, type);
      return VarManager.unit;
    }),
    true
  );
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
  vars.setVar(
    'bind',
    FunToken.native((toks) => {
      const names = toks[0].request('array');
      const values = toks[1].request('array');

      if (names.length !== values.length) {
        throw new Error('invalid parameter length in bind function');
      }

      names.forEach((name, index) => {
        vars.setVar(name.request('symbol'), values[index], false);
      });

      return VarManager.unit;
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
      return new BoolToken(bool && boolb);
    }),
    true
  );
  vars.setVar(
    '||',
    FunToken.native((toks) => {
      const bool = toks[0].request('bool');
      const boolb = toks[1].request('bool');
      return new BoolToken(bool || boolb);
    }),
    true
  );

  // Conversions
  vars.setVar(
    'parseInt',
    FunToken.native((toks) => {
      const val = toks[0].request('string');
      return new NumberToken(parseInt(val, 10));
    }),
    true
  );
  vars.setVar(
    'parseFloat',
    FunToken.native((toks) => {
      const val = toks[0].request('string');
      return new NumberToken(parseFloat(val));
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
};

export default prelude;
