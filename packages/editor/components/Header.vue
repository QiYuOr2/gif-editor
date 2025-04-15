<script setup lang="ts">
defineProps<{
  filename: string
}>()

const emit = defineEmits<{
  (event: 'import'): void
  (event: 'export'): void
  (event: 'example'): void
  
}>()

const onImport = () => emit('import')
const onExport = () => emit('export')
const onExample = () => emit('example')
</script>



<template>
  <header class="bg-white p-4 flex items-center justify-between shadow-xs">
    <div>{{ filename }}</div>

    <div class="flex items-center space-x-4">
      <div class="border-light-900 border-solid rounded text-xs px-2 py-1 cursor-pointer hover:bg-light-900 transition-colors duration-200" @click="onExample">载入示例</div>
      <div icon-button @click="onImport">
        <div class="i-mdi:file-plus-outline"></div>
      </div>
      <div icon-button @click="onExport">
        <div class="i-mdi:download"></div>
      </div>
    </div>
  </header>
</template>

