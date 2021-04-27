import BaseToken from "./BaseToken"

export default class StringToken extends BaseToken {
    public value: String

    public constructor(value: String) {
        super(value, "string")
    }

    public request(type: "string"): String {
        return this.value
    }
}