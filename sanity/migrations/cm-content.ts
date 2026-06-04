/**
 * Current CMS Bootstrap Content
 *
 * Seeds the Sanity documents that match the current FICCC site structure:
 * / splash, /en/*, /zh/*, and the eight /{lang}/grow/{audience} pages.
 *
 * Usage:
 *   DRY RUN: SANITY_PROJECT_ID=... npx tsx sanity/migrations/cm-content.ts
 *   LIVE:    SANITY_PROJECT_ID=... SANITY_API_WRITE_TOKEN=sk-... npx tsx sanity/migrations/cm-content.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

const projectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error('Missing SANITY_PROJECT_ID. Set it in .env or pass it as an environment variable.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2026-03-31',
  useCdn: false,
});

const dryRun = !token;

type PTBlock = {
  _type: 'block';
  _key: string;
  style: 'normal';
  markDefs: [];
  children: Array<{ _type: 'span'; _key: string; text: string; marks: [] }>;
};

function pt(text: string, key: string): PTBlock {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }],
  };
}

function group(key: string, name: string, meetingTime: string, description: string) {
  return { _type: 'growGroup', _key: key, name, meetingTime, description };
}

const serviceTimesEn = [
  { _type: 'serviceTime', _key: 'english-worship', label: 'English Worship', time: '9:45 AM' },
  { _type: 'serviceTime', _key: 'discipleship-groups', label: 'Discipleship Groups', time: '11:00 AM' },
  { _type: 'serviceTime', _key: 'chinese-worship', label: 'Chinese Worship', time: '11:15 AM' },
];

const serviceTimesZh = [
  { _type: 'serviceTime', _key: 'english-worship', label: '英文崇拜', time: '上午 9:45' },
  { _type: 'serviceTime', _key: 'discipleship-groups', label: '門徒小組', time: '上午 11:00' },
  { _type: 'serviceTime', _key: 'chinese-worship', label: '中文崇拜', time: '上午 11:15' },
];

const documents = [
  {
    _id: 'splashPage',
    _type: 'splashPage',
    isVisible: true,
    churchNameEn: 'First Ithaca Chinese Christian Church',
    churchNameZh: '伊的家華人基督教會',
  },
  {
    _id: 'siteSettings-en',
    _type: 'siteSettings',
    language: 'en',
    churchName: 'First Ithaca Chinese Christian Church',
    address: '429 Mitchell Street',
    city: 'Ithaca, NY 14850',
    phone: '(607) 273-1223',
    email: 'info@ficcc.org',
    serviceTimes: serviceTimesEn,
    announcementBarEnabled: false,
  },
  {
    _id: 'siteSettings-zh',
    _type: 'siteSettings',
    language: 'zh',
    churchName: '伊的家華人基督教會',
    address: '429 Mitchell Street',
    city: 'Ithaca, NY 14850',
    phone: '(607) 273-1223',
    email: 'info@ficcc.org',
    serviceTimes: serviceTimesZh,
    announcementBarEnabled: false,
  },
  {
    _id: 'homePage-en',
    _type: 'homePage',
    isVisible: true,
    language: 'en',
    heroMediaType: 'video',
    heroTitle: 'Welcome Home',
    heroSubtitle: 'Go deeper in God\'s Word, in gospel-shaped community, and in everyday discipleship.',
    heroCtaText: 'Plan Your Visit',
    heroCtaHref: '/en/visit',
    bannerHeading: 'Bridging Cultures & Generations',
    bannerBody: [
      pt('We celebrate our Chinese heritage while building a church home that welcomes students, families, and neighbors of every background.', 'home-en-banner'),
    ],
    bannerCtaText: 'Get in touch',
    bannerCtaHref: '/en/contact',
  },
  {
    _id: 'homePage-zh',
    _type: 'homePage',
    isVisible: true,
    language: 'zh',
    heroMediaType: 'video',
    heroTitle: '歡迎回家',
    heroSubtitle: '在神的話語中更深扎根，在以福音為中心的群體中成長，在日常門訓中被建立。',
    heroCtaText: '規劃你的來訪',
    heroCtaHref: '/zh/sundays',
    bannerHeading: '連結文化與世代',
    bannerBody: [
      pt('我們珍惜華人傳統，同時建立一個歡迎學生、家庭和各背景鄰舍的教會家園。', 'home-zh-banner'),
    ],
    bannerCtaText: '與我們聯繫',
    bannerCtaHref: '/zh/contact',
  },
  {
    _id: 'aboutPage-en',
    _type: 'aboutPage',
    isVisible: true,
    language: 'en',
    whoWeAreHeading: 'Who We Are',
    whoWeAreBody: [
      pt('First Ithaca Chinese Christian Church is a Chinese-heritage, university-adjacent Christian community in Ithaca, NY.', 'about-en-1'),
      pt('We gather every Sunday at 429 Mitchell Street for worship, teaching, fellowship, and discipleship in English and Mandarin.', 'about-en-2'),
    ],
    timelineHeading: 'Our Story',
    beliefsCalloutHeading: 'What do we believe?',
  },
  {
    _id: 'aboutPage-zh',
    _type: 'aboutPage',
    isVisible: true,
    language: 'zh',
    whoWeAreHeading: '我們是誰',
    whoWeAreBody: [
      pt('伊的家華人基督教會是在紐約伊薩卡服事學生、家庭與社區鄰舍的華人基督教會。', 'about-zh-1'),
      pt('我們每週日在 429 Mitchell Street 聚會，以中英雙語敬拜、教導、團契並彼此建立。', 'about-zh-2'),
    ],
    timelineHeading: '我們的故事',
    beliefsCalloutHeading: '我們相信什麼？',
  },
  {
    _id: 'beliefsPage-en',
    _type: 'beliefsPage',
    isVisible: true,
    language: 'en',
    heroTitle: 'Beliefs & Vision',
    heroSubtitle: 'Rooted in Scripture, shaped by grace, living on mission.',
    beliefsHeading: 'What We Believe',
    visionHeading: 'Our Vision',
  },
  {
    _id: 'beliefsPage-zh',
    _type: 'beliefsPage',
    isVisible: true,
    language: 'zh',
    heroTitle: '信仰與願景',
    heroSubtitle: '扎根聖經，靠恩典塑造，活出使命。',
    beliefsHeading: '我們的信仰',
    visionHeading: '我們的異象',
  },
  {
    _id: 'visitPage-en',
    _type: 'visitPage',
    isVisible: true,
    language: 'en',
    heroTitle: 'Plan Your Visit',
    heroSubtitle: 'Everything you need to know for your first Sunday with us',
    schedule: [
      { _type: 'scheduleItem', _key: 'gathering', label: 'Sunday Gathering', time: '9:45 AM' },
      { _type: 'scheduleItem', _key: 'school', label: 'Sunday School', time: '11:15 AM' },
    ],
    rideRequestEnabled: true,
  },
  {
    _id: 'visitPage-zh',
    _type: 'visitPage',
    isVisible: true,
    language: 'zh',
    heroTitle: '主日聚會',
    heroSubtitle: '您第一次來教會需要知道的一切',
    schedule: [
      { _type: 'scheduleItem', _key: 'worship', label: '華語崇拜', time: '11:15 AM' },
      { _type: 'scheduleItem', _key: 'groups', label: '門徒小組', time: '11:00 AM' },
    ],
    rideRequestEnabled: true,
  },
  {
    _id: 'resourcesPage-en',
    _type: 'resourcesPage',
    isVisible: true,
    language: 'en',
    heroTitle: 'Resources',
    heroSubtitle: 'Tools for spiritual growth, reading plans, and campus connections',
  },
  {
    _id: 'resourcesPage-zh',
    _type: 'resourcesPage',
    isVisible: false,
    language: 'zh',
    heroTitle: '資源',
    heroSubtitle: '屬靈成長、讀經計畫與校園連結',
  },
  {
    _id: 'givePage-en',
    _type: 'givePage',
    isVisible: true,
    language: 'en',
    heroTitle: 'Give',
    heroSubtitle: 'Your generosity makes a difference',
    whyWeGiveHeading: 'Why We Give',
    questionsHeading: 'Questions?',
  },
  {
    _id: 'givePage-zh',
    _type: 'givePage',
    isVisible: true,
    language: 'zh',
    heroTitle: '奉獻',
    heroSubtitle: '您的慷慨帶來改變',
    whyWeGiveHeading: '為什麼奉獻',
    questionsHeading: '有問題嗎？',
  },
  {
    _id: 'contactPage-en',
    _type: 'contactPage',
    isVisible: true,
    language: 'en',
    heroTitle: 'Contact Us',
    heroSubtitle: 'We\'d love to hear from you',
    formEnabled: true,
  },
  {
    _id: 'contactPage-zh',
    _type: 'contactPage',
    isVisible: true,
    language: 'zh',
    heroTitle: '聯繫我們',
    heroSubtitle: '我們期待與您聯繫',
    formEnabled: true,
  },
  {
    _id: 'growPage-en-english',
    _type: 'growPage',
    isVisible: true,
    language: 'en',
    audience: 'english',
    title: 'English Ministry | FICCC',
    description: 'English ministry gatherings and groups at First Ithaca Chinese Christian Church.',
    navLabel: 'English',
    pageTitle: 'English Ministry',
    heroTitle: 'English Ministry',
    heroSubtitle: 'Grow in God\'s Word, community, and everyday discipleship.',
    intro: 'The English ministry gathers people across students, families, working adults, and long-time Ithaca neighbors.',
    listingHeading: 'Meetings & Groups',
    groups: [
      group('english-worship', 'Sunday Gathering', 'Sundays 9:45 AM', 'Worship through singing, prayer, Scripture, preaching, and the Lord\'s Supper.'),
      group('english-dg', 'Discipleship Groups', 'Sundays 11:00 AM', 'Small groups for deeper Bible study, prayer, and mutual encouragement after worship.'),
      group('english-midweek', 'Midweek Bible Study', 'Thursdays 7:00 PM', 'A weekly evening study open to everyone who wants to dig into Scripture together.'),
      group('english-prayer', 'Monthly Prayer Meeting', '1st Wednesday 7:30 PM', 'A monthly gathering to pray together for our church, community, and world.'),
    ],
  },
  {
    _id: 'growPage-en-chinese',
    _type: 'growPage',
    isVisible: true,
    language: 'en',
    audience: 'chinese',
    title: 'Chinese Ministry | FICCC',
    description: 'Chinese ministry fellowships and groups at First Ithaca Chinese Christian Church.',
    navLabel: 'Chinese',
    pageTitle: 'Chinese Ministry',
    heroTitle: 'Chinese Ministry',
    heroSubtitle: 'A Mandarin-speaking church family for worship, fellowship, and discipleship.',
    intro: 'The Chinese ministry includes fellowship groups for students, families, young professionals, and older adults.',
    listingHeading: 'Fellowship Groups',
    groups: [
      group('chinese-gospel', 'Gospel Group', 'Sundays 11:00 AM', 'A gospel-centered group for seekers, new believers, and anyone exploring Christian faith.'),
      group('chinese-family', 'Family Fellowship', 'Saturdays 7:00 PM', 'A fellowship for families to grow together through Scripture, prayer, and shared life.'),
      group('chinese-campus', 'Campus Fellowship', 'Fridays 7:30 PM', 'A group for undergraduate and graduate students navigating faith and campus life.'),
      group('chinese-young-pros', 'Young Professionals', 'Fridays 7:30 PM', 'A fellowship for young adults seeking Christ-centered community in work and life.'),
      group('chinese-seniors', 'Senior Fellowship', 'Wednesdays 10:00 AM', 'A fellowship for older adults to study Scripture, share life, and pray together.'),
    ],
  },
  {
    _id: 'growPage-en-youth',
    _type: 'growPage',
    isVisible: true,
    language: 'en',
    audience: 'youth',
    title: 'Youth Ministry | FICCC',
    description: 'Youth ministry gatherings for middle and high school students at FICCC.',
    navLabel: 'Youth',
    pageTitle: 'Youth Ministry',
    heroTitle: 'Youth Ministry',
    heroSubtitle: 'A place for middle and high school students to grow in faith and friendship.',
    intro: 'Youth ministry creates space for students to ask good questions, build friendships, and follow Jesus together.',
    listingHeading: 'Meetings & Groups',
    groups: [
      group('youth-group', 'Youth Group', 'Fridays 7:30 PM', 'Fellowship, teaching, discussion, and fun for middle and high school students.'),
      group('youth-class', 'Youth Sunday Class', 'Sundays 11:15 AM', 'Age-appropriate Bible teaching and conversation during the Sunday School hour.'),
    ],
  },
  {
    _id: 'growPage-en-children',
    _type: 'growPage',
    isVisible: true,
    language: 'en',
    audience: 'children',
    title: 'Children\'s Ministry | FICCC',
    description: 'Children\'s ministry and Sunday School at First Ithaca Chinese Christian Church.',
    navLabel: 'Children',
    pageTitle: 'Children\'s Ministry',
    heroTitle: 'Children\'s Ministry',
    heroSubtitle: 'Helping children know God through Scripture, care, and age-appropriate teaching.',
    intro: 'Children\'s ministry supports families by providing safe, welcoming spaces for kids to learn about God.',
    listingHeading: 'Classes & Care',
    groups: [
      group('children-school', 'Children\'s Sunday School', 'Sundays 11:15 AM', 'Age-appropriate Bible teaching and activities for kids during the Sunday School hour.'),
      group('children-care', 'Sunday Care', 'Sundays during worship and classes', 'Care options for children while parents participate in worship, groups, or classes.'),
    ],
  },
  {
    _id: 'growPage-zh-english',
    _type: 'growPage',
    isVisible: true,
    language: 'zh',
    audience: 'english',
    title: '英語事工 | 伊的家華人基督教會',
    description: '伊的家華人基督教會英語事工的聚會與小組。',
    navLabel: '英語事工',
    pageTitle: '英語事工',
    heroTitle: '英語事工',
    heroSubtitle: '在神的話語、群體與日常門訓中一同成長。',
    intro: '英語事工連結學生、家庭、職場人士與長住伊薩卡的鄰舍。',
    listingHeading: '聚會與小組',
    groups: [
      group('english-worship-zh', '英語崇拜', '週日 9:45 AM', '透過詩歌、禱告、讀經、講道與主餐一同敬拜。'),
      group('english-dg-zh', '門徒小組', '週日 11:00 AM', '崇拜後的小組查經、禱告與彼此扶持。'),
      group('english-midweek-zh', '週間查經', '週四 7:00 PM', '開放給所有人的週間查經，一同更深認識聖經。'),
      group('english-prayer-zh', '月禱會', '每月第一個週三 7:30 PM', '為教會、社區與世界一同禱告的聚會。'),
    ],
  },
  {
    _id: 'growPage-zh-chinese',
    _type: 'growPage',
    isVisible: true,
    language: 'zh',
    audience: 'chinese',
    title: '華語事工 | 伊的家華人基督教會',
    description: '伊的家華人基督教會華語事工的團契與小組。',
    navLabel: '華語事工',
    pageTitle: '華語事工',
    heroTitle: '華語事工',
    heroSubtitle: '以華語敬拜、團契與門訓彼此建立。',
    intro: '華語事工包括適合學生、家庭、職青與長者的團契小組。',
    listingHeading: '團契小組',
    groups: [
      group('chinese-gospel-zh', '福音組', '週日 11:00 AM', '以福音為核心的小組，歡迎慕道友與初信者一同認識信仰。'),
      group('chinese-family-zh', '家庭組', '週六 7:00 PM', '以家庭為單位的團契，在信仰與生活中彼此扶持。'),
      group('chinese-campus-zh', '校園組', '週五 7:30 PM', '大學生與研究生團契，在校園生活中一起成長。'),
      group('chinese-young-pros-zh', '職青組', '週五 7:30 PM', '為職場青年預備的團契，在工作與信仰中尋找方向。'),
      group('chinese-seniors-zh', '長青組', '週三 10:00 AM', '為年長弟兄姊妹預備的團契，一同查經、分享與代禱。'),
    ],
  },
  {
    _id: 'growPage-zh-youth',
    _type: 'growPage',
    isVisible: true,
    language: 'zh',
    audience: 'youth',
    title: '青少年事工 | 伊的家華人基督教會',
    description: '伊的家華人基督教會為國中與高中生預備的青少年事工。',
    navLabel: '青少年',
    pageTitle: '青少年事工',
    heroTitle: '青少年事工',
    heroSubtitle: '幫助國中與高中生在信仰與友誼中成長。',
    intro: '青少年事工提供學生提問、建立友誼、並一同跟隨耶穌的空間。',
    listingHeading: '聚會與小組',
    groups: [
      group('youth-group-zh', '青少年組', '週五 7:30 PM', '為國中及高中生預備的團契、教導、討論與活動。'),
      group('youth-class-zh', '青少年主日課程', '週日 11:15 AM', '在主日學時段提供適合青少年的聖經教導與討論。'),
    ],
  },
  {
    _id: 'growPage-zh-children',
    _type: 'growPage',
    isVisible: true,
    language: 'zh',
    audience: 'children',
    title: '兒童事工 | 伊的家華人基督教會',
    description: '伊的家華人基督教會的兒童主日學與兒童照顧。',
    navLabel: '兒童',
    pageTitle: '兒童事工',
    heroTitle: '兒童事工',
    heroSubtitle: '透過聖經、關懷與適齡教導幫助孩子認識神。',
    intro: '兒童事工幫助家庭，為孩子提供安全、溫暖、適合年齡的學習空間。',
    listingHeading: '課程與照顧',
    groups: [
      group('children-school-zh', '兒童主日學', '週日 11:15 AM', '為孩子們預備的聖經教導與活動，幫助他們從小認識神。'),
      group('children-care-zh', '主日兒童照顧', '主日崇拜與課程時段', '在家長參加崇拜、小組或課程時，提供兒童照顧選項。'),
    ],
  },
];

async function main() {
  console.log(
    `${dryRun ? 'DRY RUN' : 'LIVE'}: ${documents.length} documents for project "${projectId}" dataset "${dataset}"`,
  );

  if (dryRun) {
    for (const doc of documents) {
      console.log(`${doc._id} (${doc._type})`);
    }
    return;
  }

  const tx = client.transaction();
  for (const doc of documents) {
    tx.createOrReplace(doc);
  }

  const result = await tx.commit();
  console.log(`Seeded ${documents.length} documents.`);
  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
