package language.definitions;

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

class StructModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("empty", new StructToken(new Map<String, Value>()));

		module.set("make", new FunctionToken((values) -> {
			var pairs:Array<Value> = values[0].request("array");

			var struct = new Map<String, Value>();

			for (pair in pairs) {
				var truePair:Array<Value> = pair.request("array");
				struct.set(truePair[0].request("symbol"), truePair[1]);
			}

			return new StructToken(struct);
		}, 1));
		module.set("module", new FunctionToken((values) -> {
			var tokens:Array<BaseToken> = values[0].request("block");
			var manager = VarManager.get();

			var capturedBlock = new BlockToken(tokens.map(token -> token.capture()));

			manager.addStack();

			capturedBlock.eval();

			var stack = manager.delStack();

			return new StructToken(stack);
		}, 1));
		module.set("build", new FunctionToken((values) -> {
			var values:Array<Value> = values[0].request("array");
			var names:Array<String> = values.map(value -> value.request("symbol"));
			var struct = new Map<String, Value>();

			struct.set("make", new FunctionToken(values -> {
				var innerStruct: Map<String, Value> = new Map<String, Value>();
				
				for (pair in names.keyValueIterator()) {
					innerStruct.set(pair.value, values[pair.key]);
				}

				return new StructToken(innerStruct);
			}, names.length));
			struct.set("is", new FunctionToken(values -> {
				var innerStruct: Map<String, Value> = values[0].request("struct");

				var isValid = names.foreach(name -> innerStruct.exists(name));

				return new BooleanToken(isValid);
			}, 1));

			return new StructToken(struct);
		}, 1));

		module.set("key", new FunctionToken((values) -> {
			var struct:Map<String, Value> = values[0].request("struct");

			var keys:Array<Value> = [for (key in struct.keys()) cast new StringToken(key)];

			return new ArrayToken(keys);
		}, 1));
		module.set("values", new FunctionToken((values) -> {
			var struct:Map<String, Value> = values[0].request("struct");

			var keys = [for (value in struct.iterator()) value];

			return new ArrayToken(keys);
		}, 1));
		module.set("entries", new FunctionToken((values) -> {
			var struct:Map<String, Value> = values[0].request("struct");

			var entries:Array<Value> = [
				for (pair in struct.keyValueIterator())
					cast new ArrayToken([new StringToken(pair.key), pair.value])
			];

			return new ArrayToken(entries);
		}, 1));

		module.set("get", new FunctionToken((values) -> {
			var name:String = values[0].request("symbol");
			var struct:Map<String, Value> = values[1].request("struct");

			return struct.get(name) ?? VarManager.unit;
		}, 1));
		module.set("get_or", new FunctionToken((values) -> {
			var name:String = values[0].request("symbol");
			var defaultValue = values[1];
			var struct:Map<String, Value> = values[2].request("struct");

			return struct.get(name) ?? defaultValue;
		}, 1));
		module.set("get_or_fun", new FunctionToken((values) -> {
			var name:String = values[0].request("symbol");
			var fun = values[1];
			var struct:Map<String, Value> = values[2].request("struct");

			return struct.get(name) ?? fun.call([]);
		}, 1));

		module.set("set", new FunctionToken((values) -> {
			var name:String = values[0].request("symbol");
			var value = values[1];
			var struct:Map<String, Value> = values[2].request("struct");

			var newStruct = struct.copy();

			newStruct.set(name, value);

			return new StructToken(newStruct);
		}, 1));
		module.set("set_fun", new FunctionToken((values) -> {
			var name:String = values[0].request("symbol");
			var fun = values[1];
			var struct:Map<String, Value> = values[2].request("struct");

			var newStruct = struct.copy();

			newStruct.set(name, fun.call([newStruct.get(name) ?? VarManager.unit]));

			return new StructToken(newStruct);
		}, 1));

		return new StructToken(module);
	}
}
