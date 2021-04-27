import VarManager from "../manager/VarManager"
import BaseToken from "./BaseToken"
import BlockToken from "./BlockToken"

export default class FunToken extends BaseToken {
    public static native(value: (toks: Array<BaseToken>) => BaseToken) {
        return new FunToken(value)
    }

    public static custom(args: Array<BaseToken>, block: BlockToken) {
        return new FunToken(toks => {
            const vars = VarManager.get()
            vars.addStack()
            args.forEach((sym, pos) => vars.setVar(sym.request("symbol"), toks[pos], false))
            block.update()
            const ret = block.calculate()
            vars.delStack()
            return ret
        })
    }

    public value: (toks: Array<BaseToken>) => BaseToken

    public constructor(value: (toks: Array<BaseToken>) => BaseToken) {
        super(value, "fun")
    }

    public call(args: Array<BaseToken>) {
        return this.value(args)
    }

    public compare(other: BaseToken) {
        return 0
    }
}