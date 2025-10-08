package language.definitions;

import language.tokens.StructToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;

class MathModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("PI", new NumberToken(Math.PI));
		module.set("E", new NumberToken(Math.exp(1)));

		module.set("abs", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.abs(num));
		}, 1));
		module.set("floor", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.floor(num));
		}, 1));
		module.set("ceil", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.ceil(num));
		}, 1));
		module.set("round", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.round(num));
		}, 1));
		module.set("trunc", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Std.int(num));
		}, 1));
		module.set("min", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(Math.min(num, numBis));
		}, 2));
		module.set("max", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(Math.max(num, numBis));
		}, 2));
		module.set("clamp", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var min = values[1].request("number");
			var max = values[2].request("number");
			return new NumberToken(Math.max(min, Math.min(num, max)));
		}, 3));
		module.set("pow", new FunctionToken((values) -> {
			var num = values[0].request("number");
			var numBis = values[1].request("number");
			return new NumberToken(Math.pow(num, numBis));
		}, 2));
		module.set("sqrt", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.sqrt(num));
		}, 1));
		module.set("exp", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.exp(num));
		}, 1));
		module.set("log", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.log(num));
		}, 1));
		module.set("log10", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.log(num) / Math.log(10));
		}, 1));
		module.set("cos", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.cos(num));
		}, 1));
		module.set("sin", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.sin(num));
		}, 1));
		module.set("tan", new FunctionToken((values) -> {
			var num = values[0].request("number");
			return new NumberToken(Math.tan(num));
		}, 1));

			return new StructToken(module);
	}
}
