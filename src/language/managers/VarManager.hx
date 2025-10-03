package language.managers;

import language.tokens.UnitToken;
import language.tokens.BaseToken;

using Lambda;

class VarManager {
	private static var instance:VarManager;

	public static var unit = new UnitToken();

	public static function get() {
		if (VarManager.instance == null) {
			VarManager.instance = new VarManager();
		}

		return VarManager.instance;
	}

	public static function clean() {
		VarManager.instance = new VarManager();
	}

	private var dicts:Array<Map<String, Value>>;

	private function new() {
		this.dicts = [new Map<String, Value>()];
	}

	public function hasVar(name:String) {
		return this.dicts[0].exists(name);
	}

	/*
		public function typeVar(name: String, type: Type) {
			if (this.dicts[0].exists(name)) {
				this.dicts[0].get(name)?.setType(type);
			} else {
				this.dicts[0].set(name, new Var(VarManager.unit, false, type));
			}
		}
	 */
	public function setVar(name:String, value:Value, cons:Bool = true) {
		this.dicts[0].set(name, value);
	}

	public function setAlias(name:String, alias:String) {
		var token = this.dicts[0].get(name);

		if (token == null) {
			throw 'Value ${name} not found';
		}

		return this.dicts[0].set(alias, token);
	}

	public function getVar(name:String):Value {
		var token = this.dicts[0].get(name);

		return token;
	}

	public function getVarRec(name:String):Value {
		var token = this.dicts.find((d) -> d.exists(name));

		if (token == null) {
			/*
				var suggestions = didYouMean(name, this.getLocalNames(), {
					returnType: ReturnTypeEnums.ALL_SORTED_MATCHES,
				});
			 */
			throw 'Value ${name} not found';
		}

		return token.get(name);
	}

	public function delete(name:String) {
		if (this.dicts[0].exists(name)) {
			this.dicts[0].remove(name);
		}

		throw 'Value ${name} can\'t be removed';
	}

	public function addStack() {
		if (this.dicts.length >= 5000)
			throw "Max stack reached";

		this.dicts.unshift(new Map<String, Value>());
	}

	public function delStack() {
		if (this.dicts.length <= 1)
			throw "Min stack reached";
		return this.dicts.shift();
	}

	public function getStack() {
		return this.dicts[0];
	}
	/*
		public function getLocalNames() {
			return Array.from(this.dicts[0].keys());
		}
	 */
}
