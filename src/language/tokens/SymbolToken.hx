package language.tokens;

class SymbolToken implements BaseToken extends Value {
    public function new(value: String) {
        super("symbol", value);
    }

    public function getValue():Value {
        return this;
    }

    public function capture() {
        return new SymbolToken(this.value);
    }
}
