package language.tokens;

import language.managers.VarManager;

using Lambda;

class BlockToken implements BaseToken extends Value {
	public function new(tokens:Array<BaseToken>) {
		super("block", tokens);
	}

	public function getValue():Value {
		return this;
	}

	public override function eval():Value {
		var tokens:Array<BaseToken> = this.value;
		return tokens.fold((token, _memo) -> token.getValue(), VarManager.unit);
	}
}
