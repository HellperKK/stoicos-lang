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
}
