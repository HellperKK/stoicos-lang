// import { HashMap } from "@nebtex/hashmaps";
import VarManager from "../manager/VarManager";
import ArrayToken from "../tokens/ArrayToken";
import BaseToken from "../tokens/BaseToken";
import FunToken from "../tokens/FunToken";
import StructToken from "../tokens/StructToken";
import MapToken from "../tokens/MapToken";
import { HashMapTemp } from "../utils/HashMapTemp";

const mapInit = () => {
  const module = new Map<string, BaseToken>();

  // Constants
  module.set("empty", new MapToken(new HashMapTemp<BaseToken, BaseToken>()));

  // Building functions
  module.set(
    "make",
    FunToken.native((toks) => {
      const pairs = toks[0].request("array");
      const map = new HashMapTemp<BaseToken, BaseToken>();
      pairs.forEach((pair: BaseToken) => {
        const sanePair = pair.request("array");
        map.set(sanePair[0], sanePair[1]);
      });
      return new MapToken(map);
    })
  );

  // Getters functions
  module.set(
    "keys",
    FunToken.native((toks) => {
      const struct = toks[0].request("map");

      return new ArrayToken(Array.from(struct.keys()));
    })
  );

  module.set(
    "values",
    FunToken.native((toks) => {
      const struct = toks[0].request("map");

      return new ArrayToken(Array.from(struct.values()));
    })
  );

  module.set(
    "entries",
    FunToken.native((toks) => {
      const struct = toks[0].request("map");

      return new ArrayToken(
        Array.from(struct.entries()).map((pair) => new ArrayToken(pair))
      );
    })
  );

  module.set(
    "get",
    FunToken.native((toks) => {
      const key = toks[0];
      const struct = toks[1].request("map");
      const val = struct.get(key);

      if (val === undefined) {
        throw new Error(`Key ${key.value} not found`);
      }

      return val;
    })
  );

  module.set(
    "get_or",
    FunToken.native((toks) => {
      const key = toks[0];
      const defaultValue = toks[1];
      const struct = toks[2].request("map");
      const val = struct.get(key);

      if (val === undefined) {
        return defaultValue;
      }

      return val;
    })
  );

  module.set(
    "get_or_fun",
    FunToken.native((toks) => {
      const key = toks[0];
      const defaultValue = toks[1];
      const struct = toks[2].request("map");
      const val = struct.get(key);

      if (val === undefined) {
        return defaultValue.call([]);
      }

      return val;
    })
  );

  module.set(
    "set",
    FunToken.native((toks) => {
      const key = toks[0];
      const value = toks[1];
      const struct = toks[2].request("map");

      const newMap: HashMapTemp<BaseToken, BaseToken> = new HashMapTemp();
      Array.from(struct.entries()).forEach((pair) => {
        newMap.set(pair[0], pair[1]);
      });
      newMap.set(key, value);

      return new MapToken(newMap);
    })
  );

  module.set(
    "set_fun",
    FunToken.native((toks) => {
      const key = toks[0];
      const value = toks[1];
      const struct = toks[2].request("map");

      const newMap: HashMapTemp<BaseToken, BaseToken> = new HashMapTemp();
      Array.from(struct.entries()).forEach((pair) => {
        newMap.set(pair[0], pair[1]);
      });
      newMap.set(key, value.call([struct.get(key) ?? VarManager.unit]));
      return new MapToken(newMap);
    })
  );

  return new StructToken(module);
};

export default mapInit;
