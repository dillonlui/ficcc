import { describe, expect, it } from 'vitest'
import { getGrowGroupHref } from './grow-pages'
import type { SanityGrowGroup } from './sanity'

function groupWithDetail(
  detail?: SanityGrowGroup['detail'],
): SanityGrowGroup {
  return {
    _key: 'student-fellowship',
    name: '学生团契/CCCF',
    description: 'Student fellowship',
    detail,
  }
}

describe('getGrowGroupHref', () => {
  it('does not invent a detail link when staff have not selected one', () => {
    expect(getGrowGroupHref(groupWithDetail())).toBeUndefined()
  })

  it('links a visible Chinese ministry document selected in Sanity', () => {
    expect(getGrowGroupHref(groupWithDetail({
      isVisible: true,
      language: 'zh',
      slug: { current: 'campus-fellowship' },
    }))).toBe('/zh/fellowships/campus-fellowship')
  })

  it('does not link hidden or non-Chinese detail documents', () => {
    expect(getGrowGroupHref(groupWithDetail({
      isVisible: false,
      language: 'zh',
      slug: { current: 'campus-fellowship' },
    }))).toBeUndefined()

    expect(getGrowGroupHref(groupWithDetail({
      isVisible: true,
      language: 'en',
      slug: { current: 'campus-fellowship' },
    }))).toBeUndefined()
  })
})
