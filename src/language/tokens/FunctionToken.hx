package language.tokens;

class FunctionToken extends Value {
    public var arity: Int;
    public function new(value: (Array<Value>) -> Value, arity: Int) {
        super("function", value);
        this.arity = arity;
    }

    public override function call(args:Array<Value>):Value {
        return this.value(args);
    }
}
