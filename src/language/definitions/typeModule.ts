import TypeToken from '../tokens/TypeToken';
import BaseToken from '../tokens/BaseToken';
import FunToken from '../tokens/FunToken';
import StructToken from '../tokens/StructToken';

import { typeType, makeUnionType } from '../utils/Types';

const typeInit = () => {
  const module = new Map<string, BaseToken>();

  // Main type
  module.set('type', new TypeToken(typeType));

  // Building functions
  module.set(
    'union',
    FunToken.native((toks) => {
      const types = toks[0].request('array').map((tks) => tks.request('type'));
      return new TypeToken(makeUnionType(types));
    })
  );

  // Assigning
  return new StructToken(module);
};

export default typeInit;
