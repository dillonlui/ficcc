import { describe, expect, it } from 'vitest'
import {
  prepareFellowshipCards,
  buildFellowshipDetailDocument,
  chineseFellowshipTargets,
  type ChineseGrowGroup,
} from './chinese-fellowship-details'

const group: ChineseGrowGroup = {
  _key: 'chinese-campus-zh',
  _type: 'growGroup',
  name: '学生团契/CCCF',
  meetingTime: '週五 7:00 PM',
  description: '第一段。\n\n第二段。',
}

describe('Chinese fellowship detail migration', () => {
  it('creates a distinct CMS document from the current card content', () => {
    const target = chineseFellowshipTargets.find((item) => item.groupKey === group._key)!
    const document = buildFellowshipDetailDocument(group, target)

    expect(document._id).toBe('ministry-zh-cccf')
    expect(document.slug.current).toBe('cccf')
    expect(document.name).toBe(group.name)
    expect(document.description).toHaveLength(2)
  })

  it('adds only missing references and preserves staff-selected references', () => {
    const existing = {
      ...group,
      _key: 'chinese-seniors-zh',
      detail: { _type: 'reference' as const, _ref: 'staff-selected-document' },
    }
    const result = prepareFellowshipCards([group, existing])

    expect(result.groups[0].detail?._ref).toBe('ministry-zh-cccf')
    expect(result.groups[0].description).toBe('大學生與研究生團契，在校園生活中一起成長。')
    expect(result.groups[1].detail?._ref).toBe('staff-selected-document')
    expect(result.groups[1].description).toBe(group.description)
    expect(result.changes).toEqual([
      {
        groupName: '学生团契/CCCF',
        documentId: 'ministry-zh-cccf',
        descriptionShortened: true,
      },
    ])
  })
})
