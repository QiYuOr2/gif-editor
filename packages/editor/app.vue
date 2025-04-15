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

async function loadExample() {
  const response = await fetch('/simple.gif')
  const result = await response.blob()
  const file = new File([result], 'example.gif', { type: 'image/gif' })
  gif.parse(file)
}
</script>

<template>
  <div class="text-gray-900 bg-gray-100 flex flex-col h-screen overflow-hidden">
    <EditorHeader 
      :filename="gif.fileName || 'Untitled'"
      @import="open"
      @export="handleExport"
      @example="loadExample"
    />
    
    <Preview />
  
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

input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 14px;
    border: 2px solid black;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    transform: translateY(calc(-50% + 2px));
  }

  input[type='range']::-moz-range-thumb {
    height: 24px;
    width: 24px;
    border: 3px solid black;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }

  input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    background: transparent;
  }

  input[type='range']::-webkit-slider-runnable-track {
    height: 4px;
    background: #d1d5db;
    border-radius: 9999px;
  }

  input[type='range']::-moz-range-track {
    height: 4px;
    background: #d1d5db;
    border-radius: 9999px;
  }
</style>
