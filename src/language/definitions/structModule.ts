/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import ArrayToken from '../tokens/ArrayToken';
import BaseToken from '../tokens/BaseToken';
import FunToken from '../tokens/FunToken';
import StructToken from '../tokens/StructToken';
import SymbolToken from '../tokens/SymbolToken';

const structInit = () => {
  const module = new Map<string, BaseToken>();

  // Building functions
  /* module.set("make", FunToken.native(toks => {
        const vars = VarManager.get()
        let block = toks[0]
        vars.addStack()
        block = block.update()
        block.calculate()
        const stack = vars.getStack()
        vars.delStack()
        const struct = new Map(Array.from(stack.entries()).map(pair => [pair[0], pair[1].getVal()]))
        return new StructToken(struct)
    })) */
  module.set(
    'make',
    FunToken.native((toks) => {
      const pairs = toks[0].request('array');
      const sanePairs = pairs.map((pair: any) => {
        const sanePair = pair.request('array');
        return [sanePair[0].request('symbol'), sanePair[1]];
      });
      console.log(sanePairs);
      return new StructToken(new Map(sanePairs));
    })
  );

  // Getters functions
  module.set(
    'keys',
    FunToken.native((toks) => {
      const struct = toks[0].request('struct');

      return new ArrayToken(
        struct.keys().map((key: string) => new SymbolToken(key))
      );
    })
  );

  module.set(
    'values',
    FunToken.native((toks) => {
      const struct = toks[0].request('struct');

      return new ArrayToken(struct.values());
    })
  );

  module.set(
    'entries',
    FunToken.native((toks) => {
      const struct = toks[0].request('struct');

      return new ArrayToken(
        Array.from(
          struct
            .entries()
            .map((pair: any) => [new SymbolToken(pair[0]), pair[1]])
        )
      );
    })
  );

  module.set(
    'get',
    FunToken.native((toks) => {
      const key = toks[0].request('symbol');
      const struct = toks[1].request('struct');

      return struct.get(key);
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
      newSruct.set(key, value.call([struct.get(key)]));

      return new StructToken(newSruct);
    })
  );

  return new StructToken(module);
};

export default structInit;
