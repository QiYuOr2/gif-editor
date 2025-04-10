<script setup lang="ts">
const containerRef = ref<HTMLElement>()
const placeholderHeight = computed(() => {
  const el = containerRef.value?.children[0] as HTMLElement
  if (!el) {
    return 0
  }
  const { height } = el.getBoundingClientRect()
  return height
})
</script>

<template>
  <div>
    <div ref="containerRef">
      <slot />
    </div>
    <div :style="{ height: `${placeholderHeight}px` }"></div>
  </div>
</template>