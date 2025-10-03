package language.tokens;

class NumberToken implements BaseToken extends Value {
    public function new(value: Float) {
        super("number", value);
    }

    public function getValue():Value {
        return this;
    }
}
