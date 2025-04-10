import { readGIF } from '@ge/gif'
import { useEventBus, useToggle } from '@vueuse/core'

export type Frame = ReturnType<typeof readGIF>['frames'][number]

export const useGIFStore = defineStore('gif', () => {
  const events = useEventBus<Frame[]>('gif')
  const frames = ref<Frame[]>([])
  const fileSize = ref(0)
  const fileName = ref('')

  const duration = ref(0)
  const durationDisplay = computed(() => timeDisplay(duration.value))

  const currentTime = ref(0)
  const currentTimeDisplay = computed(() => timeDisplay(currentTime.value))
  const currentFrame = computed(() => {
    const index = Math.floor(currentTime.value / (duration.value / frames.value.length))
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
    events.emit(frames.value)
  }

  function onFramesChange(fn: (frames: Frame[]) => void) {
    events.on(fn)

    return () => {
      events.off(fn)
    }
  }

  const [isPlaying, toggleIsPlaying] = useToggle(false)
  const animationId = ref<number>()

  function play() {
    if (animationId.value) {
      return
    }

    toggleIsPlaying(true)
    
    const updateFrame = () => {
      currentTime.value += 1000 / 60
      if (currentTime.value >= duration.value) {
        currentTime.value = 0
      }
      animationId.value = requestAnimationFrame(updateFrame)
    }
    updateFrame()
  }

  function pause() {
    if (animationId.value) {
      toggleIsPlaying(false)
      cancelAnimationFrame(animationId.value)
      animationId.value = undefined
    }
  }

  function togglePlayOrPause() {
    isPlaying.value ? pause() : play()
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

  return {
    parse,
    isPlaying,
    togglePlayOrPause,
    fileName, 
    fileSize,
    frames, 
    onFramesChange, 
    currentFrame, 
    durationDisplay,
    currentTimeDisplay 
  }
})
