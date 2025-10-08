package language.tokens;
using StringTools;

class StringToken implements BaseToken extends Value {
    public function new(value: String) {
        super("string", value);
    }

    public function getValue():Value {
        return this;
    }

    public function capture() {
        return new StringToken(this.value);
    }
}
