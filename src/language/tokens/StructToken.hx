package language.tokens;

class StructToken extends Value {
    public function new(value: Map<String, Value>) {
        super("struct", value);
    }
    
    public override function request(type:String):Dynamic {
        if (type == "string") {
            var map:Map<String, Value> = this.value;
            var pairs = [for (kv in map.keyValueIterator()) '${kv.key}:${kv.value.request("string")}'];
            return '{${pairs.join(" ")}}';
        }

        return super.request(type);
    }

    public function hash():String {
        var map: Map<String, Value> = this.value;
        var sortedKeys = [ for (key in map.keys()) key ];
        sortedKeys.sort((a, b) -> {
            if (a < b) return -1;
            else if (a > b) return 1;
            else return 0;
        });
        var hashes = [for (key in sortedKeys) '${key}:${map.get(key).hash()}'];
        return 'struct({${hashes.join(",")}})';
    }

    public override function toJsonValue(): Dynamic {
        var obj = {};
        var value:Map<String, Value> = this.value;
        
        for (pair in value.keyValueIterator()) {
            if (pair.value.canBeSerialized()) {
                Reflect.setField(obj, pair.key, pair.value.toJsonValue());
            }
        }

        return obj;
	}
}
