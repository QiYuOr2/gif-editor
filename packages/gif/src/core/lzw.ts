export class LZW {
  private data: Uint8Array;
  private minCodeSize: number;
  private pos = 0;
  private bitBuffer = 0;
  private bitLength = 0;

  constructor(data: Uint8Array, minCodeSize: number) {
    this.data = data;
    this.minCodeSize = minCodeSize;
  }

  decode(): number[] {
    const clearCode = 1 << this.minCodeSize;
    const endCode = clearCode + 1;
    let codeSize = this.minCodeSize + 1;
    let dict: number[][] = [];

    for (let i = 0; i < clearCode; i++) {
      dict[i] = [i];
    }

    dict[clearCode] = [];
    dict[endCode] = [];

    const output: number[] = [];

    let prev: number[] = [];
    let code = this.readCode(codeSize);

    while (code !== endCode && code !== null) {
      if (code === clearCode) {
        // Reset
        dict = [];
        for (let i = 0; i < clearCode; i++) {
          dict[i] = [i];
        }
        dict[clearCode] = [];
        dict[endCode] = [];

        codeSize = this.minCodeSize + 1;
        code = this.readCode(codeSize);
        if (code === endCode || code === null) break;

        prev = dict[code];
        output.push(...prev);
        continue;
      }

      let entry: number[];

      if (dict[code]) {
        entry = dict[code];
      } else if (code === dict.length && prev.length > 0) {
        entry = [...prev, prev[0]];
      } else {
        break;
      }

      output.push(...entry);

      if (prev.length > 0) {
        dict.push([...prev, entry[0]]);
      }

      if (dict.length === (1 << codeSize) && codeSize < 12) {
        codeSize++;
      }

      prev = entry;
      code = this.readCode(codeSize);
    }

    return output;
  }

  private readCode(size: number): number | null {
    while (this.bitLength < size) {
      if (this.pos >= this.data.length) return null;
      this.bitBuffer |= this.data[this.pos++] << this.bitLength;
      this.bitLength += 8;
    }

    const code = this.bitBuffer & ((1 << size) - 1);
    this.bitBuffer >>= size;
    this.bitLength -= size;
    return code;
  }
}