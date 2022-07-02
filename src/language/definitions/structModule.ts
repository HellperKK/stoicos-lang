import TypeToken from '../tokens/TypeToken';
import VarManager from '../manager/VarManager';
import ArrayToken from '../tokens/ArrayToken';
import BaseToken from '../tokens/BaseToken';
import FunToken from '../tokens/FunToken';
import StructToken from '../tokens/StructToken';
import SymbolToken from '../tokens/SymbolToken';

import { structType } from '../utils/Types';
import BoolToken from '../tokens/BoolToken';

const structInit = () => {
  const module = new Map<string, BaseToken>();

  // Main type
  module.set('type', new TypeToken(structType));

  // Building functions
  module.set(
    'make',
    FunToken.native((toks) => {
      const pairs = toks[0].request('array');
      const map = new Map<string, BaseToken>();
      pairs.forEach((pair: BaseToken) => {
        const sanePair = pair.request('array');
        map.set(sanePair[0].request('symbol'), sanePair[1]);
      });
      return new StructToken(map);
    })
  );

  module.set(
    'build',
    FunToken.native((toks) => {
      const keys = toks[0].request('array').map((tok) => tok.request('symbol'));
      const structModule = new Map<string, BaseToken>();

      structModule.set(
        'make',
        FunToken.native((tokens) => {
          const newStruct = new Map<string, BaseToken>();

          keys.forEach((key, index) => newStruct.set(key, tokens[index]));

          return new StructToken(newStruct);
        })
      );

      structModule.set(
        'is',
        FunToken.native((tokens) => {
          const struct = tokens[0].request('struct');

          const isValid = keys.every((key) => struct.has(key));

          return new BoolToken(isValid);
        })
      );

      return new StructToken(structModule);
    })
  );

  // Getters functions
  module.set(
    'keys',
    FunToken.native((toks) => {
      const struct = toks[0].request('struct');

      return new ArrayToken(
        Array.from(struct.keys()).map((key: string) => new SymbolToken(key))
      );
    })
  );

  module.set(
    'values',
    FunToken.native((toks) => {
      const struct = toks[0].request('struct');

      return new ArrayToken(Array.from(struct.values()));
    })
  );

  module.set(
    'entries',
    FunToken.native((toks) => {
      const struct = toks[0].request('struct');

      return new ArrayToken(
        Array.from(struct.entries()).map(
          (pair) => new ArrayToken([new SymbolToken(pair[0]), pair[1]])
        )
      );
    })
  );

  module.set(
    'get',
    FunToken.native((toks) => {
      const key = toks[0].request('symbol');
      const struct = toks[1].request('struct');
      const val = struct.get(key);

      if (val === undefined) {
        throw new Error(`Key ${key} not found`);
      }

      return val;
    })
  );

  module.set(
    'set',
    FunToken.native((toks) => {
      const key = toks[0].request('symbol');
      const value = toks[1];
      const struct = toks[2].request('struct');

      const newSruct: Map<string, BaseToken> = new Map(struct.entries());
      newSruct.set(key, value);

      return new StructToken(newSruct);
    })
  );

  module.set(
    'set_fun',
    FunToken.native((toks) => {
      const key = toks[0].request('symbol');
      const value = toks[1];
      const struct = toks[2].request('struct');

      const newSruct: Map<string, BaseToken> = new Map(struct.entries());
      newSruct.set(key, value.call([struct.get(key) ?? VarManager.unit]));

      return new StructToken(newSruct);
    })
  );

  return new StructToken(module);
};

export default structInit;
