export interface StarterChineseFellowship {
  slug: string;
  name: string;
  meetingTime: string;
  summary: string;
  image: string;
}

/**
 * Reliable public starter pages for the fellowships currently shown on the
 * Chinese Ministry overview. Sanity Ministry documents replace this content
 * after editors link and publish them from the Grow Page.
 */
export const starterChineseFellowships: StarterChineseFellowship[] = [
  {
    slug: 'gospel-group',
    name: '福音組',
    meetingTime: '週日 11:00 AM',
    summary: '以福音為核心的小組，歡迎慕道友與初信者一同認識信仰。',
    image: '/images/church/epp-2025-discipleship-group.webp',
  },
  {
    slug: 'family-fellowship',
    name: '家庭組',
    meetingTime: '週六 7:00 PM',
    summary: '以家庭為單位的團契，在信仰與生活中彼此扶持。',
    image: '/images/church/bbq-2025-intergenerational-table.webp',
  },
  {
    slug: 'campus-fellowship',
    name: '校園組',
    meetingTime: '週五 7:30 PM',
    summary: '大學生與研究生團契，在校園生活中一起成長。',
    image: '/images/church/bbq-2025-campus-fellowship.webp',
  },
  {
    slug: 'young-professionals',
    name: '職青組',
    meetingTime: '週五 7:30 PM',
    summary: '為職場青年預備的團契，在工作與信仰中尋找方向。',
    image: '/images/church/bbq-2025-young-adults-group.webp',
  },
  {
    slug: 'senior-fellowship',
    name: '長青組',
    meetingTime: '週三 10:00 AM',
    summary: '為年長弟兄姊妹預備的團契，一同查經、分享與代禱。',
    image: '/images/church/epp-2025-senior-table.webp',
  },
];
