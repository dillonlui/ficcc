export type ChineseGrowGroup = {
  _key: string;
  _type?: string;
  name: string;
  meetingTime?: string;
  description: string;
  image?: unknown;
  detail?: { _type: 'reference'; _ref: string };
  [key: string]: unknown;
};

export const chineseFellowshipTargets = [
  {
    groupKey: 'chinese-seniors-zh',
    documentId: 'ministry-zh-senior-fellowship',
    slug: 'senior-fellowship',
    cardSummary: '我們每月以兩種形式舉行聚會：一種是在教會現場聚會，另一種是透過Zoom線上聚會。我們的團契成員主要是長者和退休人士。',
  },
  {
    groupKey: 'ebf5f79d6f41',
    documentId: 'ministry-zh-canaan-fellowship',
    slug: 'canaan-fellowship',
    cardSummary: '迦南组是由十几户长期在 Ithaca 工作和生活的家庭组成的家庭团契，也是伊的家华人教会最早成立的家庭团契之一。',
  },
  {
    groupKey: 'chinese-young-pros-zh',
    documentId: 'ministry-zh-ctbf',
    slug: 'ctbf',
    cardSummary: '我们是一个充满活力与爱的大家庭,主要由职场青年和年轻家庭组成。',
  },
  {
    groupKey: 'chinese-family-zh',
    documentId: 'ministry-zh-highland-group',
    slug: 'highland-group',
    cardSummary: '以家庭為單位的團契，在信仰與生活中彼此扶持。',
  },
  {
    groupKey: 'chinese-campus-zh',
    documentId: 'ministry-zh-cccf',
    slug: 'cccf',
    cardSummary: '大學生與研究生團契，在校園生活中一起成長。',
  },
  {
    groupKey: 'chinese-gospel-zh',
    documentId: 'ministry-zh-faith-discussion-group',
    slug: 'faith-discussion-group',
    cardSummary: '这是一个为想探索人生问题、认识基督信仰的朋友预备的聚会。无论你从来没去过教会，对基督教有疑问或保留，或只是单纯感到好奇，都非常欢迎你来参加。',
  },
] as const;

function portableText(description: string, slug: string) {
  return description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((text, index) => ({
      _type: 'block',
      _key: `${slug}-${index + 1}`,
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span',
        _key: `${slug}-${index + 1}-span`,
        text,
        marks: [],
      }],
    }));
}

export function buildFellowshipDetailDocument(
  group: ChineseGrowGroup,
  target: (typeof chineseFellowshipTargets)[number],
) {
  return {
    _id: target.documentId,
    _type: 'ministry',
    isVisible: true,
    name: group.name,
    slug: { _type: 'slug', current: target.slug },
    meetingTime: group.meetingTime,
    description: portableText(group.description, target.slug),
    image: group.image,
    language: 'zh',
  };
}

export function prepareFellowshipCards(groups: ChineseGrowGroup[]) {
  const changes: Array<{
    groupName: string;
    documentId: string;
    descriptionShortened: boolean;
  }> = [];
  const byKey = new Map(chineseFellowshipTargets.map((target) => [target.groupKey, target]));

  const updatedGroups = groups.map((group) => {
    const target = byKey.get(group._key);
    if (!target || group.detail?._ref) return group;

    const descriptionShortened = group.description !== target.cardSummary;
    changes.push({ groupName: group.name, documentId: target.documentId, descriptionShortened });
    return {
      ...group,
      description: target.cardSummary,
      detail: { _type: 'reference' as const, _ref: target.documentId },
    };
  });

  return { groups: updatedGroups, changes };
}
