import { GifReader, type Frame } from 'omggif'

export interface GIFFrame extends Frame {
  data: Uint8ClampedArray
}

export function readGIF(arrayBuffer: ArrayBuffer) {
  const reader = new GifReader(new Uint8Array(arrayBuffer))
  
  const frameLength = reader.numFrames()
  const frames : GIFFrame[] = []

  for (let i = 0; i < frameLength; i++) {
    const info = reader.frameInfo(i)
    const imageData = new Uint8ClampedArray(info.width * info.height * 4)
    reader.decodeAndBlitFrameBGRA(i, imageData)
    
    frames.push({
      ...info,
      data: imageData,
    })
  }

  return { count: frameLength, frames }
}