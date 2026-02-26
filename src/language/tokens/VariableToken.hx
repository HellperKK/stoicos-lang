package language.tokens;

import language.managers.VarManager;

class VariableToken implements BaseToken {
    private var name:String;
    private var captured: Value;

    public function new(name:String, captured: Value = null) {
        this.name = name;
        this.captured = captured;
    }

    public function getValue():Value {
        var manager = VarManager.get();

        if (manager.hasVar(this.name)) {
            return manager.getVar(name);
        }

        if (this.captured != null) {
            return this.captured;
        }
        
		throw 'Value ${this.name} not found';
    }

    public function capture() {
        if (this.captured != null) {
            return new VariableToken(this.name, this.captured);
        }

        try {
            return new VariableToken(this.name, VarManager.get().getVarRec(this.name));
        }
        catch(e:Dynamic) {
            return new VariableToken(this.name, this.captured);
        }
    }
}