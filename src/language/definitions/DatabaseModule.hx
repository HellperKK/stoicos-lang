package language.definitions;

import utils.HashMap;
import utils.JsonUtils;
import language.managers.PathManager;
import sys.db.Sqlite;
import language.tokens.StringToken;
import language.tokens.BooleanToken;
import language.managers.VarManager;
import language.tokens.ArrayToken;
import language.tokens.StructToken;
import language.tokens.NumberToken;
import language.tokens.FunctionToken;

using Lambda;

class DatabaseModule {
	public static function load() {
		var module = new Map<String, Value>();

		module.set("connect", new FunctionToken((values) -> {
			var path = PathManager.get();
			var database = path.resolvePath(values[0].request("string"));
			var connexion = Sqlite.open(database);

			var dbmodule = new Map<String, Value>();

			var makeRequest = (request:String, params:Map<String, String>) -> {
				var pattern = ~/:([a-zA-Z]+)/;
				var cleanRequest = pattern.map(request, (ereg -> {
					var data = params.get(ereg.matched(1));
					return connexion.quote(connexion.escape(data));
				}));

				var result = connexion.request(cleanRequest);

				var datas = [for (data in result) JsonUtils.toValue(data)];

				return datas;
			}

			dbmodule.set("request", new FunctionToken((values) -> {
				var request = values[0].request("string");
				var params:HashMap<Value, Value> = values[1].request("map");

				var cleanParams = new Map<String, String>();

				for (pair in params.keyValueIterator()) {
					cleanParams.set(pair.key.request("string"), pair.value.request("string"));
				}

				var datas = makeRequest(request, cleanParams);

				return new ArrayToken(datas);
			}, 2));

			return new StructToken(dbmodule);
		}, 1));

		return new StructToken(module);
	}
}
