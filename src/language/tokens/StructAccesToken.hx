package language.tokens;

import language.managers.VarManager;

class StructAccesToken implements BaseToken {
	private var name:String;
	private var property:String;
    private var captured: Value;

	public function new(name:String, property:String, captured: Value = null) {
		this.name = name;
		this.property = property;
		this.captured = captured;
	}

	public function getValue():Value {
		var manager = VarManager.get();
        if (manager.hasVar(this.name)) {
            var value = manager.getVar(name).request("struct").get(this.property);

            if (value == null) {
                throw 'Property ${this.property} not found in ${this.name}';
            }

            return value;
        }

        if (this.captured != null) {
            return this.captured;
        }
        
		throw 'Value ${this.name} not found';
	}

	public function capture() {
        try {
            return new StructAccesToken(this.name, this.property, VarManager.get().getVarRec(this.name));
        }
        catch(e:Dynamic) {
            return new StructAccesToken(this.name, this.property);
        }
	}
}
