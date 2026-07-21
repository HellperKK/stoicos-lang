package language.definitions;

import language.tokens.StringToken;
import haxe.Json;
import language.tokens.StructToken;
import language.tokens.FunctionToken;
import sys.io.File;
import language.managers.PathManager;
import utils.JsonUtils;

class JsonModule {
	public static function load() {
		var module = new Map<String, Value>();

        module.set("parse", new FunctionToken((values) -> {
			var content:String = values[0].request("string");

			return JsonUtils.parseJson(content);
		}, 1));
        module.set("serialize", new FunctionToken((values) -> {
			var content = values[0].toJsonValue();

			return new StringToken(Json.stringify(content));
		}, 1));

		return new StructToken(module);
	}
}
