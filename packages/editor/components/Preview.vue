<template>
  <main class="flex flex-1 m-4 mb-6 items-center justify-center relative">
    <canvas ref="previewCanvas" class="max-w-full max-h-full min-h-2/3" />
  </main>
</template>

<script setup lang="ts">
import { useGIFStore } from '~/store/useGIFStore';

const gif = useGIFStore()

const previewCanvas = ref<HTMLCanvasElement>()

function renderFrame() {
  const canvas = previewCanvas.value!
  const { width, height } = gif.currentFrame

  // 计算高度，以 canvas 宽度为基准，缩放 frame 的宽高，绘制在 canvas 上
  const scale = canvas.width / width
  canvas.height = height * scale
  canvas.width = canvas.width
  const imageData = new ImageData(
    gif.currentFrame.data,
    width,
    height
  );
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d')!
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCtx.putImageData(imageData, 0, 0);

  const targetWidth = width * scale
  const targetHeight = height * scale
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, targetWidth, targetHeight)
}

watch(() => gif.currentFrame, () => {
  console.log(gif.currentFrame)
  if (!previewCanvas.value) {
    return
  }

  renderFrame()
}, { immediate: true })
</script>
