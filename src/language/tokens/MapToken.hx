package language.tokens;

import utils.HashMap;

class MapToken extends Value {
    public function new(value: HashMap<Value, Value>) {
        super("map", value);
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
        var map: HashMap<Value, Value> = this.value;
        var sortedKeys = [ for (key in map.keys()) key ];
        sortedKeys.sort((a, b) -> {
            var aStr = a.hash();
            var bStr = b.hash();
            if (aStr < bStr) return -1;
            else if (aStr > bStr) return 1;
            else return 0;
        });
        var hashes = [for (key in sortedKeys) '${key.hash()}:${map.get(key).hash()}'];
        return 'map({${hashes.join(",")}})';
    }
}
