import { readGIF } from '@ge/gif'

type Frame = ReturnType<typeof readGIF>['frames'][number]

export const useGIFStore = defineStore('gif', () => {
  const frames = ref<Frame[]>([])
  const fileSize = ref(0)
  const fileName = ref('')

  const parse = async (file: File) => {
    fileSize.value = file.size
    fileName.value = file.name

    const data = await file.arrayBuffer()
    
    const gif = readGIF(data)

    frames.value = gif.frames
  }

  return { parse, fileName, fileSize, frames }
})