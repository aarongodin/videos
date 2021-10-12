import { retry } from "./retry"

describe('retry', () => {
  it('does not retry if the func does not throw', async () => {
    const impl = jest.fn(() => true)
    await retry(impl, 1000)
    expect(impl).toBeCalledTimes(1)
  })

  it('resolves the return value from the retry target', async () => {
    const expected = { value: 100 }
    const impl = jest.fn(() => expected)
    const result = await retry(impl, 1000)
    expect(result).toEqual(expected)
  })

  it('retries until the target does not throw', async () => {
    let count = 0

    const impl = jest.fn(() => {
      count += 1
      if (count < 5) {
        return Promise.reject(new Error('oops'))
      } else {
        return Promise.resolve(true)
      }
    })

    const result = await retry(impl, 1000)
    expect(count).toBe(5)
    expect(impl).toHaveBeenCalledTimes(5)
    expect(result).toBe(true)
  })
})