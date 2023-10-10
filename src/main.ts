import nearley from "nearley"
import grammar from "./grammar"
import prelude from "./definitions/prelude"
import VarManager from "./manager/VarManager"
import colorize from "./syntax"

const body = document.body


const gridDiv = document.createElement("div")
gridDiv.classList.add("editor-grid")
body.appendChild(gridDiv)

const compileButton = document.createElement("button")
compileButton.innerText = "run"
compileButton.classList.add("button-run")
gridDiv.appendChild(compileButton)
//body.appendChild(document.createElement("br"))

const editorDiv = document.createElement("div")
editorDiv.classList.add("editor-main")
gridDiv.appendChild(editorDiv)

const inputArea = document.createElement("textarea")
inputArea.placeholder = "your code here..."
inputArea.classList.add("editor-writer")
inputArea.spellcheck = false
editorDiv.appendChild(inputArea)

const renderElement = document.createElement("code")
renderElement.classList.add("editor-render")
editorDiv.appendChild(renderElement)

inputArea.addEventListener("input", function (e) {
    renderElement.innerHTML = ""
    const nodes = colorize(this.value)
    nodes.forEach(node => renderElement.appendChild(node))
})

inputArea.addEventListener("keydown", function (e: KeyboardEvent) {
    if (e.key === "Tab") {
        const ev = new InputEvent("input", {
            inputType: "insertText",
            data: "    ",
            isComposing: false
        })
        this.dispatchEvent(ev)
        e.preventDefault()
    }
})

inputArea.addEventListener("scroll", function (e: UIEvent) {
    renderElement.style.top = `${-this.scrollTop}px`
})

const parentDiv = document.createElement("div")
parentDiv.classList.add("result-modal", "hidden")
parentDiv.addEventListener("mousedown", function () {
    this.classList.add("hidden")
})
body.appendChild(parentDiv)

const outputArea = document.createElement("textarea")
outputArea.spellcheck = false
outputArea.readOnly = true
outputArea.classList.add("result-out")
outputArea.addEventListener("mousedown", function (e) {
    e.stopPropagation()
})
parentDiv.appendChild(outputArea)

compileButton.addEventListener("click", () => {
    outputArea.value = ""

    VarManager.clean()
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
        parentDiv.classList.remove("hidden")
        console.log(JSON.stringify(results[0], null, 4))
    } catch (error) {
        outputArea.value += "\n\n---------------\n\n" + error.message
        throw error
    }

    //console.log(VarManager.get())
})