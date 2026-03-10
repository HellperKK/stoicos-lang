package language.tokens;

import cpp.Function;
import language.managers.VarManager;

class StructMethodToken implements BaseToken {
	private var name:String;
	private var property:String;
    private var captured: Value;
    private var instance: Value;

	public function new(name:String, property:String, instance: Value = null, captured: Value = null) {
		this.name = name;
		this.property = property;
		this.captured = captured;
		this.instance = instance;

	}

	public function getValue():Value {
		var manager = VarManager.get();
        if (manager.hasVar(this.name)) {
            var instanceValue: Value = manager.getVarRec(name);
            var struct: Map<String, Value> = instanceValue.request("struct");
            var value = struct.get(this.property);

            if (value == null) {
                throw 'Property ${this.property} not found in ${this.name}';
            }

            return buildFunction(instanceValue, value);
        }

        if (this.captured != null) {
            return buildFunction(this.instance, this.captured);
        }
        
		throw 'Value ${this.name}.${this.property} not found';
	}

	public function capture() {
        if (this.captured != null) {
            return new StructMethodToken(this.name, this.property, this.instance, this.captured);
        }

        try {
		    var manager = VarManager.get();
            var instanceValue: Value = manager.getVarRec(name);
            trace(instanceValue);
            var struct: Map<String, Value> = instanceValue.request("struct");
            return new StructMethodToken(this.name, this.property, instanceValue, struct.get(this.property));
        }
        catch(e:Dynamic) {
            return new StructMethodToken(this.name, this.property, this.instance, this.captured);
        }
	}

    private function buildFunction(instance: Value, value: Value) {
        return new FunctionToken((args) -> {
            var realArgs = [instance].concat(args);
            return value.call(realArgs);
        }, 0);
    }
}
