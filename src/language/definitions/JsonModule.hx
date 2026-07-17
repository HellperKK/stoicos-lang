package language.definitions;

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

		return new StructToken(module);
	}
}
