import VarManager from "../manager/VarManager"
import BaseToken from "./BaseToken"

export default class BlockToken extends BaseToken {
    public value: Array<BaseToken>

    public constructor(value: Array<BaseToken>) {
        super(value, "block")
    }

    public update() {
        return new BlockToken(this.value.map(tok => tok.update()))
    }

    public calculate() {
        return this.value.reduce((acc, tok) => tok.get(), VarManager.unit)
    }

    public request(type: "block"): Array<BaseToken> {
        return this.value
    }
}