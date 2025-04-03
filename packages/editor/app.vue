<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import Preview from './components/Preview.vue'
import Timeline from './components/Timeline.vue'

// 状态管理
const frames = ref<Array<{
  id: string
  src: string
  duration: number
}>>([])
const selectedFrameId = ref('')
const isPlaying = ref(false)
const currentTime = ref(0)
const zoomLevel = ref(1)

const totalDuration = computed(() => {
  return frames.value.reduce((sum, frame) => sum + frame.duration, 0)
})

const currentFrame = computed(() => {
  return frames.value.find(frame => frame.id === selectedFrameId.value) || null
})

// 操作方法
const handleImport = () => {
  console.log('Import clicked')
  // TODO: 实现导入逻辑
}

const handleExport = () => {
  console.log('Export clicked')
  // TODO: 实现导出逻辑
}

const deleteSelectedFrame = () => {
  if (selectedFrameId.value) {
    frames.value = frames.value.filter(frame => frame.id !== selectedFrameId.value)
    selectedFrameId.value = frames.value[0]?.id || ''
  }
}

const undo = () => {
  console.log('Undo clicked')
  // TODO: 实现撤销逻辑
}

const redo = () => {
  console.log('Redo clicked')
  // TODO: 实现重做逻辑
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  // TODO: 实现播放控制逻辑
}

const addFrame = () => {
  const newFrame = {
    id: `frame-${Date.now()}`,
    src: '',
    duration: 0.1
  }
  frames.value.push(newFrame)
  selectedFrameId.value = newFrame.id
}

const openSettings = () => {
  console.log('Settings clicked')
  // TODO: 实现设置逻辑
}

const selectFrame = (frameId: string) => {
  selectedFrameId.value = frameId
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
}
</script>

<template>
  <div class="text-gray-900 bg-gray-100 flex flex-col h-screen overflow-hidden">
    <Header 
      @import="handleImport"
      @export="handleExport"
      @delete-frame="deleteSelectedFrame"
      @undo="undo"
      @redo="redo"
      @play-pause="togglePlay"
      @add-frame="addFrame"
      @settings="openSettings"
    />
    
    <Preview 
      :current-frame="currentFrame"
      :is-playing="isPlaying"
      :current-time="currentTime"
    />
  
    <Timeline
      :frames="frames"
      :selected-frame-id="selectedFrameId"
      :current-time="currentTime"
      :total-duration="totalDuration"
      @select-frame="selectFrame"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
    />
  </div>
</template>



<style>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
