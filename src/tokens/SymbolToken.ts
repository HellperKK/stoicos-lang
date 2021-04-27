import BaseToken from "./BaseToken"

export default class SymbolToken extends BaseToken {
    public value: String

    public constructor(value: String) {
        super(value, "symbol")
    }

    public request(type: "symbol"): String {
        return this.value
    }
}