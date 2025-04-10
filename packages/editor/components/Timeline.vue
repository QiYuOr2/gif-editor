
<script setup lang="ts">
import { useGIFStore, type Frame } from '~/store/useGIFStore';

const gif = useGIFStore()

const containerRef = ref()
const timelineCanvas = ref<HTMLCanvasElement>()
const scaleValue = ref(1) // 默认显示所有帧
const canvasBasicWidth = computed(() => {
  if (!containerRef.value) return 0
  return containerRef.value.clientWidth
})
const canvasBasicHeight = computed(() => {
  if (!containerRef.value) return 0
  return containerRef.value.clientHeight
})

function renderFrame(frames: Frame[]) {
  if (!timelineCanvas.value) {
    return
  }

  timelineCanvas.value.height = canvasBasicHeight.value
  timelineCanvas.value.width = canvasBasicWidth.value
  const ctx = timelineCanvas.value.getContext('2d')!

  frames.forEach((frame, index) => {
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

    const targetWidth = width * canvasBasicHeight.value / height;

    // scaleValue = 0 => x = targetWidth
    // scaleValue = 1 => x = canvasBasicWidth.value * frames.length
    // 根据 scaleValue & index 线性计算 x
    const x = targetWidth * (1 - scaleValue.value) * index 
      + canvasBasicWidth.value * scaleValue.value * index / frames.length;

    ctx.drawImage(tempCanvas, x, 0, targetWidth, canvasBasicHeight.value);
  });
}

gif.onFramesChange((frames) => renderFrame(frames))
</script>
<template>
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
          <div class="icon-button">
            <div class="i-mdi:skip-previous-outline"></div>
          </div>
          <div class="icon-button">
            <div v-if="true" class="i-mdi:play"></div>
            <div v-else="true" class="i-mdi:pause"></div>
          </div>
          <div class="icon-button">
            <div class="i-mdi:skip-next-outline"></div>
          </div>
        </div>

        <div class="flex items-center font-mono text-sm gap-2 ml-6">
          <div>01:11.00</div>
          <span>/</span>
          <div class="text-gray-400">09:32.01</div>
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

    <div class="h-6 mb-6 border-y-2 border-y-solid border-gray-100"></div>

    <div class="relative bg-gray-100 rounded-5 h-20 mx-6 overflow-x-auto border-1 border-gray-200 border-solid">

      <div ref="containerRef" class="relative flex space-x-1 h-full items-center">
        <canvas ref="timelineCanvas" class="h-full w-full"></canvas>
        <!-- 滚动条 -->
        <div class="absolute bottom-0"></div>
      </div>
    </div>
  </div>
</template>
