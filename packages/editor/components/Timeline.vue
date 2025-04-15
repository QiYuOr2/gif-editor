
<script setup lang="ts">
import { useDraggable, useStorage } from '@vueuse/core'
import { useGIFStore, type Frame } from '~/store/useGIFStore';

const gif = useGIFStore()

const containerRef = ref()
const timelineCanvas = ref<HTMLCanvasElement>()
const scaleValue = useStorage('@ge/editor-scaleValue', 0.1)
const canvasBasicWidth = computed(() => {
  if (!containerRef.value) return 0
  return containerRef.value.clientWidth
})
const canvasBasicHeight = computed(() => {
  if (!containerRef.value) return 0
  return containerRef.value.clientHeight
})

const frameCanvasMap = new WeakMap<Frame, HTMLCanvasElement>()
function preloadFrameCanvas(frames: Frame[]) {
  frames.forEach((frame) => {
    const { width, height } = frame
    const imageData = new ImageData(
      frame.data,
      width,
      height
    );

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.putImageData(imageData, 0, 0);

    frameCanvasMap.set(frame, tempCanvas)
  });
}

function renderFrame(frames: Frame[], offset = 0) {
  if (!timelineCanvas.value) {
    return
  }

  timelineCanvas.value.height = canvasBasicHeight.value
  timelineCanvas.value.width = canvasBasicWidth.value
  const ctx = timelineCanvas.value.getContext('2d')!


  frames.forEach((frame, index) => {
    const frameCanvas = frameCanvasMap.get(frame)!
    const { width, height } = frame

    const targetWidth = width * canvasBasicHeight.value / height;

    // scaleValue = 0 => x = targetWidth
    // scaleValue = 1 => x = canvasBasicWidth.value * frames.length
    // 根据 scaleValue & index 线性计算 x
    const x = targetWidth * (1 - scaleValue.value) * index 
      + canvasBasicWidth.value * scaleValue.value * index / frames.length;


    ctx.drawImage(frameCanvas, offset + x, 0, targetWidth, canvasBasicHeight.value);
  });
}

gif.onFramesChange((frames) => {
  preloadFrameCanvas(frames)
  renderFrame(frames)
})

const sliderWidth = computed(() => {
  const progress = scaleValue.value * 100
  const minWidth = canvasBasicWidth.value / (gif.frames.reduce((acc, frame) => acc + frame.width, 0)) * 100

  return `${progress < minWidth ? minWidth : progress}%`
})

const sliderRef = ref<HTMLDivElement>()
const sliderWrapperRef = ref<HTMLDivElement>()

const { x } = useDraggable(sliderRef, {
  axis: 'x',
  onMove() {
    renderFrame(gif.frames, -sliderPosition.value)
  }
})

const sliderPosition = computed(() => {
  if (!sliderRef.value || !sliderWrapperRef.value) {
    return 0
  }
  const maxX = sliderWrapperRef.value.clientWidth - sliderRef.value.clientWidth
  const minX = 0
  const newX = Math.max(minX, Math.min(maxX, x.value))
  return newX
})

const indicatorRef = ref<HTMLDivElement>()
const indicatorWrapperRef = ref<HTMLDivElement>()
const { x: indicatorX } = useDraggable(indicatorRef, {
  axis: 'x',
  onMove() {
    if (!indicatorRef.value || !indicatorWrapperRef.value || !sliderWrapperRef.value) {
      return
    }
    const progress = indicatorPosition.value / indicatorWrapperRef.value.clientWidth * scaleValue.value
    gif.setCurrentTimeByProgress(progress)
  }
})

const indicatorPosition = computed(() => {
  if (!indicatorRef.value || !indicatorWrapperRef.value) {
    return 0
  }
  const maxX = indicatorWrapperRef.value.clientWidth
  const minX = 0
  const newX = Math.max(minX, Math.min(maxX, indicatorX.value - indicatorWrapperRef.value.offsetLeft - 20))
  return newX
})

gif.onPlaying(({ progress }) => {
  if (!indicatorRef.value || !indicatorWrapperRef.value) {
    return
  }
  indicatorX.value = progress * (indicatorWrapperRef.value.offsetWidth + 40) / scaleValue.value
})
</script>

<template>
  <WithPlaceholder>
    <div
      class="fixed bottom-0 left-0 right-0 bg-white text-gray-800 pt-3 pb-6 m-4 rounded-6 overflow-hidden shadow-sm border-2 border-gray-200 border-solid">
      <div class="flex items-center mb-2">
        <!-- undo / redo -->
        <div flex items-center space-x-3 text-gray-300 ml-4>
          <div icon-button text-gray-800>
            <div class="i-mdi:undo-variant"></div>
          </div>
          <div icon-button>
            <div class="i-mdi:redo-variant"></div>
          </div>
        </div>

        <!-- play / pause -->
        <div class="flex items-center mx-auto">
          <div class="flex items-center gap-3 text-gray-800">
            <div class="icon-button" @click="gif.toFirst">
              <div class="i-mdi:skip-previous-outline"></div>
            </div>
            <div class="icon-button" @click="gif.togglePlayOrPause">
              <div v-if="!gif.isPlaying" class="i-mdi:play"></div>
              <div v-else class="i-mdi:pause"></div>
            </div>
            <div class="icon-button" @click="gif.toLast">
              <div class="i-mdi:skip-next-outline"></div>
            </div>
          </div>

          <div class="flex items-center font-mono text-sm gap-2 ml-6">
            <div>{{ gif.currentTimeDisplay }}</div>
            <span>/</span>
            <div class="text-gray-400">{{ gif.durationDisplay }}</div>
          </div>
        </div>

        <div mr-6>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            v-model="scaleValue"
            @input="renderFrame(gif.frames)"
          >
        </div>
      </div>

      <div ref="sliderWrapperRef" class="h-6 mb-6 border-y-2 border-y-solid border-gray-100">
        <div
          v-show="gif.frames.length"
          ref="sliderRef"
          class="h-full bg-blue-200 rounded cursor-pointer relative"
          :style="{ width: sliderWidth, left: `${sliderPosition}px` }"
        ></div>
      </div>

      <div ref="indicatorWrapperRef" class="relative mx-[20px]">
        <!-- 指示线 -->
        <div ref="indicatorRef" class="absolute h-full w-[2px] bg-red-500 z-50 cursor-pointer" :style="{left: `${indicatorPosition}px`}"></div>
        <div class="relative bg-gray-100 rounded-5 h-20 overflow-x-auto border-1 border-gray-200 border-solid">
          <div ref="containerRef" class="relative flex space-x-1 h-full items-center">
            <canvas ref="timelineCanvas" class="h-full w-full"></canvas>
          </div>
        </div>
      </div>
    </div>
  </WithPlaceholder>
</template>
