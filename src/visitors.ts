import { Ref } from './shared'

export const BinaryVisitor = {
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

export const AssignVisitor = {
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

export const UpdateVisitor = {
    '++': (ref: Ref, prefix: boolean) => prefix ? ++ref.value : ref.value++,
    '--': (ref: Ref, prefix: boolean) => prefix ? --ref.value : ref.value--,
}

export const LogicVisitor = {
    '&&': (left: any, right: any) => left && right,
    '||': (left: any, right: any) => left || right,
    '??': (left: any, right: any) => left ?? right,
}