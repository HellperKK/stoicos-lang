import VarManager from "../manager/VarManager"
import BaseToken from "../tokens/BaseToken"
import FunToken from "../tokens/FunToken"
import StructToken from "../tokens/StructToken"

const structInit = () => {
    const module = new Map<String, BaseToken>()

    // Building functions
    module.set("make", FunToken.native(toks => {
        const vars = VarManager.get()
        let block = toks[0]
        vars.addStack()
        block = block.update()
        block.calculate()
        const stack = vars.getStack()
        vars.delStack()
        const struct = new Map(Array.from(stack.entries()).map(pair => [pair[0], pair[1].getVal()]))
        return new StructToken(struct)
    }))

    return new StructToken(module)
}

export default structInit