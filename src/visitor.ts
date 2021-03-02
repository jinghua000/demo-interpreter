import { Scope } from './scope'
import * as ES from 'estree'

const BinaryVisitor = {
    '+': (l: any, r: any ) => l + r,
    '-': (l: any, r: any ) => l - r,
    '*': (l: any, r: any ) => l * r,
    '/': (l: any, r: any ) => l / r,
    '%': (l: any, r: any ) => l % r,
    '**': (l: any, r: any ) => l ** r,
    '>': (l: any, r: any ) => l > r,
    '<': (l: any, r: any ) => l < r,
    '>=': (l: any, r: any ) => l >= r,
    '<=': (l: any, r: any ) => l <= r,
    '==': (l: any, r: any ) => l == r,
    '===': (l: any, r: any ) => l === r,
    '!=': (l: any, r: any ) => l != r,
    '!==': (l: any, r: any ) => l === r,
    '|': (l: any, r: any ) => l | r,
    '&': (l: any, r: any ) => l & r,
    '^': (l: any, r: any ) => l ^ r,
    '<<': (l: any, r: any ) => l << r,
    '>>': (l: any, r: any ) => l >> r,
    '>>>': (l: any, r: any ) => l >>> r,
    'in': (l: any, r: any ) => l in r,
    'instanceof': (l: any, r: any ) => l instanceof r,
}

const Visitor = {
    Program(node: ES.Program, scope: Scope) {
        let result: any
        node.body.forEach(child => {
            result = visit(child, scope)
        })
        return result
    },
    ExpressionStatement(node: ES.ExpressionStatement, scope: Scope) {
        return visit(node.expression, scope)
    },
    BinaryExpression(node: ES.BinaryExpression, scope: Scope) {
        return BinaryVisitor[node.operator](
            visit(node.left, scope), 
            visit(node.right, scope)
        )
    },
    Literal(node: ES.Literal) {
        return node.value
    },
}   

export function visit(node: ES.Node, scope: Scope) {
    const method = Visitor[node.type]

    if (!method) {
        throw new Error(`type "${node.type}" is not supported`)
    }

    return method(node, scope)
}