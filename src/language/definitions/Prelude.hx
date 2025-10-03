package language.definitions;

import language.tokens.BooleanToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;
import language.managers.VarManager;

class Prelude {
	public static function load() {
		var manager = VarManager.get();

		manager.setVar("unit", VarManager.unit);
		manager.setVar("true", new BooleanToken(true));
		manager.setVar("false", new BooleanToken(false));


		manager.setVar("print", new FunctionToken((values) -> {
			Sys.print(values[0].request("string"));
			return VarManager.unit;
		}, 1));
		manager.setVar("println", new FunctionToken((values) -> {
			Sys.println(values[0].request("string"));
			return VarManager.unit;
		}, 1));
		manager.setVar("debug", new FunctionToken((values) -> {
			trace(values[0]);
			return VarManager.unit;
		}, 1));

		manager.setVar("+", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(num + numBis);
		}, 1));
		manager.setVar("-", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(num - numBis);
		}, 1));
		manager.setVar("*", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(num * numBis);
		}, 1));
		manager.setVar("**", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(Math.pow(num, numBis));
		}, 1));
		manager.setVar("/", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(num / numBis);
		}, 1));
		manager.setVar("//", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(Math.floor(num / numBis));
		}, 1));
	}
}
