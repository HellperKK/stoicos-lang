import VarManager from "../manager/VarManager"
import ArrayToken from "./ArrayToken"
import BaseToken from "./BaseToken"

export default class ArrayModelToken extends BaseToken {
    public value: Array<BaseToken>

    public constructor(value: Array<BaseToken>) {
        super(value, "arrayModel")
    }

    public update() {
        this.value.forEach(tok => tok.update())
    }

    public get() {
        return new ArrayToken(this.value.map(tok => tok.get()))
    }
}