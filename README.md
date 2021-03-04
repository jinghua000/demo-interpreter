# demo-interpreter

## Introduction

A demo JavaScript interpreter.

## Features

**Only Support Features Below**

- let - only Identifier
- const - only Identifier
- function (function declaration treated as const declaration, params only support Identifier)
- if / else if / else
- binary expression
- assignment expression

## Example

Can run like this:

```js
import { run } from '../src'

run(
    `
        function fib(n) {
            if (n < 2) return n 

            return fib(n - 1) + fib(n - 2)
        }

        fib(10)
    `
) // => 55
```

## Tests

Run `yarn test`.
