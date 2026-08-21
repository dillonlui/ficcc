import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const givePages = ['../pages/en/give.astro', '../pages/zh/give.astro']

describe('Give page CMS content', () => {
  it.each(givePages)('%s renders staff-authored fields as escaped text', (relativePath) => {
    const source = readFileSync(
      fileURLToPath(new URL(relativePath, import.meta.url)),
      'utf8',
    )

    expect(source).toContain('{method.description}')
    expect(source).toContain('{method.address}')
    expect(source).not.toMatch(/set:html=\{method\.(?:description|address)/)
  })
})
