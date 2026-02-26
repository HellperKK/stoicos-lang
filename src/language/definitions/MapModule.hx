package language.definitions;

import utils.HashMap;
import language.tokens.MapToken;
import language.tokens.BlockToken;
import language.tokens.BaseToken;
import language.tokens.StringToken;
import language.tokens.BooleanToken;
import language.managers.VarManager;
import language.tokens.ArrayToken;
import language.tokens.StructToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;

using Lambda;

class MapModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("empty", new MapToken(new HashMap<Value, Value>()));

		module.set("make", new FunctionToken((values) -> {
			var pairs:Array<Value> = values[0].request("array");

			var map = new HashMap<Value, Value>();

			for (pair in pairs) {
				var truePair:Array<Value> = pair.request("array");
				map.set(truePair[0], truePair[1]);
			}

			return new MapToken(map);
		}, 1));

		module.set("key", new FunctionToken((values) -> {
			var map:HashMap<Value, Value> = values[0].request("map");

			var keys:Array<Value> = [for (key in map.keys()) key];

			return new ArrayToken(keys);
		}, 1));
		module.set("values", new FunctionToken((values) -> {
			var map:HashMap<Value, Value> = values[0].request("map");

			var keys = [for (value in map.values()) value];

			return new ArrayToken(keys);
		}, 1));
		module.set("entries", new FunctionToken((values) -> {
			var map:HashMap<Value, Value> = values[0].request("map");

			var entries:Array<Value> = [
				for (pair in map.keyValueIterator())
					cast new ArrayToken([pair.key, pair.value])
			];

			return new ArrayToken(entries);
		}, 1));

		module.set("get", new FunctionToken((values) -> {
			var key = values[0];
			var map:HashMap<Value, Value> = values[1].request("map");

			return map.get(key) ?? VarManager.unit;
		}, 1));
		module.set("get_or", new FunctionToken((values) -> {
			var key = values[0];
			var defaultValue = values[1];
			var map:HashMap<Value, Value> = values[2].request("map");

			return map.get(key) ?? defaultValue;
		}, 1));
		module.set("get_or_fun", new FunctionToken((values) -> {
			var key = values[0];
			var fun = values[1];
			var map:HashMap<Value, Value> = values[2].request("map");

			return map.get(key) ?? fun.call([]);
		}, 1));

		module.set("set", new FunctionToken((values) -> {
			var key = values[0];
			var value = values[1];
			var map:HashMap<Value, Value> = values[2].request("map");

			var newMap = map.copy();
			newMap.set(key, value);

			return new MapToken(newMap);
		}, 1));
		module.set("set_fun", new FunctionToken((values) -> {
			var key = values[0];
			var fun = values[1];
			var map:HashMap<Value, Value> = values[2].request("map");

			var newMap = map.copy();
			newMap.set(key, fun.call([newMap.get(key) ?? VarManager.unit]));

			return new MapToken(newMap);
		}, 1));

		module.set("for_each", new FunctionToken((values) -> {
			var fun = values[0];
			var map:HashMap<Value, Value> = values[1].request("map");

			for (pair in map.keyValueIterator()) {
				fun.call([pair.key, pair.value]);
			}

			return VarManager.unit;
		}, 1));

		return new StructToken(module);
	}
}
