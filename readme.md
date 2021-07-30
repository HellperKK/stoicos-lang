# stoicos-lang

## definition

The stoicos language is an interpreted, functionnal, imperative and object-oriented programming language.
It is inspired from many programming languages such as :
- OCaml
- Python
- Ruby
- Racket
- Elixir
- Elm
- IO

and probably other that I'm not currently remembering.

## examples

Here are a few examples of what it can do

```
; The good old hello world
(println "Hello world!")

; Defines a variable named age
(def :age 42)

; Defines a function that does an equation then prints it
(deffun :squared [:x] {(* x x)})
(println (squared 12)) ; 144

; Functions can also be defined like that
; It is however more verbose
(def :squared (fun  [:x] {(* x x)}))
(println (squared 12)) ; 144
```

You can find more detailed examples in `examples`
