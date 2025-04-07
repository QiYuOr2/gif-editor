
<script setup lang="ts">
import { useGIFStore } from '~/store/useGIFStore';

const gif = useGIFStore()

const canvasWidth = computed(() => gif.frames.reduce((acc, frame) => acc + frame.dims.width, 0))

</script>
<template>
  <div
    class="bg-white text-gray-800 pt-3 pb-6 m-4 rounded-6 overflow-hidden shadow-sm border-2 border-gray-200 border-solid">
    <div class="flex items-center mb-2">
      <div flex items-center space-x-3 text-gray-300 ml-4>
        <div icon-button text-gray-800>
          <div class="i-mdi:undo-variant"></div>
        </div>
        <div icon-button>
          <div class="i-mdi:redo-variant"></div>
        </div>
      </div>

      <div class="flex items-center mx-auto">
        <div class="flex items-center gap-3 text-gray-800">
          <div class="icon-button">
            <div class="i-mdi:skip-previous-outline"></div>
          </div>
          <div class="icon-button">
            <div v-if="true" class="i-mdi:play"></div>
            <div v-else="true" class="i-mdi:pause"></div>
          </div>
          <div class="icon-button">
            <div class="i-mdi:skip-next-outline"></div>
          </div>
        </div>

        <div class="flex items-center font-mono text-sm gap-2 ml-6">
          <div>01:11.00</div>
          <span>/</span>
          <div class="text-gray-400">09:32.01</div>
        </div>
      </div>

    </div>

    <div class="h-6 mb-6 border-y-2 border-y-solid border-gray-100"></div>

    <div
      class="relative bg-gray-100 rounded-5 h-20 mx-6 overflow-x-auto border-1 border-gray-200 border-solid scrollbar">
      <!-- <div class="absolute inset-0 flex items-end pointer-events-none">
        <div class="w-full border-t border-gray-600"></div>
        <div class="flex justify-between w-full px-2 text-xs text-gray-500">
          <span v-for="tick in ticks" :key="tick">{{ tick }}s</span>
        </div>
      </div> -->

      <!-- <div 
        class="playhead absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
        :style="{ left: `${playheadPosition}%` }"
      ></div> -->

      <div class="relative flex space-x-1 h-full px-2 items-center">
        <!-- <FrameItem v-for="frame in frames" :key="frame.id" :frame-src="frame.src" :duration="frame.duration" :is-selected="selectedFrameId === frame.id" @select="$emit('selectFrame', frame.id)" /> -->
      </div>
    </div>
  </div>
</template>



<style scoped>
.scrollbar::-webkit-scrollbar {
  height: 8px;
}

.scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
</style>
