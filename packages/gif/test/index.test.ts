import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { readGIF } from '../src'

describe('gif', () => {
  it('readGIF', () => {
    const file = readFileSync('./simple.gif')
    const data = new Uint8Array(file).buffer
    const gif = readGIF(data)

    expect(gif.count).eq(92)
  })
})
