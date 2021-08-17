import VarManager from "../manager/VarManager"
import BaseToken from "./BaseToken"

export default class VarToken extends BaseToken {
    public current: BaseToken
    public value: String

    public constructor(value: any) {
        super(value, "var")
        this.current = VarManager.unit
    }

    public get() {
        let manager = VarManager.get()
        if (manager.hasVar(this.value)) {
            return manager.getVar(this.value)
        } else {
            return this.current
        }
    }

    public update() {
        try {
            const newVar = new VarToken(this.value)
            newVar.current = VarManager.get().getVar(this.value)
            return newVar
        } catch (error) { 
            return this
        }
    }
}