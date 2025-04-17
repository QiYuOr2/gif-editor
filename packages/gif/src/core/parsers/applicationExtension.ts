import type { IDataReader } from "../reader"
import type { IParser } from "./parser"

const NETSCAPE_IDENTIFIER = "NETSCAPE"
const XMP_IDENTIFIER = "XMP DataXMP"

export abstract class BasicExtension implements IParser {
  identifier: string
  authCode: string
  blockSize: number

  constructor(
    protected readonly reader: IDataReader,
    identifier: string,
    authCode: string,
    blockSize: number
  ) {
    this.identifier = identifier
    this.authCode = authCode
    this.blockSize = blockSize
  }

  abstract parse(): void
}

export class NetscapeExtension extends BasicExtension {
  loopCount: number | null = null

  parse(): void {
    const subBlock = this.reader.readSubBlocks()
    if (subBlock.length >= 3 && subBlock[0] === 1) {
      this.loopCount = subBlock[1] + subBlock[2] * 256
    }
  }

  isVaildIdentifer(): boolean {
    return this.identifier.startsWith(NETSCAPE_IDENTIFIER)
  }
}

class XMPExtension extends BasicExtension {
  data!: Uint8Array

  parse(): void {
    this.data = this.reader.readSubBlocks()
  }

  isVaildIdentifer(): boolean {
    return this.identifier === XMP_IDENTIFIER
  }
}

export class UnknownExtension extends BasicExtension {
  data!: Uint8Array

  parse(): void {
    this.data = this.reader.readSubBlocks()
  }
}


export class ApplicationExtension implements IParser {
  extension!: BasicExtension

  constructor(private readonly reader: IDataReader) {
    this.parse()
  }

  parse(): void {
    const blockSize = this.reader.readByte()
    const appIdBytes = this.reader.readBytes(8)
    const authBytes = this.reader.readBytes(3)

    const identifier = String.fromCharCode(...appIdBytes)
    const authCode = String.fromCharCode(...authBytes)

    if (identifier.startsWith(NETSCAPE_IDENTIFIER)) {
      this.extension = new NetscapeExtension(this.reader, identifier, authCode, blockSize)
    } else if (identifier === XMP_IDENTIFIER) {
      this.extension = new XMPExtension(this.reader, identifier, authCode, blockSize)
    } else {
      this.extension = new UnknownExtension(this.reader, identifier, authCode, blockSize)
    }

    this.extension.parse()
  }
}