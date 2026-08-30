import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // Several legacy packaging tests intentionally toggle process-wide build
    // environment flags. Keep files isolated from one another to prevent those
    // flags racing when the suite is run on Linux.
    fileParallelism: false
  }
})
