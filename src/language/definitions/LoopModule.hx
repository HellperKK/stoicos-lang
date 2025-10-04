package language.definitions;

import language.tokens.NumberToken;
import language.managers.VarManager;
import language.tokens.StructToken;
import language.tokens.FunctionToken;

using Math;

class LoopModule {
	public static function load() {
		var module = new Map<String, Value>();

        module.set("while", new FunctionToken((values) -> {
			var conditionBLock = values[0];
			var callBlock = values[1];
			
			while (conditionBLock.eval().request("boolean")) {
				callBlock.eval();
			}

			return VarManager.unit;
		}, 2));

		module.set("upto_fun", new FunctionToken((values) -> {
			var min:Float = values[0].request("number");
			var max:Float = values[1].request("number");
			var fun = values[2];
			
			for (i in min.floor()...max.floor()) {
				fun.call([new NumberToken(i)]);
			}

			return VarManager.unit;
		}, 2));

		module.set("times_fun", new FunctionToken((values) -> {
			var times:Float = values[0].request("number");
			var fun = values[1];
			
			for (i in 0...times.floor()) {
				fun.call([new NumberToken(i)]);
			}

			return VarManager.unit;
		}, 2));

		return new StructToken(module);
	}
}
