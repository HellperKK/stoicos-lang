package language.tokens;

class UnitToken extends Value {
    public function new() {
        super("unit", null);
    }
    
    public override function request(type:String):Dynamic {
        if (type == "string") {
            return 'Unit';
        }

        return super.request(type);
    }

    public function hash():String {
        return "unit";
    }
}
