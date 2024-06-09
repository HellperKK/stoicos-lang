import TypeToken from '../tokens/TypeToken';
import StringToken from '../tokens/StringToken';
import ArrayToken from '../tokens/ArrayToken';
import BaseToken from '../tokens/BaseToken';
import FunToken from '../tokens/FunToken';
import StructToken from '../tokens/StructToken';
import NumberToken from '../tokens/NumberToken';

import { stringType } from '../utils/Types';

const stringInit = () => {
  const module = new Map<string, BaseToken>();

  // Main type
  module.set('type', new TypeToken(stringType));

  // Building functions
  module.set(
    'make',
    FunToken.native((toks) => {
      const size = toks[0].request('number');
      const item = toks[1].request('string');
      return new StringToken(item.repeat(size));
    })
  );
  module.set(
    'make_fun',
    FunToken.native((toks) => {
      const size = toks[0].request('number');
      const fun = toks[1];
      const str = Array(size)
        .fill(null)
        .map((_item, index) =>
          fun.call([new NumberToken(index)]).request('string')
        )
        .join('');
      return new StringToken(str);
    })
  );

  // Extracting functions
  module.set(
    'get',
    FunToken.native((toks) => {
      const ind = toks[0].request('number');
      const str: string = toks[1].request('string');
      return new StringToken(str[ind]);
    })
  );
  module.set(
    'slice',
    FunToken.native((toks) => {
      const min = toks[0].request('number');
      const max = toks[1].request('number');
      const str: string = toks[2].request('string');
      return new StringToken(str.slice(min, max));
    })
  );
  module.set(
    'sub',
    FunToken.native((toks) => {
      const min = toks[0].request('number');
      const len = toks[1].request('number');
      const str: string = toks[2].request('string');
      return new StringToken(str.slice(min, min + len));
    })
  );

  // Other functions
  module.set(
    'split',
    FunToken.native((toks) => {
      const sep = toks[0].request('string');
      const str: string = toks[1].request('string');
      const strs = str.split(sep).map((_str) => new StringToken(_str));
      return new ArrayToken(strs);
    })
  );
  module.set(
    'concat',
    FunToken.native((toks) => {
      const str = toks[0].request('string');
      const strb = toks[1].request('string');
      return new StringToken(str + strb);
    })
  );
  module.set(
    'replace',
    FunToken.native((toks) => {
      const str = toks[0].request('string');
      const strb = toks[1].request('string');
      const strt = toks[2].request('string');
      return new StringToken(strt.replace(str, strb));
    })
  );
  module.set(
    'replace_all',
    FunToken.native((toks) => {
      const str = toks[0].request('string');
      const strb = toks[1].request('string');
      const strt = toks[2].request('string');
      return new StringToken(strt.replaceAll(str, strb));
    })
  );
  module.set(
    'format',
    FunToken.native((toks) => {
      const str: string = toks[0].request('string');
      const vals: Array<BaseToken> = toks[1].request('array');
      const res = str.replaceAll(/\{(\d+)\}/g, (_total, sub) =>
        vals[parseInt(sub, 10)].request('string')
      );
      return new StringToken(res);
    })
  );
  module.set(
    'length',
    FunToken.native((toks) => {
      const str = toks[0].request('string');
      return new NumberToken(str.length);
    })
  );
  module.set(
    'reverse',
    FunToken.native((toks) => {
      const str = toks[0].request('string');
      return new StringToken(str.split("").reverse().join(""));
    })
  );

  return new StructToken(module);
};

export default stringInit;
