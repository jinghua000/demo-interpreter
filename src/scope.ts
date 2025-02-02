import { ref, Ref } from './shared'

export class Scope {
    parent: Scope
    store: Map<string, Ref>

    constructor(parent?: Scope) {
        this.parent = parent || createGlobalScope()
        this.store = new Map()
    }

    get(name: string): Ref {
        if (this.store.has(name)) {
            return this.store.get(name)
        } else {
            return this.parent.get(name)
        }
    }
    
    $var() {
        throw new Error(`"var" declaration is not supported`)
    }
    
    $let(name: string, value?: any) {
        this._check(name)
        this.store.set(name, ref(value, 'let'))
    }

    $const(name: string, value: any) {
        this._check(name)
        this.store.set(name, ref(value, 'const'))
    }

    _check(name: string) {
        if (this.store.has(name)) {
            throw new SyntaxError(`${name} has already been declared`)
        }
    }
}

function createGlobalScope() {
    return {
        get(name: string): Ref {
            if (name in globalThis) {
                return ref(globalThis[name], 'let')
            } else {
                const msg = `${name} is not defined`
                throw new ReferenceError(msg)
            }
        }
    } as Scope
}