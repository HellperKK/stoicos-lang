package language.tokens;

class ArrayToken extends Value {
    public function new(value: Array<Value>) {
        super("array", value);
    }
}
