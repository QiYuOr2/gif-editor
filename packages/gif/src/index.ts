import { GifReader, GifWriter, type Frame } from 'omggif'
import quantize from 'quantize'

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

function toPowerOfTwoPalette(paletteRGB: [number, number, number][]) {
  let numColors = paletteRGB.length
  let target = 2
  while (target < numColors) target *= 2
  if (target > 256) target = 256

  const safePalette = paletteRGB.slice(0, target)
  while (safePalette.length < target) {
    safePalette.push([0, 0, 0]) // 填补黑色
  }
  
  return safePalette
}

export function writeGIF(frames: GIFFrame[]): ArrayBuffer {
  const { width, height } = frames[0]
  const buffer = new Uint8Array(width * height * 4)
  const gif = new GifWriter(buffer, width, height, { loop: 0 })

  for (const frame of frames) {
    const rgba = frame.data

    const pixels: [number, number, number][] = []
    for (let i = 0; i < rgba.length; i += 4) {
      pixels.push([rgba[i], rgba[i + 1], rgba[i + 2]])
    }

    // 使用 quantize 生成 256 色调色板
    const cmap = quantize(pixels, 256)
    if (typeof cmap === 'boolean' && !cmap) {
      throw new Error('颜色量化错误')
    }

    const paletteRGB = cmap.palette()
    const palette = toPowerOfTwoPalette(paletteRGB)

    // 将每个像素匹配调色板中的索引
    const indexedPixels = []
    for (let i = 0; i < pixels.length; i++) {
      indexedPixels[i] = cmap.map(pixels[i])
    }


    gif.addFrame(0, 0, width, height, indexedPixels.flat(), {
      palette: palette as any,
      delay: Math.round(frame.delay / 10)
    })
  }

  const gifData = buffer.slice(0, gif.end())

  return gifData.buffer
}