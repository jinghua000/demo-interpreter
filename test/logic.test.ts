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