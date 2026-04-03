import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default function setupNodePolyfills() {
  return nodePolyfills({
    // 根据你的需要配置
    include: ['stream', 'util', 'buffer', 'process'],
    globals: {
      Buffer: true,
      global: true,
      process: true,
    },
  })
}
