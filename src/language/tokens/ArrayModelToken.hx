package language.tokens;

class ArrayModelToken implements BaseToken {
    private var tokens:Array<BaseToken>;

    public function new(tokens:Array<BaseToken>) {
        this.tokens = tokens;
    }

    public function getValue():Value {
        return new ArrayToken(tokens.map(token -> token.getValue()));
    }
}