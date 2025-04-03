<script setup lang="ts">
const emit = defineEmits<{
  (event: 'import'): void
  (event: 'export'): void
  (event: 'delete'): void
  (event: 'undo'): void
  (event: 'redo'): void
  (event: 'play'): void
  (event: 'addFrame'): void
}>()

const onImport = () => emit('import')
const onExport = () => emit('export')
const onDelete = () => emit('delete')
const onUndo = () => emit('undo') 
const onRedo = () => emit('redo')
const togglePlay = () => emit('play')
const addFrame = () => emit('addFrame')
</script>



<template>
  <header class="bg-white p-4 flex items-center justify-between shadow-xs">
    <div class="flex items-center space-x-4">
      <button button @click="onImport">导入</button>
      <button button @click="onExport">导出</button>
      <button button @click="onDelete">删除帧</button>
      <button button @click="onUndo">撤销</button>
      <button button @click="onRedo">重做</button>
    </div>
    <div class="flex items-center space-x-4">
      <button button @click="togglePlay">播放/暂停</button>
      <button button @click="addFrame">添加帧</button>
    </div>
  </header>
</template>

