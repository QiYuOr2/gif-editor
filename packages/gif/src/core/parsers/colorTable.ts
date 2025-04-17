import type { IDataReader } from "../reader";
import type { IParser } from "./parser";

type RGB = [number, number, number]

export class ColorTable implements IParser {
  colors!: RGB[]
  constructor(
    private readonly reader: IDataReader,
    private readonly size: number
  ) {
    this.parse()
  }

  parse(): void {
    this.colors = []

    for (let i = 0; i < this.size; i++) {
      const r = this.reader.readByte()
      const g = this.reader.readByte()
      const b = this.reader.readByte()
      this.colors.push([r, g, b])
    }
  }

  getColor(index: number): RGB {
    return this.colors[index] ?? [0, 0, 0]
  }
}