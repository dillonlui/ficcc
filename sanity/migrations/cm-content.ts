/**
 * Current CMS Bootstrap Content
 *
 * Seeds missing Sanity documents that match the current FICCC site structure:
 * / splash, /en/*, /zh/*, and the eight /{lang}/grow/{audience} pages.
 *
 * Usage:
 *   DRY RUN: SANITY_PROJECT_ID=... npx tsx sanity/migrations/cm-content.ts
 *   LIVE:    SANITY_PROJECT_ID=... SANITY_API_WRITE_TOKEN=sk-... npx tsx sanity/migrations/cm-content.ts
 *
 * This migration intentionally never overwrites an existing document. Run it
 * before adding new schema requirements so production editorial content stays
 * intact and can be completed in Studio at the editor's pace.
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

function blocks(prefix: string, paragraphs: string[]): PTBlock[] {
  return paragraphs.map((paragraph, index) => pt(paragraph, `${prefix}-${index + 1}`));
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

/**
 * Content that originally lived only in page-level resilience fallbacks.
 *
 * This is intentionally kept separate from `documents`: the bootstrap uses
 * `createIfNotExists`, while this map also patches pre-existing singleton
 * documents without replacing an editor's already-populated field.
 */
const fallbackBackfill: Record<string, Record<string, unknown>> = {
  'homePage-en': {
    sections: [
      { _type: 'homeSection', _key: 'go-deeper', heading: 'Go Deeper at FICCC', body: blocks('home-en-deeper', ["If you've lived in Ithaca for years, just arrived as a visiting scholar, or are a student far from home, there is a place for you here."]), imageAlt: 'FICCC church family gathered together outdoors', ctaText: 'Learn more about us', ctaHref: '/en/about', layout: 'default', tinted: false },
      { _type: 'homeSection', _key: 'sunday-mornings', heading: 'Sunday Mornings', body: blocks('home-en-sunday', ['At 9:45am we gather for singing, preaching from the Bible, and the Lord\'s Supper. At 11:00am we move into Discipleship Groups for discussion and prayer. Then we eat lunch together - usually Chinese food.']), imageAlt: 'FICCC members singing together outdoors', ctaText: 'Plan your first visit', ctaHref: '/en/visit', layout: 'reversed', tinted: true },
      { _type: 'homeSection', _key: 'community', heading: 'Find Community', body: blocks('home-en-community', ['Bible studies, fellowship groups, mission trips, and shared meals. We challenge people to get involved in serving - in our church, on campus, and in the Ithaca community.']), imageAlt: 'FICCC members from different generations gathered together', ctaText: 'Explore ministries', ctaHref: '/en/grow/english', layout: 'default', tinted: false },
      { _type: 'homeSection', _key: 'sermons', heading: 'Watch Sermons', body: blocks('home-en-sermons', ['Catch up on recent messages or explore past teaching series. Our English ministry uploads sermons weekly to YouTube.']), imageAlt: 'FICCC members singing with guitar outdoors', ctaText: 'Browse sermons', ctaHref: '/en/sermons', layout: 'reversed', tinted: true },
    ],
  },
  'homePage-zh': {
    sections: [
      { _type: 'homeSection', _key: 'deeper', heading: '在伊的家更深扎根', body: blocks('home-zh-deeper', ['無論你已在伊薩卡生活多年、剛以訪問學者身份來到這裡，或是遠離家鄉的學生，這裡都有你的位置。']), imageAlt: '伊的家教會家庭在戶外聚集', ctaText: '認識我們', ctaHref: '/zh/about', layout: 'default', tinted: false },
      { _type: 'homeSection', _key: 'sundays', heading: '主日早晨', body: blocks('home-zh-sundays', ['上午9:45，我們透過詩歌、聖經講道和聖餐一同敬拜。上午11:00，我們進入門徒小組討論和禱告，然後一起享用午餐。']), imageAlt: '伊的家會眾在戶外一同敬拜', ctaText: '規劃你的來訪', ctaHref: '/zh/sundays', layout: 'reversed', tinted: true },
      { _type: 'homeSection', _key: 'community', heading: '建立群體生活', body: blocks('home-zh-community', ['查經班、團契小組、短宣和共享的餐點。我們鼓勵大家參與服事——在教會、校園和伊薩卡社區中。']), imageAlt: '不同世代的伊的家會眾聚集', ctaText: '探索事工', ctaHref: '/zh/grow/chinese', layout: 'default', tinted: false },
      { _type: 'homeSection', _key: 'sermons', heading: '觀看講道', body: blocks('home-zh-sermons', ['收看最近的信息，或探索過去的講道系列。華語事工定期上傳講道。']), imageAlt: '伊的家會眾以吉他敬拜', ctaText: '瀏覽講道', ctaHref: '/zh/sermons', layout: 'reversed', tinted: true },
    ],
  },
  'visitPage-en': {
    whatToExpect: blocks('visit-en-expect', ["Whether it's your first time at church or you've been part of a community before, you're welcome here just as you are.", 'Dress code: Come as you are. Most people dress casually. You\'ll see everything from jeans to button-downs.', 'What happens on Sunday: Our gathering includes worship through singing, prayer, Scripture reading, and a sermon. Services are primarily in English with occasional bilingual elements.', 'Kids are welcome: Children are always welcome in the main service. We also offer age-appropriate Sunday School classes after the gathering.', 'How long is the service? The Sunday gathering typically lasts about 75 minutes.']),
    transportation: blocks('visit-en-transport', ['Address: 429 Mitchell Street, Ithaca, NY 14850', 'Parking: Free parking is available in our lot adjacent to the building. Street parking is also available on Mitchell Street and nearby side streets.', "Near Cornell: We're a short drive from Cornell University's campus. If you're a student without a car, we'd be happy to help arrange a ride. Just ask!", 'Public transit: TCAT bus routes serve the area. Check tcatbus.com for schedules.']),
    faqItems: [
      { _type: 'faqItem', _key: 'dress', question: 'What should I wear?', answer: "There's no dress code. Come as you are. Most people dress casually." },
      { _type: 'faqItem', _key: 'children', question: 'Are children welcome?', answer: 'Absolutely! Children are welcome in the main service, and we offer Sunday School classes for different age groups after the gathering.' },
      { _type: 'faqItem', _key: 'language', question: 'What language is the service in?', answer: 'Our services are primarily in English with occasional bilingual (English/Chinese) elements. Everyone is welcome regardless of language background.' },
      { _type: 'faqItem', _key: 'parking', question: 'Is there parking available?', answer: 'Yes! Free parking is available in our lot next to the building, and street parking is available nearby.' },
      { _type: 'faqItem', _key: 'duration', question: 'How long is the service?', answer: 'The Sunday gathering typically lasts about 75 minutes. Sunday School classes follow at 11:15 AM and run for about 45 minutes.' },
      { _type: 'faqItem', _key: 'connect', question: 'How can I get connected during the week?', answer: "We'd love to help you find community! After the service, stop by the welcome table to learn about small groups, Bible studies, and other ways to connect. You can also reach out through our contact page." },
    ],
    rideRequestHeading: 'Need a Ride?',
    rideRequestIntro: "Don't have a car? No problem. We'd love to pick you up! Fill out the form below and someone from our team will reach out to arrange a ride.",
  },
  'visitPage-zh': {
    whatToExpect: blocks('visit-zh-expect', ['無論您是第一次來教會，還是曾經參加過其他教會，都歡迎您如實地來到這裡。', '穿著：隨意穿著即可，大多數人穿休閒服裝。', '主日流程：聚會包括詩歌敬拜、禱告、讀經和講道。崇拜以中文為主，部分環節為雙語。', '歡迎孩子：兒童隨時歡迎參加主堂崇拜。崇拜後我們也提供按年齡分組的主日學課程。', '聚會多長時間？主日崇拜通常約75分鐘。']),
    transportation: blocks('visit-zh-transport', ['地址：429 Mitchell Street, Ithaca, NY 14850', '停車：教會旁設有免費停車場。Mitchell Street 及附近街道也有路邊停車位。', '靠近康奈爾：我們距離康奈爾大學校園很近。如果您是沒有車的學生，我們很樂意安排接送，請與我們聯繫！', '公共交通：TCAT公車可到達附近地區。請查詢 tcatbus.com 了解時刻表。']),
    busRouteHeading: '主日接送巴士路線',
    busRouteIntro: '每週日早上，教會提供免費接送巴士服務。以下為七站路線及預計到達時間：',
    busRoute: ['教會（429 Mitchell St）', 'Hasbrouck Apartments', 'Collegetown（College Ave & Dryden）', 'North Campus（Robert Purcell）', 'Ithaca Commons', 'East Hill Plaza', '返回教會（429 Mitchell St）'].map((stop, index) => ({ _type: 'busStop', _key: `bus-${index + 1}`, stop, time: ['9:00 AM', '9:10 AM', '9:15 AM', '9:22 AM', '9:30 AM', '9:35 AM', '9:40 AM'][index] })),
    faqItems: [
      ['應該穿什麼？', '沒有穿著要求，隨意穿著即可。大多數人穿休閒服裝。'], ['歡迎兒童嗎？', '當然！兒童隨時歡迎參加主堂崇拜，崇拜後我們也提供按年齡分組的主日學課程。'], ['崇拜使用什麼語言？', '我們的崇拜以中文為主，部分環節為雙語（中英文）。無論您的語言背景如何，都歡迎您。'], ['有停車位嗎？', '有！教會旁設有免費停車場，附近街道也有路邊停車位。'], ['聚會多長時間？', '主日崇拜通常約75分鐘。主日學在11:15 AM開始，約45分鐘。'], ['平日如何聯繫教會？', '我們很期待幫助您融入社區！聚會後請到歡迎桌了解小組、查經班和其他連結方式。您也可以通過我們的聯繫頁面與我們溝通。'],
    ].map(([question, answer], index) => ({ _type: 'faqItem', _key: `faq-${index + 1}`, question, answer })),
    rideRequestHeading: '需要接送嗎？',
    rideRequestIntro: '沒有車？沒問題，我們很樂意接送您！請填寫以下表格，我們的同工會與您聯繫安排接送。',
  },
  'givePage-en': {
    whyWeGiveBody: blocks('give-en-why', ['Giving is an act of worship and trust. When we give generously, we participate in God\'s work: supporting our church community, caring for those in need, and sharing the good news of Jesus Christ.', 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver. — 2 Corinthians 9:7 (NIV)', "Whether it's your first time giving or you've been supporting our church for years, every gift helps us continue serving our community in Ithaca and beyond. Thank you for your faithfulness."]),
    scriptureQuote: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.', scriptureCitation: '2 Corinthians 9:7 (NIV)',
    givingMethods: [
      { _type: 'givingMethod', _key: 'paypal', title: 'Online via PayPal', description: 'Give securely online using PayPal. You can use a PayPal account, debit card, or credit card.', icon: 'globe', link: 'https://www.paypal.com/donate/?cmd=_donations&business=ficccfinance1%40gmail.com&item_name=First+Ithaca+Chinese+Christian+Church+Offering&currency_code=USD&source=url', linkText: 'Give with PayPal' },
      { _type: 'givingMethod', _key: 'check', title: 'By Check', description: 'Make checks payable to First Ithaca Chinese Christian Church and mail to:', icon: 'envelope', address: 'First Ithaca Chinese Christian Church\n429 Mitchell Street\nIthaca, NY 14850' },
      { _type: 'givingMethod', _key: 'person', title: 'In Person', description: 'Offering envelopes are available at our Sunday service. You can place your gift in the offering box located in the sanctuary.', icon: 'people', note: 'Sundays at 9:45 AM · 429 Mitchell Street' },
    ],
    questionsBody: "If you have questions about giving, tax-deductible receipts, or other ways to support our church, please don't hesitate to reach out.",
  },
  'givePage-zh': {
    whyWeGiveBody: blocks('give-zh-why', ['奉獻是敬拜和信靠的行動。當我們慷慨奉獻時，我們參與了神的事工：支持教會群體、關懷有需要的人、傳揚耶穌基督的福音。', '各人要隨本心所酌定的，不要作難，不要勉強，因為捐得樂意的人是神所喜愛的。— 哥林多後書 9:7', '無論您是第一次奉獻還是多年來一直支持我們教會，每一份奉獻都幫助我們繼續服事伊薩卡及周邊社區。感謝您的忠心。']),
    scriptureQuote: '各人要隨本心所酌定的，不要作難，不要勉強，因為捐得樂意的人是神所喜愛的。', scriptureCitation: '哥林多後書 9:7',
    givingMethods: [
      { _type: 'givingMethod', _key: 'paypal', title: '網上奉獻 / PayPal', description: '透過 PayPal 安全地進行網上奉獻。您可以使用 PayPal 帳戶、借記卡或信用卡。', icon: 'globe', link: 'https://www.paypal.com/donate/?cmd=_donations&business=ficccfinance1%40gmail.com&item_name=First+Ithaca+Chinese+Christian+Church+Offering&currency_code=USD&source=url', linkText: '透過 PayPal 奉獻' },
      { _type: 'givingMethod', _key: 'check', title: '支票奉獻', description: '支票抬頭請寫 First Ithaca Chinese Christian Church，並郵寄至：', icon: 'envelope', address: 'First Ithaca Chinese Christian Church\n429 Mitchell Street\nIthaca, NY 14850' },
      { _type: 'givingMethod', _key: 'person', title: '現場奉獻', description: '主日崇拜時備有奉獻信封。您可以將奉獻放入聖殿內的奉獻箱中。', icon: 'people', note: '每週日上午 11:15 · 429 Mitchell Street' },
    ],
    questionsBody: '如果您對奉獻、免稅收據或其他支持教會的方式有任何疑問，請隨時與我們聯繫。',
  },
  'resourcesPage-en': {
    heroSubtitle: 'A small, practical library for following Jesus through college and beyond.',
    resourceCategories: [
      { _type: 'resourceCategory', _key: 'college-life', title: 'College Life Recommendations', description: 'A practical guide for loving the Lord, the lost, and your local church throughout college—and long after graduation.', resources: [{ _type: 'resourceItem', _key: 'college-life-guide', title: 'College Life Recommendations', url: '/college-life-recommendations.pdf', description: 'A one-page guide prepared by FICCC for college students.', type: 'pdf' }] },
      { _type: 'resourceCategory', _key: 'membership', title: 'Baptism & Membership', description: 'We encourage Christians, including students, to commit to membership in a local church wherever God has placed them.', resources: [{ _type: 'resourceItem', _key: 'why-join', title: 'Why Join a Church?', url: 'https://www.9marks.org/article/why-join-a-church/', description: 'A short explanation from 9Marks on the purpose of church membership.', type: 'link' }] },
      { _type: 'resourceCategory', _key: 'faith-college', title: 'Keeping Your Faith in College', description: 'Classes, studying, and campus life can make it difficult to prioritize faith. This illustrated guide offers a helpful place to begin.', resources: [{ _type: 'resourceItem', _key: 'faith-college-guide', title: 'Keeping Your Faith in College', url: 'https://drive.google.com/file/d/14L_zeCjGJkJf-es8OP1nLgpkuWIJ6lpU/view?usp=drive_link', description: 'Open the illustrated guide in Google Drive.', type: 'link' }] },
      { _type: 'resourceCategory', _key: 'readathon', title: 'Bible Readathon', description: 'Read about two chapters a day and finish the Bible in two years, with a fresh schedule for each quarter of Scripture.', resources: [{ _type: 'resourceItem', _key: 'readathon-plan', title: 'Bible Readathon Reading Plan', url: '/readathon4.pdf', description: 'The current one-page reading schedule from the legacy resources page.', type: 'pdf' }] },
      { _type: 'resourceCategory', _key: 'campus', title: 'Cornell Campus Ministries', description: 'Christian fellowships and organizations serving students across Cornell. Each link opens the ministry’s own website or social profile.', resources: [
        ['Asian American InterVarsity (AAIV)', 'https://cornellaaiv.org/'], ['Chesterton House', 'https://chestertonhouse.org/'], ['Chinese Bible Study (CBS)', 'https://cbscornell.com/'], ['Christian Union', 'https://christianunion.org/cornell/'], ['Cru', 'https://www.crucornell.com/'], ['Fellowship of Christian Athletes (FCA)', 'https://www.instagram.com/fca_cornell/'], ['Cornell International Christian Fellowship (CICF)', 'https://www.cornellicf.org/'],
      ].map(([title, url], index) => ({ _type: 'resourceItem', _key: `campus-${index + 1}`, title, url, type: 'link' })) },
    ],
  },
  'aboutPage-en': {
    whoWeAreBody: blocks('about-en-body', ['First Ithaca Chinese Christian Church (FICCC) was founded in 1968 by a small group of Chinese graduate students and scholars at Cornell University who longed for a Christ-centered community where they could worship in their heart language while welcoming the broader Ithaca community.', 'Over the decades the church has grown from that small group into a congregation that bridges Chinese heritage and American life. We gather every Sunday at 429 Mitchell Street for worship, teaching, and fellowship in English and Mandarin, serving students, families, and neighbors throughout the Finger Lakes region.', 'Our mission is to glorify God by making disciples of Jesus Christ who love God wholeheartedly, love one another sacrificially, and reach out to the world with the Gospel. We believe the local church is God\'s primary instrument for advancing His kingdom, and we are committed to equipping every member for a life of faithful service.', "If you've lived in Ithaca for years, just arrived as a visiting scholar, or are a student far from home, there is a place for you at FICCC. Come as you are."]),
    snapshots: [
      { _type: 'snapshot', _key: 'years', accent: '40+ years in Ithaca', body: 'Worshiping, studying Scripture, and sharing life together at Cornell and throughout Ithaca.' },
      { _type: 'snapshot', _key: 'family', accent: 'A church family of ~100', body: 'Students, scholars, and longtime Ithaca residents walking with Christ together.' },
      { _type: 'snapshot', _key: 'alumni', accent: 'Countless alumni', body: 'Now serving in churches and communities across the US, Canada, and Asia - carrying what they learned here into the rest of their lives.' },
    ],
    pastors: [
      { _type: 'pastor', _key: 'zhida', name: 'Min. Zhida Zhu (朱志達)', role: 'Pastor of English Ministry', bio: blocks('pastor-zhida-en', ['Zhida grew up in an immigrant church in Houston, Texas. After declaring himself an atheist in high school, God powerfully changed his heart through three key individuals after college, and he gave his life to Christ. He served as a mechanical engineer for six years before answering the call to full-time ministry. Zhida is married to Ngun, whom he met at Dallas Theological Seminary.']) },
      { _type: 'pastor', _key: 'simon', name: 'Min. Simon Ye (葉劍峰)', role: 'Pastor of Chinese Ministry', bio: blocks('pastor-simon-en', ['Pastor Simon leads the Chinese-speaking congregation, shepherding families, fellowship groups, and community ministries.']) },
    ],
    timelineEras: [
      { _type: 'timelineEra', _key: 'beginnings', title: 'Beginnings: Student Fellowship to Church (1968-1988)', entries: [['1968', 'Chinese graduate students and scholars at Cornell University start a Bible study group.'], ['1974', 'The Bible study grows into a regular Sunday worship gathering.'], ['1983', 'The fellowship formalizes its organization and begins systematic discipleship training.'], ['1986', 'First Ithaca Chinese Christian Church is officially established as an independent congregation.'], ['1988', 'The church purchases a house at 1462 Slaterville Road and converts it into a church building.']].map(([year, description], index) => ({ _type: 'timelineEntry', _key: `beginnings-${index + 1}`, year, description })) },
      { _type: 'timelineEra', _key: 'roots', title: 'Putting Down Roots in Ithaca (1988-2000)', entries: [['1993', 'The church purchases 429 Mitchell Street as its permanent home.'], ['1996', 'Pastoral staff is established; elders and deacons are appointed.'], ['1997', 'FICCC joins the Evangelical Free Church of America (EFCA).'], ['1997', 'Pastor Xin-Dao Xu begins serving as lead pastor.'], ['1998-1999', 'Youth fellowship and youth Sunday school are launched; a missions committee is formed and missions policy established.'], ['1999-2000', 'Additional ministry houses (such as the House of Joy) are purchased to support growing ministry.']].map(([year, description], index) => ({ _type: 'timelineEntry', _key: `roots-${index + 1}`, year, description })) },
      { _type: 'timelineEra', _key: 'english', title: 'Growing English Ministry & Next Generation (2000-2010)', entries: [['2000', 'English ministry launches, with the first English worship service on August 20.'], ['2001', 'FICCC partners with China Evangelical Seminary to offer annual theology extension courses in Ithaca.'], ['2002', 'The first church-wide retreat is held.'], ['2007', 'The church acquires additional property (House of Peace) behind the main building to support ministry needs.'], ['2008', 'Pastor Paul begins serving as English ministry pastor.'], ['2009', 'FICCC begins sending summer mission teams to lead VBS in Brooklyn, New York.']].map(([year, description], index) => ({ _type: 'timelineEntry', _key: `english-${index + 1}`, year, description })) },
      { _type: 'timelineEra', _key: 'continuing', title: 'Continuing the Mission (2010-Present)', entries: [{ _type: 'timelineEntry', _key: 'today', year: 'Today', description: 'FICCC continues to disciple students, scholars, and families; send members into full-time ministry; and invest in both Chinese- and English-speaking congregations in Ithaca and beyond.' }] },
    ],
    beliefsCalloutBody: "The Bible shapes everything we do. See what we hold to and where we're headed.",
  },
  'aboutPage-zh': {
    whoWeAreBody: blocks('about-zh-body', ['伊的家華人基督教會（FICCC）於1968年由一群在康奈爾大學就讀的華人研究生和學者創立，他們渴望建立一個以基督為中心的群體，在其中用自己的心靈語言敬拜，同時歡迎伊薩卡的各界朋友。', '幾十年來，教會從這個小小的團契成長為一個橋接華人傳統與美國文化的會眾。我們每週日在429 Mitchell Street聚會，以中英雙語進行敬拜、教導和團契，服事學生、家庭和整個手指湖地區的鄰舍。', '我們的使命是榮耀神，造就愛神、愛人、向世界傳福音的門徒。我們相信地方教會是神推進祂國度的首要工具，我們致力於裝備每位會眾過忠心服事的生活。', '無論你是伊薩卡的長期居民、剛到的訪問學者，還是遠離家鄉的學生，這裡都有你的位置。歡迎你的到來。']),
    snapshots: [{ _type: 'snapshot', _key: 'years', accent: '扎根伊薩卡40餘年', body: '在康奈爾和整個伊薩卡社區一同敬拜、研讀聖經、分享生命。' }, { _type: 'snapshot', _key: 'family', accent: '約100人的教會家庭', body: '學生、學者和伊薩卡長期居民一同與基督同行。' }, { _type: 'snapshot', _key: 'alumni', accent: '無數的校友', body: '現在服事於美國、加拿大和亞洲的教會和社區，將在這裡學到的帶入他們一生的服事中。' }],
    pastors: [{ _type: 'pastor', _key: 'simon', name: '葉劍峰傳道 (Simon Ye)', role: '中文部牧者', bio: blocks('pastor-simon-zh', ['葉傳道帶領中文會眾，牧養家庭、團契小組和社區事工。']) }, { _type: 'pastor', _key: 'zhida', name: '朱志達傳道 (Zhida Zhu)', role: '英文部牧者', bio: blocks('pastor-zhida-zh', ['志達在德州休士頓的一間華人移民教會長大。高中時自稱無神論者，但大學畢業後，神透過三位關鍵人物大大改變了他的心，他將生命獻給了基督。他曾擔任機械工程師六年，之後回應全職事工的呼召。志達與在達拉斯神學院認識的妻子Ngun結婚。']) }],
    timelineHeading: '教會歷史',
    timelineEras: [
      ['起源：從查經班到教會 (1968-1988)', [['1968', '康奈爾大學華人學生查經班成立。'], ['1974', '查經班發展為主日崇拜聚會。'], ['1983', '華人查經班正式組織化，開始有系統的門徒訓練。'], ['1986', '正式成立伊的家華人基督教會，成為獨立堂會。'], ['1988', '購買在1462 Slaterville Rd的房子，並轉換為教堂使用的建築。']]],
      ['在伊薩卡扎根 (1988-2000)', [['1993', '購置 429 Mitchell Street 現址作為永久會堂。'], ['1996', '成立教牧同工會，任命長老和執事。'], ['1997', '加入播道會（EFCA），以確保未來的教義純正。'], ['1997', '徐心道牧師開始擔任教會的牧師。'], ['1998-1999', '成立青少年團契和青少年主日學；制定宣教政策並成立宣教委員會。'], ['1999-2000', '購買 House of Joy 等事工房屋，支持不斷增長的事工。']]],
      ['英語事工與下一代 (2000-2010)', [['2000', '增加英語部，並於8月20日舉行第一次英語崇拜。'], ['2001', '與中國福音神學院合作，每年在伊薩卡開設神學延伸制課程。'], ['2002', '舉行第一次教會退修會。'], ['2007', '購買House of Peace（230 Ridgedale，教會後方的建築）。'], ['2008', '艾保羅牧師開始擔任英文部牧師。'], ['2009', '開始派遣短宣隊，每年夏天在紐約布魯克林市帶領暑期聖經學校。']]],
      ['繼續使命 (2010-至今)', [['今天', 'FICCC繼續門訓學生、學者和家庭；差派會員進入全職事工；並投資於伊薩卡及其他地方的中文和英文會眾。']]],
    ].map(([title, entries], eraIndex) => ({ _type: 'timelineEra', _key: `era-${eraIndex + 1}`, title, entries: (entries as string[][]).map(([year, description], index) => ({ _type: 'timelineEntry', _key: `era-${eraIndex + 1}-${index + 1}`, year, description })) })),
    beliefsCalloutBody: '聖經塑造了我們所做的一切。了解我們的信仰立場和異象方向。',
  },
  'beliefsPage-en': {
    beliefsIntro: 'These core convictions, rooted in Scripture, shape who we are as a church and how we live together as followers of Jesus Christ.',
    beliefs: [
      ['The Bible', "We believe the Scriptures of the Old and New Testaments to be the verbally inspired word of God, inerrant in the original writing, the supreme and final authority in all matters of faith and conduct, and the complete revelation of God's will for the salvation of man."],
      ['God', 'We believe that there is one God, eternally existent in three persons, the Father, the Son, and the Holy Spirit, who is the creator and sustainer of heaven and earth and everything therein.'],
      ['Christ', 'We believe that our Lord Jesus Christ, God the Son from eternity, was born of the virgin Mary, fully God and fully man, lived a sinless life, gave his life on the cross as an atoning sacrifice, was buried, on the third day was bodily resurrected from the dead, ascended into heaven, and shall personally return in power and glory.'],
      ['Holy Spirit', 'We believe that the Holy Spirit dwells in every believer, enabling him/her to live holy lives, and is ever present to testify of Christ.'],
      ['Man', 'We believe that man, created in the image of God, sinned, incurring both death and separation from God, which is spiritual death.'],
      ['Salvation', 'We believe that our salvation from death has been accomplished solely by the blood of our Lord Jesus Christ, that all who receive him by faith are born of God and sealed by the Holy Spirit until the day of judgment.'],
      ['Judgment', 'We believe in the resurrection of both the saved and the lost, of the saved to eternal life in the presence of God, and the lost to conscious everlasting punishment.'],
      ['Church', 'We believe in one holy universal church which is the body of Christ, to which all believers belong, and that the duty of the church is to proclaim the gospel of salvation to the world.'],
    ].map(([title, content], index) => ({ _type: 'beliefItem', _key: `belief-${index + 1}`, title, content: blocks(`belief-en-${index + 1}`, [content]) })),
    scriptureQuote: '"All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness, so that the servant of God may be thoroughly equipped for every good work."', scriptureCitation: '2 Timothy 3:16-17',
    visionItems: [
      ['Develop Humble Servants', 'This is embodied in Philippians 2:3-4: "Do nothing out of selfish ambition or vain conceit, but in humility consider others better than yourselves." Our church desires to develop in the lives of people a spirit of servanthood instead of a spirit of entitlement.', 'We challenge people in our English ministry to get involved in serving while they are living in Ithaca: in our church, as a mentor for refugees, or in a campus ministry. Our desire is that their lives would be characterized by a spirit of servanthood instead of entitlement.'],
      ['Love the Lord, the Lost, and the Local Church', 'This standard is stressed in I Corinthians 13:3. We desire to develop in people a motive of love instead of self-interest.', 'We hope our capacity for love will grow: love for the Lord through Scripture, prayer, and worship; love for the lost through friendship and the Gospel; and love for the local church through genuine community and the one-another commands of Scripture.'],
      ['For the Rest of Their Lives', 'Matthew 13:20-23 calls us to long-term growth rather than short periods of spiritual enthusiasm.', 'Our hope is that during their time in Ithaca, students develop such a strong servant heart that their love for the Lord, the lost, and the local church will continue to grow for the rest of their lives.'],
    ].map(([title, ...content], index) => ({ _type: 'visionItem', _key: `vision-${index + 1}`, title, content: blocks(`vision-en-${index + 1}`, content) })),
    calloutBody: 'From worship gatherings to small groups, discover how we live out these beliefs together.',
  },
  'beliefsPage-zh': {
    beliefsIntro: '以下核心信念根植於聖經，塑造了我們教會的身份，也指引我們作為耶穌基督跟隨者的共同生活。本信仰宣言遵循美國播道會（EFCA）十一條信仰宣言。',
    beliefs: [
      ['一、神', '我們相信獨一的真神，祂是永恆存在的三個位格：聖父、聖子、聖靈。每一位都完全是神，各有位格之分，卻在本質和目的上合而為一。祂是萬物的創造者、維持者和統治者。'], ['二、聖經', '我們相信聖經（舊約和新約）是神所默示的話語，在原稿中完全無誤。聖經是信仰和生活的最高和最終權威，是神啟示的完整記錄。'], ['三、人的境況', '我們相信神按自己的形像造人，但人因悖逆而墮落。全人類生來就有罪性，與神隔絕，處於神公義的審判之下。人無法靠自己的努力恢復與神的關係。'], ['四、耶穌基督', '我們相信耶穌基督是完全的神，也是完全的人。祂由童貞女馬利亞所生，過無罪的生活，行了神蹟，被釘在十字架上為罪人代死，第三天從死裡復活，升天坐在父神的右邊。'], ['五、基督十架的救贖', '我們相信主耶穌基督為我們的罪而死，作為替代的贖罪祭。凡相信祂的人，都因祂所流的寶血而被稱為義。祂的死是完全的、充分的，足以贖一切人的罪。'], ['六、聖靈', '我們相信聖靈叫世人知罪，使信徒重生，從得救的那一刻起內住在他們裡面，賜能力使他們過敬虔的生活並事奉。聖靈光照聖經，分賜屬靈恩賜，建造教會。'], ['七、教會', '我們相信普世教會是基督的身體，由一切重生的信徒組成，基督是教會的元首。地方教會是受洗信徒的群體，為敬拜、教導、團契和傳福音而組織，遵行洗禮和聖餐。'], ['八、基督徒的生活', '我們相信神稱義的恩典不可與祂成聖的能力和目的分開。神命令我們至高地愛祂，犧牲地愛人，藉著禱告、服事、奉獻和順服祂的話語來活出信仰。'], ['九、基督的再來', '我們相信主耶穌基督將親自、有形地再來。祂的再來是教會有福的盼望，激勵我們過聖潔的生活和忠心的事奉。'], ['十、回應與永恆的歸宿', '我們相信神命令所有人悔改相信主耶穌基督。凡拒絕福音的人將面對永遠的刑罰；凡接受的人將享受與神同在的永生福樂。'], ['十一、末後的事', '我們相信身體的復活、義人的永恆福樂和惡人的永遠受苦。我們盼望新天新地，在那裡有義居住，神將擦去一切的眼淚。'],
    ].map(([title, content], index) => ({ _type: 'beliefItem', _key: `belief-${index + 1}`, title, content: blocks(`belief-zh-${index + 1}`, [content]) })),
    scriptureQuote: '「聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義都是有益的，叫屬神的人得以完全，預備行各樣的善事。」', scriptureCitation: '提摩太後書 3:16-17',
    visionItems: [
      ['培養謙卑的僕人', '腓立比書 2:3-4說：「凡事不可結黨，不可貪圖虛浮的榮耀；只要存心謙卑，各人看別人比自己強。各人不要單顧自己的事，也要顧別人的事。」我們教會渴望在每個人的生命中培養僕人的心志，而非特權的心態。', '我們鼓勵每位弟兄姊妹在伊薩卡生活期間參與服事——可能是在教會中服事，可能是擔任難民的導師，也可能是參與校園事工。'],
      ['愛主、愛失喪的人、愛地方教會', '哥林多前書 13:3說：「我若將所有的賙濟窮人，又捨己身叫人焚燒，卻沒有愛，仍然與我無益。」我們渴望培養出於愛的動機，而非出於自利。', '我們盼望在對主、對失喪之人、對地方教會的愛上成長，積極參與禱告會、查經班和團契活動，彼此實踐聖經中的「彼此」命令。'],
      ['一生之久', '馬太福音 13:20-23描述了不同土壤的比喻。我們渴望培養長期的靈命成長，而非短暫的熱情。', '我們盼望每位弟兄姊妹在伊薩卡期間，能培養出如此堅強的僕人心志，以致他們對主、對失喪之人、對地方教會的愛能持續一生成長。'],
    ].map(([title, ...content], index) => ({ _type: 'visionItem', _key: `vision-${index + 1}`, title, content: blocks(`vision-zh-${index + 1}`, content) })),
    calloutBody: '從敬拜聚會到小組團契，一起探索我們如何活出信仰。',
  },
};

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
    tx.createIfNotExists(doc);
  }
  for (const [id, fields] of Object.entries(fallbackBackfill)) {
    tx.patch(id, (patch) => patch.setIfMissing(fields));
  }

  const result = await tx.commit();
  console.log(`Created any missing documents from ${documents.length} seed records and backfilled missing fallback fields.`);
  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
