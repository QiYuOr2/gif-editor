import presetIcons from '@unocss/preset-icons'
import { defineConfig, presetAttributify, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'button': 'flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1.5 rounded transition appearance-none m-0 border-0 cursor-pointer',
      'icon-button': 'box-border w-8 h-8 text-2xl cursor-pointer flex items-center justify-center rounded hover:bg-gray-100 transition-colors duration-250',
    },
  ],
  presets: [presetAttributify(), presetWind3(), presetIcons()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
