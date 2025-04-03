<template>
  <main class="flex-grow flex items-center justify-center relative border-2 border-gray-600 shadow-inner">
    <div class="text-center">
      <h1 class="text-3xl font-semibold">GIF 预览区域</h1>
      <!-- 动态显示当前帧 -->
      <img v-if="currentFrame?.src" :src="currentFrame.src" alt="Current GIF frame" class="max-w-full max-h-full" />
    </div>
    <!-- 播放时间显示 -->
    <div class="absolute top-4 right-4 bg-black text-gray-100 bg-opacity-60 px-3 py-1 rounded">
      {{ formatTime(currentTime) }}
    </div>
  </main>
</template>

<script setup lang="ts">
interface Frame {
  id: string
  src: string
  duration: number
}

defineProps({
  currentTime: {
    type: Number,
    default: 0
  },
  currentFrame: {
    type: Object as () => Frame | null,
    default: null
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>
