import { readGIF } from '@ge/gif'
import { useEventBus } from '@vueuse/core'

export type Frame = ReturnType<typeof readGIF>['frames'][number]

export const useGIFStore = defineStore('gif', () => {
  const frames = ref<Frame[]>([])
  const fileSize = ref(0)
  const fileName = ref('')

  const events = useEventBus<Frame[]>('gif')

  async function parse(file: File) {
    fileSize.value = file.size
    fileName.value = file.name

    const data = await file.arrayBuffer()
    
    const gif = readGIF(data)

    frames.value = gif.frames
    events.emit(frames.value)
  }

  function onFramesChange(fn: (frames: Frame[]) => void) {
    events.on(fn)

    return () => {
      events.off(fn)
    }
  }

  function $reset() {
    frames.value = []
    fileSize.value = 0
    fileName.value = ''
    events.reset()
  }

  onUnmounted(() => {
    $reset()
  })

  return { parse, fileName, fileSize, frames, onFramesChange }
})