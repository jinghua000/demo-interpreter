import * as ES from 'estree'
import { Scope } from './scope'
import { state, callstack, Ref } from './shared'
import { 
    BinaryVisitor, 
    AssignVisitor, 
    UpdateVisitor,
    LogicVisitor,
} from './visitors'

function createFunction(node: ES.BaseFunction, scope: Scope) {
    return function (...args: any) {
        const { params, body } = node
        const newScope = new Scope(scope)

        params.forEach((param, index) => {
            if (param.type === 'Identifier') {
                newScope.$let(param.name, args[index])
            } else {
                throw new Error(`type "${param.type}" params is not supported`)
            }
        })

        return visit(body, newScope)
    }   
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
    CallExpression(node: ES.CallExpression, scope: Scope) {
        const { callee } = node
        let result: any

        if (callee.type === 'Identifier') {
            const name = callee.name
            const params = node.arguments.map(param => visit(param, scope))
            callstack.push({})
            result = scope.get(name).value(...params)
            callstack.pop()
        } else {
            throw new Error(`type "${callee.type}" callee is not supported`)
        }

        return result
    },
    ReturnStatement(node: ES.ReturnStatement, scope: Scope) {
        callstack.current && (callstack.current.return = true)
        return visit(node.argument, scope)
    },
    FunctionDeclaration(node: ES.FunctionDeclaration, scope: Scope) {
        scope.$const(node.id.name, createFunction(node, scope))
    },
    FunctionExpression(node: ES.FunctionExpression, scope: Scope) {
        return createFunction(node, scope)
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
                scope.$var()
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
    UpdateExpression(node: ES.UpdateExpression, scope: Scope) {
        if (node.argument.type === 'Identifier') {
            return UpdateVisitor[node.operator](
                scope.get(node.argument.name),
                node.prefix
            )
        } else {
            throw new Error(`type "${node.argument.type}" update expresssion is not supported`)
        }
    },
    LogicalExpression(node: ES.LogicalExpression, scope: Scope) {
        return LogicVisitor[node.operator](
            visit(node.left, scope),
            visit(node.right, scope),
        )
    },
    ConditionalExpression(node: ES.ConditionalExpression, scope: Scope) {
        return visit(node.test, scope) 
            ? visit(node.consequent, scope)
            : visit(node.alternate, scope)
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
        let result: any
        const { body } = node
        for (let i = 0; i < body.length; i++) {
            result = visit(body[i], scope)

            if (callstack.current && callstack.current.return) {
                return result
            }
        }

        if (!callstack.current) {
            return result
        }
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