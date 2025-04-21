import type { IDataReader } from "../reader"
import type { IParser } from "./parser"
import { LZW } from "../lzw"

export class ImageData implements IParser {
  lzwMinimumCodeSize!: number
  compressedData!: Uint8Array

  constructor(private readonly reader: IDataReader) {
    this.parse()
  }

  parse(): void {
    this.lzwMinimumCodeSize = this.reader.readByte()
    this.compressedData = this.reader.readSubBlocks()
  }

  getCompressedStream(): Uint8Array {
    return this.compressedData
  }

  getCodeSize(): number {
    return this.lzwMinimumCodeSize
  }
}
