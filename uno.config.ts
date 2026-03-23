import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    })
  ],
  theme: {
    colors: {
      primary: '#3b82f6',
      dark: '#0f1117',
    }
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg bg-primary text-white cursor-pointer hover:opacity-90',
  }
})
