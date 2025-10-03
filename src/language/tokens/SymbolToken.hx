package language.tokens;

class SymbolToken implements BaseToken extends Value {
    public function new(value: String) {
        super("symbol", value);
    }

    public function getValue():Value {
        return this;
    }
}
