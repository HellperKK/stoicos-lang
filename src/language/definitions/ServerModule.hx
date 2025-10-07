package language.definitions;

import language.managers.VarManager;
import hx_webserver.HTTPResponse;
import hx_webserver.RouteMap;
import hx_webserver.HTTPServer;
import language.tokens.ArrayToken;
import language.tokens.StructToken;
import language.tokens.FunctionToken;

using Lambda;

class ServerModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("start", new FunctionToken((values) -> {
			var routes:Array<Value> = values[0].request("array");

			var server = new HTTPServer("0.0.0.0", 8080, true);
			var routemap = new RouteMap();

			for (route in routes) {
				var pair:Array<Value> = route.request("array");

				routemap.add(pair[0].request("string"), function(r) {
					trace(r.methods);
					return new HTTPResponse(Ok, pair[1].call([]).request("string"));
				});
			}

			routemap.attach(server);

			return VarManager.unit;
		}, 2));

		return new StructToken(module);
	}
}
