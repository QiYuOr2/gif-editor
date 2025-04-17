import { byteToBits, type IDataReader } from "../reader";
import type { IParser } from "./parser";

const BLOCK_TERMINATOR = 0x00

export class GraphicControlExtension implements IParser {
  blockSize!: number;
  delayTime!: number;
  transparentColorIndex!: number;
  disposalMethod!: number;
  userInputFlag!: number;
  transparencyFlag!: number;

  constructor(private readonly reader: IDataReader) {
    this.parse()
  }

  parse(): void {
    this.blockSize = this.reader.readByte()
    const packed = this.reader.readByte()
    this.packedField(packed)
    this.delayTime = this.reader.readUint16()
    this.transparentColorIndex = this.reader.readByte()
    const terminator = this.reader.readByte()
    if (terminator !== BLOCK_TERMINATOR) {
      throw new Error("GraphicControlExtension missing block terminator")
    }
  }

  packedField(byte: number) {
    const bits = byteToBits(byte)
    this.disposalMethod = bits[3] * 4 + bits[4] * 2 + bits[5]
    this.userInputFlag = bits[6]
    this.transparencyFlag = bits[7]
  }
}