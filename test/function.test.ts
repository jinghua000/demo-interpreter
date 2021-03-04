import { run } from '../src'

it('function declaration', () => {
    expect(run(
        `
            function aa(a, b) {
                return a + b
            }

            aa(1, 2)
        `
    )).toBe(3)
})

it('function expression', () => {
    expect(run(
        `
            let aa = function(a, b) {
                return a + b
            }

            aa(1, 2)
        `
    )).toBe(3)
})

it('cannot delcare function for many times', () => {
    expect(() => run(
        `
            function aa() {}
            function aa() {}
        `
    )).toThrow(SyntaxError)
})

it('without return will return undefined', () => {
    expect(run(
        `
            function aa(a, b) { a + b }

            aa(1, 2)
        `
    )).toBe(undefined)
})

it('return will break the code executing inside function', () => {
    expect(run(
        `
            function foo() {
                return 'foo'
                return 'bar'
            }

            foo()
        `
    )).toBe('foo')
})

it('nest function return', () => {
    expect(run(
        `
            function foo() {

                function bar (val) {
                    return val + 'bar'
                }
                
                return bar('foo')
            }

            foo()
        `
    )).toBe('foobar')
})

it('nest function return will other blocks', () => {
    expect(run(
        `
            function foo() {

                function bar (val) {
                    if (val) {
                        return val + 'bar'
                    } else {
                        return 
                    }
                }
                
                return bar('foo')
            }

            foo()
        `
    )).toBe('foobar')
})

it('function scope should work correctly', () => {
    expect(run(
        `
            function foo(val) {

                function bar(val) {
                    return val + 'bar'
                }

                return bar(val)
            }

            foo('foo')
        `
    )).toBe('foobar')
})

it('can read the variables outside the current scope', () => {
    expect(run(
        `
            let str = 'bar'
            function foo(val) {

                function bar() {
                    return val + str
                }

                return bar(val)
            }

            foo('foo')
        `
    )).toBe('foobar')
})

it('can read the global function', () => {
    globalThis.id = (v: any) => v
    expect(run(
        `
            id('foo')
        `
    )).toBe('foo')
    delete globalThis.id
})

it('recursion should works', () => {
    expect(run(
        `
            function sum(n) {
                if (n === 1) return 1

                return n + sum(n - 1)
            }

            sum(5)
        `
    )).toBe(15)

})

it('Fib sequence!', () => {
    expect(run(
        `
            function fib(n) {
                if (n < 2) return n 

                return fib(n - 1) + fib(n - 2)
            }

            fib(10)
        `
    )).toBe(55)
})