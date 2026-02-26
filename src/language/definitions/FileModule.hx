package language.definitions;

import sys.FileSystem;
import language.tokens.BooleanToken;
import sys.io.File;
import language.tokens.StringToken;
import language.managers.VarManager;
import language.tokens.StructToken;
import language.tokens.FunctionToken;

class FileModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("exists", new FunctionToken((values) -> {
			var path = values[0].request("string");

			return new BooleanToken(FileSystem.exists(path));
		}, 1));

		module.set("is_directory", new FunctionToken((values) -> {
			var path = values[0].request("string");

			return new BooleanToken(FileSystem.isDirectory(path));
		}, 1));

        module.set("get_content", new FunctionToken((values) -> {
			var path = values[0].request("string");

			return new StringToken(File.getContent(path));
		}, 1));

        module.set("save_content", new FunctionToken((values) -> {
			var path = values[0].request("string");
			var content = values[1].request("string");

			File.saveContent(path, content);

			return VarManager.unit;
		}, 2));

		return new StructToken(module);
	}
}
