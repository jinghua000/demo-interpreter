import { parse } from 'acorn'
import { visit } from './visitor'
import { Scope } from './scope'
import { Node } from 'estree'

export function run(code: string) {
    const ast = parse(code, {
        ecmaVersion: 2020
    })

    return visit(ast as Node, new Scope())
}