import { run } from '../src'

it('1 + 1 = 2', () => {
    expect(run('1 + 1')).toBe(2)
})

it('++', () => {
    expect(run(
        `
            let a = 1
            a++
        `
    )).toBe(1)

    expect(run(
        `
            let a = 1
            ++a
        `
    )).toBe(2)
})

it('--', () => {
    expect(run(
        `
            let a = 1
            a--
        `
    )).toBe(1)

    expect(run(
        `
            let a = 1
            --a
        `
    )).toBe(0)
})