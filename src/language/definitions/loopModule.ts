/* eslint-disable no-plusplus */
import BaseToken from '../tokens/BaseToken';
import FunToken from '../tokens/FunToken';
import StructToken from '../tokens/StructToken';
import VarManager from '../manager/VarManager';
import NumberToken from '../tokens/NumberToken';

const loopInit = () => {
  const module = new Map<string, BaseToken>();

  // Functions
  module.set(
    'while',
    FunToken.native((toks) => {
      const condition = toks[0];
      const body = toks[1];
      while (condition.calculate().request('bool')) {
        body.calculate();
      }
      return VarManager.unit;
    })
  );
  module.set(
    'upto',
    FunToken.native((toks) => {
      const min = toks[0].request('number');
      const max = toks[1].request('number');
      const f = toks[2].request('fun');
      for (let index = min; index < max; index++) {
        f([new NumberToken(index)]);
      }
      return VarManager.unit;
    })
  );
  module.set(
    'downto',
    FunToken.native((toks) => {
      const max = toks[0].request('number');
      const min = toks[1].request('number');
      const f = toks[2].request('fun');
      for (let index = 0; index < max - min; index++) {
        f([new NumberToken(max - index)]);
      }
      return VarManager.unit;
    })
  );
  module.set(
    'times',
    FunToken.native((toks) => {
      const times = toks[0].request('number');
      const f = toks[1].request('fun');
      for (let index = 0; index < times; index++) {
        f([new NumberToken(index)]);
      }
      return VarManager.unit;
    })
  );

  return new StructToken(module);
};

export default loopInit;
