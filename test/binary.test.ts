import { run } from '../src'

it('1 + 1 = 2', () => {
    expect(run('1 + 1')).toBe(2)
})