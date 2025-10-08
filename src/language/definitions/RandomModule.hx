package language.definitions;

import language.tokens.StructToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;

class RandomModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("rand", new FunctionToken((values) -> {
			return new NumberToken(Math.random());
		}, 0));
		module.set("range", new FunctionToken((values) -> {
			var min:Int = Math.floor(values[0].request("number"));
			var max:Int = Math.floor(values[1].request("number"));

			var interval = max - min + 1;

			return new NumberToken(Std.random(interval) + min);
		}, 2));
		module.set("pick", new FunctionToken((values) -> {
			var values:Array<Value> = values[0].request("array");

			return values[Std.random(values.length)];
		}, 1));
		
		return new StructToken(module);
	}
}
