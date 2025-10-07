package language.definitions;

import language.tokens.StringToken;
import language.managers.VarManager;
import hx_webserver.HTTPResponse;
import hx_webserver.RouteMap;
import hx_webserver.HTTPServer;
import language.tokens.StructToken;
import language.tokens.FunctionToken;

using Lambda;

class ServerModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("mimes", loadMimes());

		module.set("start", new FunctionToken((values) -> {
			var routes:Array<Value> = values[0].request("array");

			var server = new HTTPServer("0.0.0.0", 8080, true);
			var routemap = new RouteMap();

			for (route in routes) {
				var pair:Array<Value> = route.request("array");

				routemap.add(pair[0].request("string"), function(r) {
					var struct = pair[1].call([]).request("struct");

					var response = new HTTPResponse(Ok, struct.get("content").request("string") ?? "empty content");
					response.headers.set("content-type", struct.get("type").request("string") ?? "text/plain");

					return response;
				});
			}

			routemap.attach(server);

			return VarManager.unit;
		}, 2));

		module.set("response", new FunctionToken((values) -> {
			var content:String = values[0].request("string");
			var type:String = values[0].request("string");

			var struct = new Map<String, Value>();

			struct.set("content", new StringToken(content));
			struct.set("type", new StringToken(type));

			return new StructToken(struct);
		}, 2));

		return new StructToken(module);
	}

	private static function loadMimes() {
		var module = new Map<String, Value>();

		module.set("text", new StringToken("text/plain"));
		module.set("html", new StringToken("text/html"));

		return new StructToken(module);
	}
}
