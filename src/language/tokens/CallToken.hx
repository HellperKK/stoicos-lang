package language.tokens;

class CallToken implements BaseToken {
    private var tokens:Array<BaseToken>;

    public function new(tokens:Array<BaseToken>) {
        this.tokens = tokens;
    }

    public function getValue():Value {
        if (tokens.length == 0) {
            throw 'missing function from functin call';
        }

        var values = this.tokens.map(token -> token.getValue());
        
        var f = values.shift();
        return f.call(values);
    }
}