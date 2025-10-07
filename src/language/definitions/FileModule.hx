package language.definitions;

import sys.io.File;
import language.tokens.StringToken;
import language.tokens.NumberToken;
import language.managers.VarManager;
import language.tokens.StructToken;
import language.tokens.FunctionToken;

class FileModule {
	public static function load() {
		var module = new Map<String, Value>();

        module.set("get_content", new FunctionToken((values) -> {
			var path = values[0].request("string");

			return new StringToken(File.getContent(path));
		}, 2));

		return new StructToken(module);
	}
}
