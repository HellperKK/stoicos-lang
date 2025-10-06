package language.definitions;

import language.tokens.StringToken;
import language.tokens.BooleanToken;
import language.managers.VarManager;
import language.tokens.ArrayToken;
import language.tokens.StructToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;

using Lambda;

class ArrayModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("empty", new ArrayToken([]));

		module.set("make", new FunctionToken((values) -> {
			var size = values[0].request("number");
			var value = values[1];

			var result = new Array<Value>();

			for (i in 0...Math.floor(size)) {
				result.push(value);
			}

			return new ArrayToken(result);
		}, 2));
		module.set("make_fun", new FunctionToken((values) -> {
			var size = values[0].request("number");
			var value = values[1];

			var result = new Array<Value>();

			for (i in 0...Math.floor(size)) {
				result.push(value.call([new NumberToken(i)]));
			}

			return new ArrayToken(result);
		}, 2));
		module.set("make_range", new FunctionToken((values) -> {
			var min = values[0].request("number");
			var max = values[1].request("number");

			var result = new Array<Value>();

			for (i in Math.floor(min)...Math.floor(max)) {
				result.push(new NumberToken(i));
			}

			return new ArrayToken(result);
		}, 2));
		module.set("singleton", new FunctionToken((values) -> {
			var value = values[0];

			return new ArrayToken([value]);
		}, 1));
		module.set("set", new FunctionToken((values) -> {
			var index:Float = values[0].request("number");
			var value = values[1];
			var arr:Array<Value> = values[2].request("array");

			var newArr = arr.copy();
			newArr[Math.floor(index)] = value;

			return new ArrayToken(newArr);
		}, 3));
		module.set("set_fun", new FunctionToken((values) -> {
			var index:Float = values[0].request("number");
			var value = values[1];
			var arr:Array<Value> = values[2].request("array");

			var newArr = arr.copy();
			newArr[Math.floor(index)] = value.call([newArr[Math.floor(index)] ?? VarManager.unit]);

			return new ArrayToken(newArr);
		}, 3));
		module.set("push", new FunctionToken((values) -> {
			var value = values[0];
			var arr:Array<Value> = values[1].request("array");

			var newArr = arr.copy();
			newArr.push(value);

			return new ArrayToken(newArr);
		}, 2));
		module.set("pop", new FunctionToken((values) -> {
			var arr:Array<Value> = values[0].request("array");

			var newArr = arr.copy();
			newArr.pop();

			return new ArrayToken(newArr);
		}, 1));
		module.set("unshift", new FunctionToken((values) -> {
			var value = values[0];
			var arr:Array<Value> = values[1].request("array");

			var newArr = arr.copy();
			newArr.unshift(value);

			return new ArrayToken(newArr);
		}, 2));
		module.set("shift", new FunctionToken((values) -> {
			var arr:Array<Value> = values[0].request("array");

			var newArr = arr.copy();
			newArr.shift();

			return new ArrayToken(newArr);
		}, 1));
		module.set("splice", new FunctionToken((values) -> {
			var pos:Float = values[0].request("number");
			var len:Float = values[1].request("number");
			var replacement:Array<Value> = values[2].request("array");
			var arr:Array<Value> = values[3].request("array");

			var newArr = arr.slice(0, Math.floor(pos)).concat(replacement).concat(arr.slice(Math.floor(pos) + Math.floor(len)));

			return new ArrayToken(newArr);
		}, 4));

		module.set("fold_left", new FunctionToken((values) -> {
			var fun = values[0];
			var intialValue = values[1];
			var arr:Array<Value> = values[2].request("array");

			var result = arr.fold((value, memo) -> fun.call([memo, value]), intialValue);
			return result;
		}, 3));
		module.set("fold_right", new FunctionToken((values) -> {
			var fun = values[0];
			var intialValue = values[1];
			var arr:Array<Value> = values[2].request("array");

			var newArr = arr.copy();
			newArr.reverse();

			var result = newArr.fold((value, memo) -> fun.call([memo, value]), intialValue);

			return result;
		}, 3));
		module.set("map", new FunctionToken((values) -> {
			var fun = values[0];
			var arr:Array<Value> = values[1].request("array");

			var newArr = arr.map(value -> fun.call([value]));
			
			return new ArrayToken(newArr);
		}, 2));
		module.set("filter", new FunctionToken((values) -> {
			var fun = values[0];
			var arr:Array<Value> = values[1].request("array");

			var newArr = arr.filter(value -> fun.call([value]).request("boolean"));
			
			return new ArrayToken(newArr);
		}, 2));
		module.set("for_each", new FunctionToken((values) -> {
			var fun = values[0];
			var arr:Array<Value> = values[1].request("array");

			arr.iter(value -> fun.call([value]));
			
			return VarManager.unit;
		}, 2));
		module.set("includes", new FunctionToken((values) -> {
			var value = values[0];
			var arr:Array<Value> = values[1].request("array");

			return new BooleanToken(arr.contains(value));
		}, 2));
		module.set("any", new FunctionToken((values) -> {
			var fun = values[0];
			var arr:Array<Value> = values[1].request("array");

			return new BooleanToken(arr.exists(value -> fun.call([value]).request("boolean")));
		}, 2));
		module.set("all", new FunctionToken((values) -> {
			var fun = values[0];
			var arr:Array<Value> = values[1].request("array");

			return new BooleanToken(arr.foreach(value -> fun.call([value]).request("boolean")));
		}, 2));


		module.set("get", new FunctionToken((values) -> {
			var index = values[0].request("number");
			var arr:Array<Value> = values[1].request("array");

			return arr[Math.floor(index)] ?? VarManager.unit;
		}, 2));
		module.set("get_or", new FunctionToken((values) -> {
			var index = values[0].request("number");
			var defaultValue = values[1];
			var arr:Array<Value> = values[2].request("array");

			return arr[Math.floor(index)] ?? defaultValue;
		}, 3));
		module.set("get_or_fun", new FunctionToken((values) -> {
			var index = values[0].request("number");
			var fun = values[1];
			var arr:Array<Value> = values[2].request("array");

			return arr[Math.floor(index)] ?? fun.call([]);
		}, 3));

		module.set("slice", new FunctionToken((values) -> {
			var min = values[0].request("number");
			var max = values[1].request("number");
			var arr:Array<Value> = values[2].request("array");

			return new ArrayToken(arr.slice(Math.floor(min), Math.floor(max)));
		}, 3));
		module.set("sub", new FunctionToken((values) -> {
			var start = values[0].request("number");
			var len = values[1].request("number");
			var arr:Array<Value> = values[2].request("array");

			var max = Math.floor(len) + Math.floor(start);

			return new ArrayToken(arr.slice(Math.floor(start), max));
		}, 3));

		module.set("join", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			var arr:Array<Value> = values[1].request("array");

			return new StringToken(arr.map(value -> value.request("string")).join(str));
		}, 2));
		module.set("concat", new FunctionToken((values) -> {
			var arr:Array<Value>= values[0].request("array");
			var arrBis:Array<Value> = values[1].request("array");

			return new ArrayToken(arr.concat(arrBis));
		}, 2));
		module.set("length", new FunctionToken((values) -> {
			var arr:Array<Value>= values[0].request("string");

			return new NumberToken(arr.length);
		}, 1));
		module.set("sort", new FunctionToken((values) -> {
			var fun = values[0];
			var arr:Array<Value>= values[1].request("array");

			var newArray = arr.copy();
			newArray.sort((val, valBis) -> Math.floor(fun.call([val, valBis]).request("number")));

			return new ArrayToken(newArray);
		}, 2));

		return new StructToken(module);
	}
}
