import { isTemplateExpression } from "typescript"
import StringToken from "../tokens/StringToken"
import ArrayToken from "../tokens/ArrayToken"
import BaseToken from "../tokens/BaseToken"
import FunToken from "../tokens/FunToken"
import StructToken from "../tokens/StructToken"
import NumberToken from "../tokens/NumberToken"
import BoolToken from "../tokens/BoolToken"

const stringInit = () => {
    const module = new Map<String, BaseToken>()

    // Building functions
    module.set("make", FunToken.native(toks => {
        const size = toks[0].request("number")
        const item = toks[1].request("string")
        return new StringToken(item.repeat(size))
    }))
    module.set("make_fun", FunToken.native(toks => {
        const size = toks[0].request("number")
        const fun = toks[1]
        const str = (
            Array(size)
                .fill(null)
                .map((_item, index) => fun.call([new NumberToken(index)]).request("string"))
                .join("")
        )
        return new StringToken(str)
    }))

    // Extracting functions
    module.set("get", FunToken.native(toks => {
        const ind = toks[0].request("number")
        const str: String = toks[1].request("string")
        return new StringToken(str[ind])
    }))
    module.set("slice", FunToken.native(toks => {
        const min = toks[0].request("number")
        const max = toks[1].request("number")
        const str: String = toks[2].request("string")
        return new StringToken(str.slice(min, max))
    }))
    module.set("sub", FunToken.native(toks => {
        const min = toks[0].request("number")
        const len = toks[1].request("number")
        const str: String = toks[2].request("string")
        return new StringToken(str.slice(min, min + len))
    }))

    // Other functions
    module.set("split", FunToken.native(toks => {
        const sep = toks[0].request("string")
        const str: String = toks[1].request("string")
        const strs = str.split(sep).map(str => new StringToken(str))
        return new ArrayToken(strs)
    }))

    return new StructToken(module)
}

export default stringInit