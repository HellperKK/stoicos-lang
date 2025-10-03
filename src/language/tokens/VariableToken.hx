package language.tokens;

import language.managers.VarManager;

class VariableToken implements BaseToken {
    private var name:String;

    public function new(name:String) {
        this.name = name;
    }

    public function getValue():Value {
        return VarManager.get().getVar(this.name);
    }
}