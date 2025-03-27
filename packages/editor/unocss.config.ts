import presetIcons from '@unocss/preset-icons'
import { defineConfig, presetAttributify, presetWind3, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetAttributify(), presetWind3(), presetIcons()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
