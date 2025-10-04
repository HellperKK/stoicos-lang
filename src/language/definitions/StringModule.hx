package language.definitions;

import language.tokens.StringToken;
import language.tokens.StructToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;

class StringModule {
	public static function load() {
		var module = new Map<String, Value>();

        module.set("uppercase", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			return new StringToken(str.toUpperCase());
		}, 1));
        module.set("lowercase", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			return new StringToken(str.toLowerCase());
		}, 1));
        module.set("capitalize", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			return new StringToken(str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
		}, 1));
        module.set("title", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			var newStr = ~/\b(\w+)/g.map(str, ereg -> {
				var match = ereg.matched(1);
				return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
			});
			return new StringToken(newStr);
		}, 1));

		return new StructToken(module);
	}
}
