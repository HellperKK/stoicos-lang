package language.definitions;

import language.tokens.BaseToken;
import language.tokens.BlockToken;
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

        manager.setVar("def", new FunctionToken((values) -> {
			var name = values[0].request("symbol");
			var value = values[1];

            var manager = VarManager.get();

            manager.setVar(name, value);

            return VarManager.unit;
		}, 2));
        manager.setVar("deffun", new FunctionToken((values) -> {
			var name = values[0].request("symbol");
			var params = values[1].request("array").map(value -> value.request("symbol"));
            var blocks:Array<BaseToken> = values[2].request("block");

            var fun = new FunctionToken((_values) -> VarManager.unit, 0);

            var manager = VarManager.get();

            manager.setVar(name, fun);

			fun.value = ((values: Array<Value>) -> {
				var manager = VarManager.get();

				var capturedBlock = new BlockToken(blocks.map(tok -> tok.capture()));

				manager.addStack();
				for (i in 0...params.length) {
					manager.setVar(params[i], values[i]);
				}

				var result = capturedBlock.eval();

				manager.delStack();

				return result;
			});

            return VarManager.unit;
		}, 3));
		manager.setAlias("deffun", "fn");

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
		}, 2));
		manager.setVar("-", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(num - numBis);
		}, 2));
		manager.setVar("*", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(num * numBis);
		}, 2));
		manager.setVar("**", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(Math.pow(num, numBis));
		}, 2));
		manager.setVar("/", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(num / numBis);
		}, 2));
		manager.setVar("//", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(Math.floor(num / numBis));
		}, 2));

		manager.setVar("&&", new FunctionToken((values) -> {
			var bool = values[0].request("boolean");
			var boolBis = values[1].request("boolean");
			return new BooleanToken(bool && boolBis);
		}, 2));
		manager.setVar("||", new FunctionToken((values) -> {
			var bool = values[0].request("boolean");
			var boolBis = values[1].request("boolean");
			return new BooleanToken(bool || boolBis);
		}, 2));
		manager.setVar("%", new FunctionToken((values) -> {
			var bool = values[0].request("boolean");
			return new BooleanToken(!bool);
		}, 1));
	}
}
