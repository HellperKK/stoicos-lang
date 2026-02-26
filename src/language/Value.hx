package language;

import utils.Hashable;
using StringTools;

abstract class Value implements Hashable {
	private var type:String;
	public var value:Dynamic;

	public function new(type:String, value:Dynamic) {
		this.type = type;
		this.value = value;
	}

	public function eval() {
		return this;
	}

	public function request(type:String):Dynamic {
		if (type == 'string') {
			return Std.string(this.value);
		}

		if (type != this.type) {
			throw 'type ${this.type} can\'t be converted into ${type}';
		}

		return this.value;
	}

	public function compare(otherValue:Value) {
		if (this.type > otherValue.type) {
			return 1;
		}

		if (this.type < otherValue.type) {
			return -1;
		}

		if (this.value > otherValue.value) {
			return 1;
		}

		if (this.value < otherValue.value) {
			return -1;
		}

		return 0;
	}

	public function call(args:Array<Value>):Value {
		throw 'can\'t call a non function type like ${this.type}';
	}
}
