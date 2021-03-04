export type Kind = 'var' | 'let' | 'const'

export interface Ref {
    value: any
    kind: Kind
}

export function ref(value: any, kind: Kind): Ref {
    return { value, kind }
}

interface FunctionObject {
    return?: boolean
}

interface CallStack {
    readonly stack: FunctionObject[]
    readonly push: (obj: FunctionObject) => void
    readonly pop: () => void
    readonly current: FunctionObject | void
}

interface State {
    kind: Kind
}

export const callstack: CallStack = {
    stack: [],
    push(obj: FunctionObject) {
        this.stack.push(obj)
    },
    pop() {
        this.stack.pop()
    },
    get current() {
        return this.stack[this.stack.length - 1]
    }
}

/**
 * current state
 */
export const state: State = {
    kind: 'let',
}