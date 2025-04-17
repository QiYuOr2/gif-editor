import { ColorTable } from "./parsers/colorTable"
import { GraphicControlExtension } from "./parsers/graphicControlExtension"
import { Header } from "./parsers/header"
import { LogicalScreenDescriptor } from "./parsers/logicalScreenDescriptor"
import type { IDataReader } from "./reader"


export class Decoder {
  private header!: Header
  private logicalScreenDescriptor!: LogicalScreenDescriptor
  private globalColorTable?: ColorTable
  private graphicControlExtension?: GraphicControlExtension

  constructor(private readonly reader: IDataReader) {
    this.header = new Header(this.reader)
    this.logicalScreenDescriptor = new LogicalScreenDescriptor(this.reader)

    if (this.logicalScreenDescriptor.globalColorTableFlag) {
      this.globalColorTable = new ColorTable(this.reader, this.logicalScreenDescriptor.sizeOfGlobalColorTable)
    }
  }
}