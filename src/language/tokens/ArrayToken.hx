package language.tokens;

class ArrayToken extends Value {
    public function new(value: Array<Value>) {
        super("array", value);
    }

    public override function request(type:String):Dynamic {
        if (type == "string") {
            return '[${this.value.map(val -> val.request("string")).join(" ")}]';
        }

        return super.request(type);
    }

    public function hash():String {
        var hashes = this.value.map(val -> val.hash());
        return 'array([${hashes.join(",")}])';
    }
}
