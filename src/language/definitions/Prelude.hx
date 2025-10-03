package language.definitions;

import language.tokens.FunctionToken;
import language.managers.VarManager;

class Prelude {
    public static function load() {
        var manager = VarManager.get();

        manager.setVar("println", new FunctionToken((values) -> {
            Sys.println(values[0].request("string"));
            return VarManager.unit;
        }, 1));
    }
}