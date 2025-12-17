package language.tokens;

import language.managers.VarManager;

class FunctionToken extends Value {
	public static function customFunction(params: Array<String>, blocks: Array<BaseToken>) {
		var capturedBlock = new BlockToken(blocks.map(tok -> tok.capture()));
		return (values:Array<Value>) -> {
			var manager = VarManager.get();

			manager.addStack();

			for (pair in params.keyValueIterator()) {
				manager.setVar(pair.value, values[pair.key]);
			}

			var result = capturedBlock.eval();

			manager.delStack();

			return result;
		}
	}

	public var arity:Int;

	public function new(value:(Array<Value>) -> Value, arity:Int) {
		super("function", value);
		this.arity = arity;
	}

	public override function call(args:Array<Value>):Value {
		return this.value(args);
	}

	public function hash():String {
		return 'function';
	}
}
