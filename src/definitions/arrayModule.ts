import { isTemplateExpression } from "typescript"
import VarManager from "../manager/VarManager"
import ArrayToken from "../tokens/ArrayToken"
import BaseToken from "../tokens/BaseToken"
import FunToken from "../tokens/FunToken"
import StructToken from "../tokens/StructToken"
import NumberToken from "../tokens/NumberToken"

const arrayInit = () => {
    //const vars = VarManager.get()
    const module = new Map<String, BaseToken>()

    // Building functions
    module.set("make", FunToken.native(toks => {
        const size = toks[0].request("number")
        const item = toks[1]
        return new ArrayToken(Array(size).fill(item))
    }))
    module.set("make_fun", FunToken.native(toks => {
        const size = toks[0].request("number")
        const fun = toks[1]
        return new ArrayToken(Array(size).fill(null).map((_item, index) => fun.call([new NumberToken(index)])))
    }))
    module.set("make_range", FunToken.native(toks => {
        const min = toks[0].request("number")
        const max = toks[1].request("number")
        const range = max - min
        return new ArrayToken(Array(range).fill(null).map((_item, index) => new NumberToken(index + min)))
    }))
    module.set("singleton", FunToken.native(toks => {
        const item = toks[0]
        return new ArrayToken([item])
    }))

    // Update functions
    module.set("update", FunToken.native(toks => {
        const index = toks[0].request("number")
        const item = toks[1]
        const arr = toks[2].request("array")
        const newArr = arr.slice()
        newArr[index] = item
        return new ArrayToken(newArr)
    }))
    module.set("update_fun", FunToken.native(toks => {
        const index = toks[0].request("number")
        const item = toks[1]
        const arr = toks[2].request("array")
        const newArr = arr.slice()
        newArr[index] = item.call([newArr[index]])
        return new ArrayToken(newArr)
    }))

    // Assigning
    // vars.setVar("Array", new StructToken(module), true)
    return new StructToken(module)
}

export default arrayInit