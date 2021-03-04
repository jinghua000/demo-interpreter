import { run } from '../src'

it('define variable with init', () => {
    expect(run(
        `
            let a = 123

            a
        `
    )).toBe(123)
})

it('define variable without init', () => {
    expect(run(
        `
            let a

            a = 123

            a
        `
    )).toBe(123)
})

it('deined variable default undefined', () => {
    expect(run(
        `
            let a

            a
        `
    )).toBe(undefined)  
})

it('assign to a constant should throw an error', () => {
    expect(() => run(
        `
            const a = 123

            a = 234
        `
    )).toThrow(TypeError)
})

it('can assign to a variable many times', () => {
    expect(run(
        `
            let a 

            a = 1
            a = 2
            a = 3

            a
        `
    )).toBe(3)  
})

it('undefined variable with throw an error', () => {
    expect(() => run(
        `
            id
        `
    )).toThrow(ReferenceError)
})

it('var is not supported', () => {
    expect(() => run(
        `
            var a = 123
        `
    )).toThrow(Error)
})