import { run } from '../src'

it('if true', () => {
    expect(run(
        `
            if(true) {
                123
            } else {
                234
            }
        `
    )).toBe(123)
})

it('if false', () => {
    expect(run(
        `
            if(false) {
                123
            } else {
                234
            }
        `
    )).toBe(234)
})

it('nesting if', () => {
    expect(run(
        `
            let a = 3

            if(a === 1) {
                123
            } else if (a === 2) {
                234
            } else if (a === 3) {
                345
            }
        `
    )).toBe(345)

})

it('&&', () => {
    expect(run(
        `
            let a = 1

            a && 2
        `
    )).toBe(2)
})

it('||', () => {
    expect(run(
        `
            let a = 1

            a || 2
        `
    )).toBe(1)
})

it('&& + ||', () => {
    expect(run(
        `
            let a = 1

            a && 2 && 3 || 4
        `
    )).toBe(3)
})

it('??', () => {
    expect(run(
        `
            let a = 0

            a ?? 1
        `
    )).toBe(0)

    expect(run(
        `
            let a

            a ?? 1
        `
    )).toBe(1)
})

it(' ? : ', () => {
    expect(run(
        `
            1 ? 1 : 2
        `
    )).toBe(1)

    expect(run(
        `
            0 ? 1 : 2
        `
    )).toBe(2)
})
