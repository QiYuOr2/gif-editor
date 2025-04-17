import { GifReader, GifWriter, type Frame } from 'omggif'

export interface GIFFrame extends Pick<Frame, 'width' | 'height' | 'delay' | 'x' | 'y'> {
  data: Uint8ClampedArray
}

function pick<T>(obj: T, keys: Array<keyof T>) {
  return Object.fromEntries(
    Object.entries(obj as object).filter(([key]) => keys.includes(key as keyof T))
  ) as Pick<T, keyof T>
}

interface ReadGIFReturn {
  count: number
  frames: GIFFrame[]
  /**
   * gif 持续时间，单位为毫秒
   */
  duration: number
  /**
   * gif 每帧延迟时间，单位为毫秒
   */
  delay: number
}

export function readGIF(arrayBuffer: ArrayBuffer): ReadGIFReturn {
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

  return { count: frameLength, frames, duration, delay: frames[0].delay * 10 }
}

export function saveGIF(frames: GIFFrame[], delay?: number): ArrayBuffer {
  if (frames.length === 0) {
    throw new Error('No frames to save')
  }

  const width = frames[0].width
  const height = frames[0].height

  const bufferLength = frames.reduce((acc, frame) => acc + frame.width * frame.height * 4, 0)
  
  // 创建一个足够大的buffer来存储GIF数据
  const buffer = new Uint8Array(bufferLength)
  
  // 创建GIF写入器
  const writer = new GifWriter(buffer, width, height, { loop: 0 })
  
  // 写入每一帧
  for (const element of frames) {
    const frame = element
    const frameDelay = delay !== undefined ? delay / 10 : frame.delay
    
    writer.addFrame(
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      Array.from(frame.data),
      {
        delay: frameDelay,
        disposal: 2,
      }
    )
  }
  
  const actualLength = writer.end()
  
  const result = buffer.slice(0, actualLength).buffer
  
  return result
}
