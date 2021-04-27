import BaseToken from "./BaseToken"

export default class NumberToken extends BaseToken {
    public value: Number

    public constructor(value: Number) {
        super(value, "number")
    }

    public request(type: "number"): Number {
        return this.value
    }
}