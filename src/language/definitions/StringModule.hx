package language.definitions;

import language.managers.VarManager;
import language.tokens.BooleanToken;
import language.tokens.ArrayToken;
import language.tokens.StringToken;
import language.tokens.StructToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;

using StringTools;

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

        module.set("make", new FunctionToken((values) -> {
			var times:Float = values[0].request("number");
			var str:String = values[1].request("string");
			
			var builder = new StringBuf();
			for (i in 0...Math.floor(times)) {
				builder.add(str);
			}

			return new StringToken(builder.toString());
		}, 2));
        module.set("make_fun", new FunctionToken((values) -> {
			var times:Float = values[0].request("number");
			var f = values[1];
			
			var builder = new StringBuf();
			for (i in 0...Math.floor(times)) {
				builder.add(f.call([new NumberToken(i)]).request("string"));
			}

			return new StringToken(builder.toString());
		}, 2));

        module.set("get", new FunctionToken((values) -> {
			var index:Float = values[0].request("number");
			var str:String = values[1].request("string");

			return new StringToken(str.charAt(Math.floor(index)));
		}, 1));
        module.set("sub", new FunctionToken((values) -> {
			var start:Float = values[0].request("number");
			var len:Float = values[1].request("number");
			var str:String = values[2].request("string");

			return new StringToken(str.substr(Math.floor(start), Math.floor(len)));
		}, 3));
        module.set("slice", new FunctionToken((values) -> {
			var min:Float = values[0].request("number");
			var max:Float = values[1].request("number");
			var str:String = values[2].request("string");

			return new StringToken(str.substring(Math.floor(min), Math.floor(max)));
		}, 3));

        module.set("split", new FunctionToken((values) -> {
			var sep:String = values[0].request("string");
			var str:String = values[1].request("string");

			return new ArrayToken(str.split(sep).map(s -> cast new StringToken(s)));
		}, 2));
        module.set("concat", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			var strBis:String = values[1].request("string");
			
			return new StringToken(str + strBis);
		}, 2));
        module.set("replace", new FunctionToken((values) -> {
			var pattern:String = values[0].request("string");
			var replacement:String = values[1].request("string");
			var str:String = values[2].request("string");
			
			var pos = str.indexOf(pattern);

			if (pos == -1) {
				return new StringToken(str);
			}

			var newStr = str.substring(0, pos) + replacement + str.substring(pos + pattern.length);

			return new StringToken(newStr);
		}, 3));
        module.set("replace_all", new FunctionToken((values) -> {
			var pattern:String = values[0].request("string");
			var replacement:String = values[1].request("string");
			var str:String = values[2].request("string");
			
			return new StringToken(str.replace(pattern, replacement));
		}, 3));
        module.set("format", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			var values:Array<Value> = values[1].request("array");

			var result = ~/\{(\d+)\}/g.map(str, ereg -> {
				var index = Std.parseInt(ereg.matched(1));
				return values[index]?.request("string") ?? "unit";
			});
			
			return new StringToken(result);
		}, 2));

        module.set("length", new FunctionToken((values) -> {
			var str:String = values[0].request("string");
			
			return new NumberToken(str.length);
		}, 1));
        module.set("reverse", new FunctionToken((values) -> {
			var str:String = values[0].request("string");

			var arr = str.split("");
			arr.reverse();
			
			return new StringToken(arr.join(""));
		}, 1));
        module.set("includes", new FunctionToken((values) -> {
			var substring:String = values[0].request("string");
			var str:String = values[1].request("string");

			return new BooleanToken(str.contains(substring));
		}, 2));

		return new StructToken(module);
	}
}
