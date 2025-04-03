<template>
  <div 
    class="frame flex flex-col items-center cursor-pointer"
    :class="{ 'selected': isSelected }"
    @click="$emit('select')"
  >
    <div class="thumbnail w-16 h-16 bg-gray-600 rounded shadow-sm">
      <img 
        v-if="frameSrc" 
        :src="frameSrc" 
        class="w-full h-full object-cover rounded"
        alt="Frame thumbnail"
      />
    </div>
    <span class="text-xs text-gray-400">Time: {{ duration }}s</span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  frameSrc: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>

<style scoped>
.frame.selected .thumbnail {
  border: 2px solid #3b82f6;
}
</style>
