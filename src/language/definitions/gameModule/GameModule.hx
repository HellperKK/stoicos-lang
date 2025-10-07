package language.definitions.gameModule;

import language.managers.VarManager;
import language.tokens.StructToken;
import language.tokens.FunctionToken;

using Lambda;

class GameModule {
	public static var moduleKeys = ["initial_state", "update", "draw", "width", "height"];

	public static function load() {
		var module = new Map<String, Value>();

		module.set("start", new FunctionToken((values) -> {
			var module:Map<String, Value> = values[0].request("struct");

			for (moduleKey in moduleKeys) {
				if (! module.exists(moduleKey)) {
					Sys.println('missing key ${moduleKey} in game module');
					Sys.exit(1);
				}
			}

			Window.main(module);

			return VarManager.unit;
		}, 1));
		module.set("sprite", new FunctionToken((values) -> {
			var x = values[0];
			var y = values[1];
			var name = values[2];

			var module = new Map<String, Value>();

			module.set("x", x);
			module.set("y", y);
			module.set("name", name);

			return new StructToken(module);
		}, 2));

		return new StructToken(module);
	}
}
