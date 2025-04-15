import { readGIF } from '@ge/gif'
import { useEventBus, useToggle } from '@vueuse/core'

export type Frame = ReturnType<typeof readGIF>['frames'][number]

export const useGIFStore = defineStore('gif', () => {
  const events = useEventBus<Frame[]>('gif')
  const frames = ref<Frame[]>([])
  const fileSize = ref(0)
  const fileName = ref('')

  const frameDelay = ref(0)
  const duration = ref(0)
  const durationDisplay = computed(() => timeDisplay(duration.value))

  const currentTime = ref(0)
  const currentTimeDisplay = computed(() => timeDisplay(currentTime.value))
  const currentFrame = computed(() => {
    const index = Math.floor(currentTime.value / frameDelay.value)
    return frames.value[index]
  })

  function timeDisplay(time: number) {
    const seconds = Math.floor(time / 1000)
    const milliseconds = time % 1000
    const millisecondsStr = milliseconds.toString().padStart(3, '0').slice(0, 3)
    return `${seconds}.${millisecondsStr}`
  }

  async function parse(file: File) {
    fileSize.value = file.size
    fileName.value = file.name

    const data = await file.arrayBuffer()
    
    const gif = readGIF(data)

    frames.value = gif.frames
    duration.value = gif.duration
    frameDelay.value = gif.delay
    events.emit(frames.value)
  }

  function onFramesChange(fn: (frames: Frame[]) => void) {
    events.on(fn)

    return () => {
      events.off(fn)
    }
  }

  const [isPlaying, toggleIsPlaying] = useToggle(false)

  function play() {
    toggleIsPlaying(true)

    const nextFrame = () => {
      if (!isPlaying.value) {
        return
      }

      currentTime.value += frameDelay.value
      if (currentTime.value >= duration.value) {
        currentTime.value = 0
      }

      setTimeout(nextFrame, frameDelay.value)
    }

    nextFrame()
  }

  function pause() {
    toggleIsPlaying(false)
  }

  function togglePlayOrPause() {
    isPlaying.value ? pause() : play()
  }

  function toFirst() {
    currentTime.value = 0
  }
  function toLast() {
    currentTime.value = duration.value - 1
  }

  function $reset() {
    frames.value = []
    fileSize.value = 0
    fileName.value = ''
    frameDelay.value = 0
    duration.value = 0
    currentTime.value = 0
    events.reset()
  }

  onUnmounted(() => {
    $reset()
  })

  return {
    parse,
    isPlaying,
    togglePlayOrPause,
    toFirst,
    toLast,
    fileName, 
    fileSize,
    frames,
    onFramesChange, 
    currentFrame, 
    durationDisplay,
    currentTimeDisplay 
  }
})
