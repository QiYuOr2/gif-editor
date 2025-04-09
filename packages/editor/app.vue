<script setup lang="ts">
import { ref, computed } from 'vue'
import EditorHeader from './components/Header.vue'
import Preview from './components/Preview.vue'
import Timeline from './components/Timeline.vue'
import { useFileDialog } from '@vueuse/core'
import { useGIFStore } from './store/useGIFStore'

const gif = useGIFStore()

const { open, onChange } = useFileDialog({
  accept: '.gif',
  multiple: false
})

onChange(async (files) => {
  if (!files?.length) {
    return
  }

  gif.parse(files[0])
})


const handleExport = () => {
  console.log('Export clicked')
}


</script>

<template>
  <div class="text-gray-900 bg-gray-100 flex flex-col h-screen overflow-hidden">
    <EditorHeader 
      :filename="gif.fileName || 'Untitled'"
      @import="open"
      @export="handleExport"
    />
    
    <!-- <Preview 
      :current-frame="currentFrame"
      :is-playing="isPlaying"
      :current-time="currentTime"
    /> -->
  
    <Timeline />
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
