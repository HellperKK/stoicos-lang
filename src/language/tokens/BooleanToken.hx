package language.tokens;

class BooleanToken extends Value {
    public function new(value: Bool) {
        super("boolean", value);
    }
}
