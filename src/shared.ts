export type Kind = 'var' | 'let' | 'const'
export interface Ref {
    value: any
    kind: Kind
}
export function ref(value: any, kind: Kind): Ref {
    return { value, kind }
}