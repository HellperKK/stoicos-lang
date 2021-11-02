import VarManager from "../manager/VarManager"
import ArrayToken from "../tokens/ArrayToken"
import BaseToken from "../tokens/BaseToken"
import FunToken from "../tokens/FunToken"
import StructToken from "../tokens/StructToken"
import SymbolToken from "../tokens/SymbolToken"

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

    // Getters functions
    module.set("keys", FunToken.native(toks => {
        let struct = toks[0].request("struct")

        return new ArrayToken(struct.keys().map(key => new SymbolToken(key)))
    }))

    module.set("values", FunToken.native(toks => {
        let struct = toks[0].request("struct")

        return new ArrayToken(struct.values())
    }))

    module.set("entries", FunToken.native(toks => {
        let struct = toks[0].request("struct")

        return new ArrayToken(Array.from(struct.entries().map(pair => [new SymbolToken(pair[0]), pair[1]])))
    }))

    module.set("get", FunToken.native(toks => {
        let key = toks[0].request("symbol")
        let struct = toks[1].request("struct")

        return struct.get(key)
    }))

    module.set("set", FunToken.native(toks => {
        let key = toks[0].request("symbol")
        let value = toks[1]
        let struct = toks[2].request("struct")

        let newSruct: Map<string, BaseToken> = new Map(struct.entries())
        newSruct.set(key, value)

        return new StructToken(newSruct)
    }))

    module.set("set_fun", FunToken.native(toks => {
        let key = toks[0].request("symbol")
        let value = toks[1]
        let struct = toks[2].request("struct")

        let newSruct: Map<string, BaseToken> = new Map(struct.entries())
        newSruct.set(key, value.call([struct.get(key)]))

        return new StructToken(newSruct)
    }))

    return new StructToken(module)
}

export default structInit