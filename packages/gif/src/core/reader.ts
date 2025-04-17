export interface IDataReader {
  offset: number
  readByte(): number
  readUint16(): number
  readBytes(length: number): Uint8Array
  readSubBlocks(): Uint8Array
}

export class BufferReader implements IDataReader {
  offset = 0
  constructor(private readonly view: DataView) {}

  readByte(): number {
    return this.view.getUint8(this.offset++)
  }

  readUint16(): number {
    const val = this.view.getUint16(this.offset, true)
    this.offset += 2
    return val
  }

  readBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
      bytes[i] = this.readByte()
    }
    return bytes
  }

  readSubBlocks(): Uint8Array {
    const chunks: number[] = []
    while (true) {
      const size = this.readByte()
      if (size === 0) break
      for (let i = 0; i < size; i++) {
        chunks.push(this.readByte())
      }
    }
    return new Uint8Array(chunks)
  }
}

/**
 * 将一个 0-255 的 byte 转为 8 位 bit 数组（高位在前）\
 * 例如：0b10110000 → [1, 0, 1, 1, 0, 0, 0, 0]
 */
export function byteToBits(byte: number): number[] {
  const bits: number[] = []
  for (let i = 7; i >= 0; i--) {
    bits.push((byte >> i) & 1)
  }
  return bits
}