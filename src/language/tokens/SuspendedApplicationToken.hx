package language.tokens;

import language.managers.VarManager;

class SuspendedApplicationToken implements BaseToken {
    private var value: BaseToken;

	public function new(value:BaseToken) {
		this.value = value;
	}

	public function getValue():Value {
		return new FunctionToken(args -> {
            return new FunctionToken( argsBis -> this.value.getValue().call(args.concat(argsBis)), -1);
        }, -1);
	}

	public function capture() {
        return new SuspendedApplicationToken(this.value.capture());
	}
}
