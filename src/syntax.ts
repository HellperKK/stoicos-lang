const tokener = (type, content) => {
    const span = document.createElement("span")
    span.classList.add(`token-${type}`)
    span.appendChild(document.createTextNode(content))
    return span
}

const colorize = code => {
    const children = []
    const rule = /(;.*)|("(?:[^"]|\\")*")|(:[A-Za-z_][A-Za-z0-9_]*)|([A-Za-z_][A-Za-z0-9_]*)|([!%&*+.\/<=>?^|\-~:]+)|(\d+\.?\d*)|(\n)|([^ ]+?)|( +?)/g
    // code = code.replace(/\t+/g, code => " ".repeat(code.length * 4))
    code.replace(rule, (...args) => {
        if (args[1]) children.push(tokener("comment", args[1]))
        if (args[2]) children.push(tokener("string", args[2]))
        if (args[3]) children.push(tokener("symbol", args[3]))
        if (args[4]) children.push(tokener("ident", args[4]))
        if (args[5]) children.push(tokener("operator", args[5]))
        if (args[6]) children.push(tokener("number", args[6]))
        if (args[7]) children.push(document.createElement("br"))
        if (args[8]) children.push(tokener("neutral", args[8]))
        if (args[9]) children.push(tokener("space", ".".repeat(args[9].length)))
        return ""
    })
    return children
}

export default colorize