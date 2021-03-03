import { Scope } from './scope'
import { state, Ref } from './shared'
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

const AssignVisitor = {
    '=': (l: Ref, r: any) => l.value = r,
    '-=': (l: Ref, r: any) => l.value -= r,
    '+=': (l: Ref, r: any) => l.value += r,
    '*=': (l: Ref, r: any) => l.value *= r,
    '/=': (l: Ref, r: any) => l.value /= r,
    '%=': (l: Ref, r: any) => l.value %= r,
    '**=': (l: Ref, r: any) => l.value **= r,
    '<<=': (l: Ref, r: any) => l.value <<= r,
    '>>=': (l: Ref, r: any) => l.value >>= r,
    '>>>=': (l: Ref, r: any) => l.value >>>= r,
    '&=': (l: Ref, r: any) => l.value &= r,
    '^=': (l: Ref, r: any) => l.value ^= r,
    '|=': (l: Ref, r: any) => l.value |= r,
    '&&=': (l: Ref, r: any) => l.value &&= r,
    '||=': (l: Ref, r: any) => l.value ||= r,
    '??=': (l: Ref, r: any) => l.value ??= r,
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
    VariableDeclaration(node: ES.VariableDeclaration, scope: Scope) {
        state.kind = node.kind
        node.declarations.forEach(child => visit(child, scope))
    },
    VariableDeclarator(node: ES.VariableDeclarator, scope: Scope) {
        if (node.id.type === 'Identifier') {
            const name = node.id.name
            const init = node.init

            if (state.kind === 'let') {

                if (init) {
                    scope.$let(name, visit(init, scope))
                } else {
                    scope.$let(name)
                }

            } else if (state.kind === 'const') {
                scope.$const(name, visit(init, scope))
            } else if (state.kind === 'var') {
                throw new Error(`"var" declaration is not supported`)
            }
        } else {
            throw new Error(`type "${node.id.type}" declaration is not supported`)
        }
    },
    AssignmentExpression(node: ES.AssignmentExpression, scope: Scope) {
        let variable: Ref
        if (node.left.type === 'Identifier') {
            variable = scope.get(node.left.name)

            if (variable.kind === 'const') {
               throw new TypeError('Assignment to constant variable')
            }
        } else {
            throw new Error(`type "${node.left.type}" assignment is not supported`)
        }

        return AssignVisitor[node.operator](
            variable,
            visit(node.right, scope)
        )
    },
    IfStatement(node: ES.IfStatement, scope: Scope) {
        const condition = visit(node.test, scope)
        const { consequent, alternate } = node

        if (condition) {
            return visit(
                consequent, 
                consequent.type === 'BlockStatement' 
                    ? new Scope(scope)
                    : scope
            )
        } else if (alternate) {
            return visit(
                alternate, 
                alternate.type === 'BlockStatement' 
                    ? new Scope(scope)
                    : scope
            )
        }
    },
    BlockStatement(node: ES.BlockStatement, scope: Scope) {
        let result
        const { body } = node
        for (let i = 0; i < body.length; i++) {
            result = visit(body[i], scope)
        }
        return result
    },
    BinaryExpression(node: ES.BinaryExpression, scope: Scope) {
        return BinaryVisitor[node.operator](
            visit(node.left, scope), 
            visit(node.right, scope)
        )
    },
    Identifier(node: ES.Identifier, scope: Scope) {
        return scope.get(node.name).value
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