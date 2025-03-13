import BaseToken from "../tokens/BaseToken";
import FunToken from "../tokens/FunToken";
import NumberToken from "../tokens/NumberToken";
import StructToken from "../tokens/StructToken";

const mathInit = () => {
  const module = new Map<string, BaseToken>();

  module.set(
    'PI',
    new NumberToken(Math.PI)
  );
  module.set(
    'E',
    new NumberToken(Math.E)
  )
  module.set(
    'abs',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.abs(num));
    })
  );
  module.set(
    'floor',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.floor(num));
    })
  );
  module.set(
    'ceil',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.ceil(num));
    })
  );
  module.set(
    'round',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.round(num));
    })
  );
  module.set(
    'trunc',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.trunc(num));
    })
  );

  module.set(
    'min',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      const numb = toks[1].request('number');
      return new NumberToken(Math.min(num, numb));
    })
  );
  module.set(
    'max',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      const numb = toks[1].request('number');
      return new NumberToken(Math.max(num, numb));
    })
  );
  module.set(
    'clamp',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      const min = toks[1].request('number');
      const max = toks[2].request('number');
      return new NumberToken(Math.min(Math.max(num, min), max));
    })
  );
  module.set(
    'pow',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      const numb = toks[1].request('number');
      return new NumberToken(Math.pow(num, numb));
    })
  );
  module.set(
    'sqrt',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.sqrt(num));
    })
  );
  module.set(
    'exp',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.exp(num));
    })
  );
  module.set(
    'log',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.log(num));
    })
  );
  module.set(
    'log10',
    FunToken.native((toks) => {
      const num = toks[0].request('number');
      return new NumberToken(Math.log10(num));
    })
  );

  return new StructToken(module);
};

export default mathInit;