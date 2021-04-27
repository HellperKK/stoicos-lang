import BaseToken from "./BaseToken"

export default class StructToken extends BaseToken {
    public value: Map<String, BaseToken>

    public constructor(value: Map<String, BaseToken>) {
        super(value, "struct")
    }

    public request(type: "struct"): Map<String, BaseToken> {
        return this.value
    }
}