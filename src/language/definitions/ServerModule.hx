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
			var content = values[0];
			var type = values[1];

			var struct = new Map<String, Value>();

			struct.set("content", content);
			struct.set("type", type);

			return new StructToken(struct);
		}, 2));

		return new StructToken(module);
	}

	private static function loadMimes() {
		var module = new Map<String, Value>();

		module.set("aac", new StringToken("audio/aac"));
		module.set("abw", new StringToken("application/x-abiword"));
		module.set("arc", new StringToken("application/octet-stream"));
		module.set("avi", new StringToken("video/x-msvideo"));
		module.set("azw", new StringToken("application/vnd.amazon.ebook"));
		module.set("bin", new StringToken("application/octet-stream"));
		module.set("bmp", new StringToken("image/bmp"));
		module.set("bz", new StringToken("application/x-bzip"));
		module.set("bz2", new StringToken("application/x-bzip2"));
		module.set("csh", new StringToken("application/x-csh"));
		module.set("css", new StringToken("text/css"));
		module.set("csv", new StringToken("text/csv"));
		module.set("doc", new StringToken("application/msword"));
		module.set("docx", new StringToken("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
		module.set("eot", new StringToken("application/vnd.ms-fontobject"));
		module.set("epub", new StringToken("application/epub+zip"));
		module.set("gif", new StringToken("image/gif"));
		module.set("html", new StringToken("text/html"));
		module.set("ico", new StringToken("image/x-icon"));
		module.set("ics", new StringToken("text/calendar"));
		module.set("jar", new StringToken("application/java-archive"));
		module.set("jpg", new StringToken("image/jpeg"));
		module.set("js", new StringToken("application/javascript"));
		module.set("json", new StringToken("application/json"));
		module.set("midi", new StringToken("audio/midi"));
		module.set("mpeg", new StringToken("video/mpeg"));
		module.set("mpkg", new StringToken("application/vnd.apple.installer+xml"));
		module.set("odp", new StringToken("application/vnd.oasis.opendocument.presentation"));
		module.set("ods", new StringToken("application/vnd.oasis.opendocument.spreadsheet"));
		module.set("odt", new StringToken("application/vnd.oasis.opendocument.text"));
		module.set("oga", new StringToken("audio/ogg"));
		module.set("ogv", new StringToken("video/ogg"));
		module.set("ogx", new StringToken("application/ogg"));
		module.set("otf", new StringToken("font/otf"));
		module.set("png", new StringToken("image/png"));
		module.set("pdf", new StringToken("application/pdf"));
		module.set("ppt", new StringToken("application/vnd.ms-powerpoint"));
		module.set("pptx", new StringToken("application/vnd.openxmlformats-officedocument.presentationml.presentation"));
		module.set("rar", new StringToken("application/x-rar-compressed"));
		module.set("rtf", new StringToken("application/rtf"));
		module.set("sh", new StringToken("application/x-sh"));
		module.set("svg", new StringToken("image/svg+xml"));
		module.set("swf", new StringToken("application/x-shockwave-flash"));
		module.set("tar", new StringToken("application/x-tar"));
		module.set("text", new StringToken("text/plain"));
		module.set("tiff", new StringToken("image/tiff"));
		module.set("ts", new StringToken("application/typescript"));
		module.set("ttf", new StringToken("font/ttf"));
		module.set("vsd", new StringToken("application/vnd.visio"));
		module.set("wav", new StringToken("audio/x-wav"));
		module.set("weba", new StringToken("audio/webm"));
		module.set("webm", new StringToken("video/webm"));
		module.set("webp", new StringToken("image/webp"));
		module.set("woff", new StringToken("font/woff"));
		module.set("woff2", new StringToken("font/woff2"));
		module.set("xhtml", new StringToken("application/xhtml+xml"));
		module.set("xls", new StringToken("application/vnd.ms-excel"));
		module.set("xlsx", new StringToken("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
		module.set("xml", new StringToken("application/xml"));
		module.set("xul", new StringToken("application/vnd.mozilla.xul+xml"));
		module.set("zip", new StringToken("application/zip"));
		// module.set("7z", new StringToken("application/x-7z-compressed"));

		return new StructToken(module);
	}
}
