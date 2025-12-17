package language.tokens;

class NumberToken implements BaseToken extends Value {
    public function new(value: Float) {
        super("number", value);
    }

    public function getValue():Value {
        return this;
    }

    public function capture() {
        return new NumberToken(this.value);
    }

    public function hash():String {
        return 'number(${this.value})';
    }
}
