package language.tokens;

class BooleanToken extends Value {
    public function new(value: Bool) {
        super("boolean", value);
    }

    public function hash():String {
        return 'boolean(${this.value})';
    }

    public override function toJsonValue(): Dynamic {
        return this.value;
	}
}
