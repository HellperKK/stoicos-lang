package language.definitions;

import language.tokens.StructToken;
import language.tokens.StringToken;
import language.tokens.BaseToken;
import language.tokens.BlockToken;
import language.tokens.BooleanToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;
import language.managers.VarManager;

using Lambda;

class Prelude {
	public static function load() {
		var manager = VarManager.get();

		manager.setVar("unit", VarManager.unit);
		manager.setVar("true", new BooleanToken(true));
		manager.setVar("false", new BooleanToken(false));

		manager.setVar("String", StringModule.load());
		manager.setVar("Array", ArrayModule.load());

		manager.setVar("import", new FunctionToken((values) -> {
			var name = values[0].request("symbol");

			switch (name) {
				case "Math": manager.setVar(name, MathModule.load());
				case "Loop": manager.setVar(name, LoopModule.load());
				case "Struct": manager.setVar(name, StructModule.load());
			}

			return VarManager.unit;
		}, 1));

		manager.setVar("if", new FunctionToken((values) -> {
			var condition = values[0].request("boolean");
			var ifTrue = values[1];
			var ifFalse = values[2];

			if (condition) {
				return ifTrue.eval();
			}

			return ifFalse.eval();
		}, 3));

		manager.setVar("cond", new FunctionToken((values) -> {
			var conditions:Array<Value> = values[0].request("array");

			for (condition in conditions) {
				var truePair:Array<Value> = condition.request("array");
				var trueCondition:Bool = truePair[0].eval().request("boolean");

				if (trueCondition) {
					return truePair[1].eval();
				}
			}

			return VarManager.unit;
		}, 1));
		manager.setVar("fun", new FunctionToken((values) -> {
			var params = values[0].request("array").map(value -> value.request("symbol"));
			var blocks:Array<BaseToken> = values[1].request("block");

			var fun = new FunctionToken(FunctionToken.customFunction(params, blocks), params.length);

			return fun;
		}, 2));
		manager.setVar("enum", new FunctionToken((values) -> {
			var names: Array<String> = values[0].request("array").map(value -> value.request("symbol"));

			var enumMap = new Map<String, Value>();

			for (name in names) {
				enumMap.set(name, new StringToken(name));
			}

			return new StructToken(enumMap);
		}, 1));

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

			fun.value = FunctionToken.customFunction(params, blocks);

			fun.arity = params.length;

			return VarManager.unit;
		}, 3));
		manager.setAlias("deffun", "fn");
		manager.setVar("bind", new FunctionToken((values) -> {
			var names:Array<String> = values[0].request("array").map(value -> value.request("symbol"));
			var elements:Array<Value> = values[1].request("array");

			var manager = VarManager.get();

			for (pair in names.keyValueIterator()) {
				var i = pair.key;
				manager.setVar(pair.value, elements[i] ?? VarManager.unit);
			}

			return VarManager.unit;
		}, 2));

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
		manager.setVar("%", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(num % numBis);
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
		manager.setVar("!", new FunctionToken((values) -> {
			var bool = values[0].request("boolean");
			return new BooleanToken(!bool);
		}, 1));

		manager.setVar("==", new FunctionToken((values) -> {
			var val = values[0];
			var valBis = values[1];
			return new BooleanToken(val.compare(valBis) == 0);
		}, 2));
		manager.setVar("!=", new FunctionToken((values) -> {
			var val = values[0];
			var valBis = values[1];
			return new BooleanToken(val.compare(valBis) != 0);
		}, 2));
		manager.setVar("<", new FunctionToken((values) -> {
			var val = values[0];
			var valBis = values[1];
			return new BooleanToken(val.compare(valBis) < 0);
		}, 2));
		manager.setVar("<=", new FunctionToken((values) -> {
			var val = values[0];
			var valBis = values[1];
			return new BooleanToken(val.compare(valBis) <= 0);
		}, 2));
		manager.setVar(">", new FunctionToken((values) -> {
			var val = values[0];
			var valBis = values[1];
			return new BooleanToken(val.compare(valBis) > 0);
		}, 2));
		manager.setVar(">=", new FunctionToken((values) -> {
			var val = values[0];
			var valBis = values[1];
			return new BooleanToken(val.compare(valBis) >= 0);
		}, 2));
		manager.setVar("<=>", new FunctionToken((values) -> {
			var val = values[0];
			var valBis = values[1];
			return new NumberToken(val.compare(valBis));
		}, 2));

		manager.setVar("parse_int", new FunctionToken((values) -> {
			var str = values[0].request("string");
			return new NumberToken(Std.parseInt(str));
		}, 1));
		manager.setVar("parse_float", new FunctionToken((values) -> {
			var str = values[0].request("string");
			return new NumberToken(Std.parseFloat(str));
		}, 1));
		manager.setVar("to_string", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			return new StringToken(str);
		}, 1));


		manager.setVar("|>", new FunctionToken((values) -> {
			var initalValue = values[0];
			var funs:Array<Value> = values[1].request("array");

			return funs.fold((fun, memo) -> fun.call([memo]), initalValue);
		}, 2));
	}
}
