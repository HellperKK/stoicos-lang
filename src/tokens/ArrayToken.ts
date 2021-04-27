import VarManager from "../manager/VarManager"
import BaseToken from "./BaseToken"

export default class ArrayToken extends BaseToken {
    public value: Array<BaseToken>

    public constructor(value: Array<BaseToken>) {
        super(value, "array")
    }

    public update() {
        this.value.forEach(tok => tok.update())
    }

    public request(type: "array"): Array<BaseToken> {
        return this.value
    }
}