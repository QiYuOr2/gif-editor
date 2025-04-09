import { readGIF } from '@ge/gif'
import { useEventBus } from '@vueuse/core'

export type Frame = ReturnType<typeof readGIF>['frames'][number]

export const useGIFStore = defineStore('gif', () => {
  const frames = ref<Frame[]>([])
  const fileSize = ref(0)
  const fileName = ref('')

  const events = useEventBus<Frame[]>('gif')

  const parse = async (file: File) => {
    fileSize.value = file.size
    fileName.value = file.name

    const data = await file.arrayBuffer()
    
    const gif = readGIF(data)

    frames.value = gif.frames
    events.emit(frames.value)
  }

  const onFramesChange = (fn: (frames: Frame[]) => void) => {
    events.on(fn)

    return () => {
      events.off(fn)
    }
  }

  onUnmounted(() => {
    events.reset()
  })

  return { parse, fileName, fileSize, frames, onFramesChange }
})