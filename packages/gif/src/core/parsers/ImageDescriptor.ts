import { byteToBits, type IDataReader } from "../reader";
import type { IParser } from "./parser";

export class ImageDescriptor implements IParser {
  left!: number
  top!: number
  width!: number
  height!: number

  localColorTableFlag!: number
  interlaceFlag!: number
  sortFlag!: number
  sizeOfLocalColorTable!: number

  constructor(private readonly reader: IDataReader) {
    this.parse()
  }

  parse(): void {
    this.left = this.reader.readUint16()
    this.top = this.reader.readUint16()
    this.width = this.reader.readUint16()
    this.height = this.reader.readUint16()

    const packed = this.reader.readByte()
    this.packedField(packed)
  }

  packedField(byte: number) {
    const bits = byteToBits(byte)
    this.localColorTableFlag = bits[0]
    this.interlaceFlag = bits[1]
    this.sortFlag = bits[2]

    const sizeCode = bits[5] * 4 + bits[6] * 2 + bits[7]
    this.sizeOfLocalColorTable = 2 ** (sizeCode + 1)
  }
}