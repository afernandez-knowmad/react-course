import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type UserConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  // `test` no está en `UserConfig` de Vite 8 (rolldown),
  // Vitest 3 aún arrastra Vite 6 + rollup, así que los tipos chocan.
  // Cast controlado para que TypeScript acepte la propiedad.
  test: {
    environment: 'jsdom',
    globals: true,
  },
} as UserConfig & { test: unknown })
