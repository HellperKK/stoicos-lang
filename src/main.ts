import nearley from "nearley"
import grammar from "./grammar"
import prelude from "./definitions/prelude"
import VarManager from "./manager/VarManager"

const body = document.body

const compileButton = document.createElement("button")
compileButton.innerText = "compile"
body.appendChild(compileButton)
body.appendChild(document.createElement("br"))


const inputArea = document.createElement("textarea")
inputArea.cols = 90
inputArea.rows = 40
inputArea.placeholder = "your code here..."
body.appendChild(inputArea)

const outputArea = document.createElement("textarea")
outputArea.cols = 90
outputArea.rows = 40
outputArea.placeholder = "your result here..."
body.appendChild(outputArea)

compileButton.addEventListener("click", () => {
    outputArea.value = ""
    const stdOut = prelude()

    try {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
        const trees = parser.feed(inputArea.value)
        const results: any[][] = trees.results

        if (results.length == 0) {
            throw new Error("no result")

        }

        /*if (results.length > 1) {
            console.log(results)
            throw new Error("too much results")
        }*/

        results[0].forEach(token => token && token.get())

        outputArea.value = stdOut.content
        console.log(JSON.stringify(results[0], null, 4))
    } catch (error) {
        outputArea.value += "\n\n---------------\n\n" + error.message
        throw error
    }

    VarManager.clean()
})