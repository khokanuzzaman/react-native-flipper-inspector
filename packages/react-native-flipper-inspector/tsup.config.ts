import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'overlay/index': 'src/overlay/index.tsx',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-native', 'react-native-flipper'],
  treeshake: true,
  minify: true,
  target: 'es2020',
  outDir: 'dist',
  tsconfig: './tsconfig.json',
  banner: {
    js: '"use client";',
  },
});
