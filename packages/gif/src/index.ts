import { GifReader, type Frame } from 'omggif'

export interface GIFFrame extends Pick<Frame, 'width' | 'height' | 'delay' | 'x' | 'y'> {
  data: Uint8ClampedArray
}

function pick<T>(obj: T, keys: Array<keyof T>) {
  return Object.fromEntries(
    Object.entries(obj as object).filter(([key]) => keys.includes(key as keyof T))
  ) as Pick<T, keyof T>
}

export function readGIF(arrayBuffer: ArrayBuffer) {
  const reader = new GifReader(new Uint8Array(arrayBuffer))
  
  const frameLength = reader.numFrames()
  const frames: GIFFrame[] = []
  const width = reader.width
  const height = reader.height
  
  // 维护多个状态缓冲区
  const buffers = {
    current: new Uint8ClampedArray(width * height * 4),
    previous: new Uint8ClampedArray(width * height * 4),
    background: new Uint8ClampedArray(width * height * 4).fill(0) // 透明背景
  }

  let duration = 0

  for (let i = 0; i < frameLength; i++) {
    const info = reader.frameInfo(i)
    const imageData = new Uint8ClampedArray(width * height * 4)
    
    // 根据disposal方法决定如何初始化当前帧
    switch (info.disposal) {
      case 1: // 恢复为背景色
        imageData.set(buffers.background)
        break
      case 2: // 恢复为前一帧
        imageData.set(buffers.previous)
        break
      default: // 其他情况使用当前帧
        imageData.set(buffers.current)
    }

    reader.decodeAndBlitFrameRGBA(i, imageData)
    
    buffers.previous.set(buffers.current)
    buffers.current.set(imageData)

    frames.push({
      ...pick(info, ['width', 'height', 'delay', 'x', 'y']),
      data: imageData,
    })

    duration += info.delay * 10
  }

  return { count: frameLength, frames, duration }
}
