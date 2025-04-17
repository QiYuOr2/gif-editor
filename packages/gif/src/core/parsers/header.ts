import { message, StatusType } from "../../utils/error"
import type { IDataReader } from "../reader"
import type { IParser } from "./parser"

const SIGNATURE = [0x47, 0x49, 0x46] // GIF
const VERSIONS = [
  [0x38, 0x39, 0x61], // 89a
  [0x38, 0x37, 0x61] // 87a
]

export class Header implements IParser {
  signature!: Uint8Array<ArrayBufferLike>
  version!: Uint8Array<ArrayBufferLike>

  constructor(private readonly reader: IDataReader) {
    this.parse()
    if (!this.isValid()) {
      throw new Error(message(StatusType.DecodeError, 'header is not valied'))
    }
  }

  parse() {
    this.signature = this.reader.readBytes(3)
    this.version = this.reader.readBytes(3)
  }

  isValid(): boolean {
    return (
      SIGNATURE.every((byte, index) => byte === this.signature[index]) &&
      VERSIONS.some(version =>
        version.every((byte, index) => byte === this.version[index])
      )
    )
  }

  is(version: '89a' | '87a') {
    if (version === '89a') {
      return this.version[1] === VERSIONS[0][1]
    }
    return this.version[1] === VERSIONS[1][1]
  }
}
