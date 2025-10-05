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
            var struct: Map<String, Value> = manager.getVar(name).request("struct");
            var value = struct.get(this.property);

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
		    var manager = VarManager.get();
            var struct: Map<String, Value> = manager.getVarRec(name).request("struct");
            return new StructAccesToken(this.name, this.property, struct.get(this.property));
        }
        catch(e:Dynamic) {
            return new StructAccesToken(this.name, this.property);
        }
	}
}
