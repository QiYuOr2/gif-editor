import { parseGIF, decompressFrames } from 'gifuct-js'

export function readGIF(data: ArrayBuffer) {
  const frames = decompressFrames(parseGIF(data), true)

  const totalDuration = frames.reduce((acc, frame) => {
    const duration = frame.delay || 0
    return acc + duration
  }, 0)

  return { duration: totalDuration, frames }
}