package utils;

import language.tokens.BooleanToken;
import haxe.Json;
import language.managers.VarManager;
import language.tokens.NumberToken;
import language.tokens.StringToken;
import language.tokens.ArrayToken;
import language.tokens.StructToken;
import language.Value;

class JsonUtils {
    public static function parseJson(content: String) {
        return toValue(Json.parse(content));
    }

    public static function toValue(v: Dynamic):Value {
        if (Std.isOfType(v, Array)) {
            return new ArrayToken(v.map(toValue));
        }

        if (Std.isOfType(v, String)) {
            return new StringToken(v);
        }

        if (Std.isOfType(v, Int)) {
            return new NumberToken(cast v);
        }

        if (Std.isOfType(v, Float)) {
            return new NumberToken(v);
        }

        if (Std.isOfType(v, Bool)) {
            return new BooleanToken(v);
        }

        if (v == null) {
            return VarManager.unit;
        }

        if (Reflect.isObject(v)) {
            var fields = Reflect.fields(v);
            var struct = new Map<String, Value>();

            for (field in fields) {
                struct.set(field, toValue(Reflect.field(v, field)));
            }

            return new StructToken(struct);
        }

        throw 'Unsupported value ${v}';
    }
}