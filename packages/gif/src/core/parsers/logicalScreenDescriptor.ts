import { byteToBits, type IDataReader } from "../reader";
import type { IParser } from "./parser";

export class LogicalScreenDescriptor implements IParser {
  width!: number;
  height!: number;
  backgroundColorIndex!: number;
  pixelAspectRatio!: number;

  // packed field
  globalColorTableFlag!: number;
  colorResolution!: number;
  sortFlag!: number
  sizeOfGlobalColorTable!: number;

  constructor(private readonly reader: IDataReader) {
    this.parse()
  }

  parse() {
    this.width = this.reader.readUint16()
    this.height = this.reader.readUint16()
   
    const packed = this.reader.readByte()
    this.packedField(packed)
    
    this.backgroundColorIndex = this.reader.readByte()
    this.pixelAspectRatio = this.reader.readByte()
  }

  packedField(byte: number) {
    const bits = byteToBits(byte)
    this.globalColorTableFlag = bits[0] // bit 7
    this.colorResolution = bits[1] * 4 + bits[2] * 2 + bits[3] + 1 // bits 6-4
    this.sortFlag = bits[4] // bit 3
    const sizeCode = bits[5] * 4 + bits[6] * 2 + bits[7] // bits 2-0
    this.sizeOfGlobalColorTable = 2 ** (sizeCode + 1)
  }
}