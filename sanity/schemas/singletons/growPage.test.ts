import { describe, expect, it } from 'vitest'
import { validateUniqueDetailReferences } from './growPage'

describe('Grow page detail references', () => {
  it('allows missing and unique fellowship detail references', () => {
    expect(validateUniqueDetailReferences([
      { name: 'One', detail: { _ref: 'ministry-one' } },
      { name: 'Two', detail: { _ref: 'ministry-two' } },
      { name: 'Unlinked' },
    ])).toBe(true)
  })

  it('rejects two cards that point to the same fellowship detail document', () => {
    expect(validateUniqueDetailReferences([
      { name: 'Senior Fellowship', detail: { _ref: 'same-document' } },
      { name: 'Student Fellowship', detail: { _ref: 'same-document' } },
    ])).toContain('currently use the same page')
  })
})
