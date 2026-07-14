package language.managers;

import language.tokens.StructToken;
import sys.io.File;
import language.definitions.Prelude;
import sys.FileSystem;
import haxe.io.Path;
import language.tokens.UnitToken;
import language.tokens.BaseToken;

using StringTools;

class PathManager {
	private static var instance:PathManager;

	public static function get() {
		if (PathManager.instance == null) {
			PathManager.instance = new PathManager();
		}

		return PathManager.instance;
	}

	private var paths:Array<String>;
	private var modules:Map<String, StructToken>;

	private function new() {
		paths = [];
		modules = new Map<String, StructToken>();
	}

	public function addPath(path:String) {
		paths.push(path);
	}

	public function resolvePath(path:String):String {
		if (path.startsWith("/")) {
			var rootPath = paths[paths.length - 1];
			return Path.join([Path.directory(rootPath), path]);
		}

		var relativePath = paths[0];
		return Path.join([Path.directory(relativePath), path]);
	}

	public function resolveModule(path:String):StructToken {
		var globalPath = this.resolvePath(path);

		if (this.modules.exists(globalPath)) {
			return this.modules.get(globalPath);
		}

		var manager = VarManager.get();
		manager.prepareModule();

		var code = File.getContent(globalPath);
		var tokens = Parser.parse(code).map(token -> token.capture());

		manager.addStack();

		for (token in tokens) {
			token.getValue();
		}

		var stack = manager.delStack();
		manager.restoreModule();

		var module = new StructToken(stack);
		this.modules.set(globalPath, module);

		return module;
	}
}
