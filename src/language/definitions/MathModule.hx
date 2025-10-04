package language.definitions;

import language.tokens.StructToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;

class MathModule {
	public static function load() {
		var module = new Map<String, Value>();

        module.set("pow", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(Math.pow(num, numBis));
		}, 2));

		return new StructToken(module);
	}
}
