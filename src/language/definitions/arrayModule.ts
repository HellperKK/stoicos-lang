import TypeToken from '../tokens/TypeToken';
import ArrayToken from '../tokens/ArrayToken';
import BaseToken from '../tokens/BaseToken';
import FunToken from '../tokens/FunToken';
import StructToken from '../tokens/StructToken';
import NumberToken from '../tokens/NumberToken';
import BoolToken from '../tokens/BoolToken';
import StringToken from '../tokens/StringToken';

import { arrayType, makeArrayType } from '../utils/Types';
import VarManager from '../manager/VarManager';

const arrayInit = () => {
  const module = new Map<string, BaseToken>();

  // Main type
  module.set('type', new TypeToken(arrayType));
  module.set(
    'of',
    FunToken.native((toks) => {
      const typeParam = toks[0].request('type');
      return new TypeToken(makeArrayType(typeParam));
    })
  );

  // Building functions
  module.set(
    'make',
    FunToken.native((toks) => {
      const size = toks[0].request('number');
      const item = toks[1];
      return new ArrayToken(Array(size).fill(item));
    })
  );
  module.set(
    'make_fun',
    FunToken.native((toks) => {
      const size = toks[0].request('number');
      const fun = toks[1];
      return new ArrayToken(
        Array(size)
          .fill(null)
          .map((_item, index) => fun.call([new NumberToken(index)]))
      );
    })
  );
  module.set(
    'make_range',
    FunToken.native((toks) => {
      const min = toks[0].request('number');
      const max = toks[1].request('number');
      const range = max - min;
      return new ArrayToken(
        Array(range)
          .fill(null)
          .map((_item, index) => new NumberToken(index + min))
      );
    })
  );
  module.set(
    'singleton',
    FunToken.native((toks) => {
      const item = toks[0];
      return new ArrayToken([item]);
    })
  );

  // Update functions
  module.set(
    'update',
    FunToken.native((toks) => {
      const index = toks[0].request('number');
      const item = toks[1];
      const arr = toks[2].request('array');
      const newArr = arr.slice();
      newArr[index] = item;
      return new ArrayToken(newArr);
    })
  );
  module.set(
    'update_fun',
    FunToken.native((toks) => {
      const index = toks[0].request('number');
      const item = toks[1];
      const arr = toks[2].request('array');
      const newArr = arr.slice();
      newArr[index] = item.call([newArr[index]]);
      return new ArrayToken(newArr);
    })
  );

  // Add or remove functions
  module.set(
    'push',
    FunToken.native((toks) => {
      const item = toks[0];
      const arr = toks[1].request('array');
      const newArr = arr.slice();
      newArr.push(item);
      return new ArrayToken(newArr);
    })
  );
  module.set(
    'pop',
    FunToken.native((toks) => {
      const arr = toks[0].request('array');
      const newArr = arr.slice();
      newArr.pop();
      return new ArrayToken(newArr);
    })
  );
  module.set(
    'unshift',
    FunToken.native((toks) => {
      const item = toks[0];
      const arr = toks[1].request('array');
      const newArr = arr.slice();
      newArr.unshift(item);
      return new ArrayToken(newArr);
    })
  );
  module.set(
    'shift',
    FunToken.native((toks) => {
      const arr = toks[0].request('array');
      const newArr = arr.slice();
      newArr.shift();
      return new ArrayToken(newArr);
    })
  );
  module.set(
    'splice',
    FunToken.native((toks) => {
      const index = toks[0].request('number');
      const count = toks[1].request('number');
      const replacement = toks[2].request('array');
      const arr = toks[3].request('array');
      const newArr = arr.slice();
      newArr.splice(index, count, ...replacement);
      return new ArrayToken(newArr);
    })
  );

  // Idiom functions
  module.set(
    'foldl',
    FunToken.native((toks) => {
      const fun = toks[0];
      const base = toks[1];
      const arr = toks[2].request('array');
      return arr.reduce(
        (acc: BaseToken, tok: BaseToken) => fun.call([acc, tok]),
        base
      );
    })
  );
  module.set(
    'foldr',
    FunToken.native((toks) => {
      const fun = toks[0];
      const base = toks[1];
      const arr = toks[2].request('array');
      return arr.reverse().reduce((acc, tok) => fun.call([acc, tok]), base);
    })
  );
  module.set(
    'map',
    FunToken.native((toks) => {
      const fun = toks[0];
      const arr = toks[1].request('array');
      return new ArrayToken(arr.map((tok) => fun.call([tok])));
    })
  );
  module.set(
    'filter',
    FunToken.native((toks) => {
      const fun = toks[0];
      const arr = toks[1].request('array');
      return new ArrayToken(
        arr.filter((tok) => fun.call([tok]).request('bool'))
      );
    })
  );
  module.set(
    'for_each',
    FunToken.native((toks) => {
      const fun = toks[0];
      const arr = toks[1].request('array');
      arr.forEach((tok) => fun.call([tok]));
      return VarManager.unit;
    })
  );

  // Check functions
  module.set(
    'include',
    FunToken.native((toks) => {
      const val = toks[0];
      const arr: Array<BaseToken> = toks[1].request('array');
      return new BoolToken(arr.some((tok) => tok.compare(val) === 0));
    })
  );
  module.set(
    'any',
    FunToken.native((toks) => {
      const fun = toks[0];
      const arr: Array<BaseToken> = toks[1].request('array');
      return new BoolToken(arr.some((tok) => fun.call([tok]).request('bool')));
    })
  );
  module.set(
    'all',
    FunToken.native((toks) => {
      const fun = toks[0];
      const arr: Array<BaseToken> = toks[1].request('array');
      return new BoolToken(arr.every((tok) => fun.call([tok]).request('bool')));
    })
  );

  // Extracting functions
  module.set(
    'get',
    FunToken.native((toks) => {
      const ind = toks[0].request('number');
      const arr: Array<BaseToken> = toks[1].request('array');
      return arr[ind];
    })
  );
  module.set(
    'slice',
    FunToken.native((toks) => {
      const min = toks[0].request('number');
      const max = toks[1].request('number');
      const arr: Array<BaseToken> = toks[2].request('array');
      return new ArrayToken(arr.slice(min, max));
    })
  );
  module.set(
    'sub',
    FunToken.native((toks) => {
      const min = toks[0].request('number');
      const len = toks[1].request('number');
      const arr: Array<BaseToken> = toks[2].request('array');
      return new ArrayToken(arr.slice(min, min + len));
    })
  );

  // Other functions
  module.set(
    'join',
    FunToken.native((toks) => {
      const sep = toks[0].request('string');
      const arr: Array<BaseToken> = toks[2].request('array');
      const str = arr.map((tok) => tok.request('string')).join(sep);
      return new StringToken(str);
    })
  );
  module.set(
    'concat',
    FunToken.native((toks) => {
      const arr = toks[0].request('array');
      const arrb = toks[1].request('array');
      return new ArrayToken(arr.concat(arrb));
    })
  );
  module.set(
    'length',
    FunToken.native((toks) => {
      const arr = toks[0].request('array');
      return new NumberToken(arr.length);
    })
  );

  // Assigning
  // vars.setVar("Array", new StructToken(module), true)
  return new StructToken(module);
};

export default arrayInit;
