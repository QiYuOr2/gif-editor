<script setup lang="ts">
defineProps<{
  filename: string
}>()

const emit = defineEmits<{
  (event: 'import'): void
  (event: 'export'): void
  (event: 'delete'): void
  (event: 'undo'): void
  (event: 'redo'): void
  (event: 'addFrame'): void
}>()

const onImport = () => emit('import')
const onExport = () => emit('export')
</script>



<template>
  <header class="bg-white p-4 flex items-center justify-between shadow-xs">
    <div>{{ filename }}</div>

    <div class="flex items-center space-x-4">
      <div icon-button @click="onImport">
        <div class="i-mdi:file-plus-outline"></div>
      </div>
      <div icon-button @click="onExport">
        <div class="i-mdi:download"></div>
      </div>
   
    </div>



  </header>
</template>

