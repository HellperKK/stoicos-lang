package language.tokens;

import language.managers.VarManager;

class StructAccesToken implements BaseToken {
	private var name:String;
	private var properties:Array<String>;
    private var captured: Value;

	public function new(name:String, properties:Array<String>, captured: Value = null) {
		this.name = name;
		this.properties = properties;
		this.captured = captured;
	}

    private function dig(): Value {
		var manager = VarManager.get();
        var value = manager.getVar(name);

        for (property in properties) {
            value = value.request("struct").get(property);
        }

        return value;
    }

	public function getValue():Value {
		var manager = VarManager.get();
        if (manager.hasVar(this.name)) {
            var value = this.dig();

            if (value == null) {
                throw 'Properties ${this.properties.join(".")} not found in ${this.name}';
            }

            return value;
        }

        if (this.captured != null) {
            return this.captured;
        }
        
		throw 'Value ${this.name}.${this.properties.join(".")} not found';
	}

	public function capture() {
        if (this.captured != null) {
            return new StructAccesToken(this.name, this.properties, this.captured);
        }

        try {
            return new StructAccesToken(this.name, this.properties, this.dig());
        }
        catch(e:Dynamic) {
            return new StructAccesToken(this.name, this.properties, this.captured);
        }
	}
}
