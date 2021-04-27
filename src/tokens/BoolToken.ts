import BaseToken from "./BaseToken"

export default class BoolToken extends BaseToken {
    public value: Boolean

    public constructor(value: Boolean) {
        super(value, "bool")
    }

    public request(type: "bool"): Boolean {
        return this.value
    }
}