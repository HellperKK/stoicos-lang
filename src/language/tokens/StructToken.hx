package language.tokens;

class StructToken extends Value {
    public function new(value: Map<String, Value>) {
        super("struct", value);
    }
}
