/**
 * CM Content Migration — ZH Singleton Documents
 *
 * Populates 4 ZH singleton documents with Chinese Ministry content from cm.ficcc.org.
 * Uses createOrReplace for idempotency — safe to run multiple times.
 *
 * Usage:
 *   DRY RUN (no token):  npx tsx sanity/migrations/cm-content.ts
 *   LIVE:                 SANITY_API_WRITE_TOKEN=sk-... npx tsx sanity/migrations/cm-content.ts
 *
 * Env vars:
 *   SANITY_PROJECT_ID   — Sanity project ID (falls back to .env / .env.local)
 *   SANITY_DATASET       — dataset name (default: 'production')
 *   SANITY_API_WRITE_TOKEN — write token (omit for dry-run)
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';

// Load .env / .env.local
config({ path: '.env.local' });
config({ path: '.env' });

const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ||
  process.env.PUBLIC_SANITY_DATASET ||
  'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error(
    '❌ Missing SANITY_PROJECT_ID. Set it in .env or as an environment variable.',
  );
  process.exit(1);
}

const dryRun = !token;

if (dryRun) {
  console.log('🔍 DRY RUN — no SANITY_API_WRITE_TOKEN found. Documents will be logged to console.\n');
} else {
  console.log(`🚀 LIVE MODE — writing to project "${projectId}" dataset "${dataset}"\n`);
}

// ─── Portable Text helpers ────────────────────────────────────────────────────

type PTBlock = {
  _type: 'block';
  _key: string;
  children: Array<{ _type: 'span'; _key: string; text: string; marks?: string[] }>;
  markDefs: Array<{ _type: string; _key: string; [k: string]: unknown }>;
  style: string;
};

let keyCounter = 0;
function nextKey(prefix: string): string {
  return `${prefix}-${++keyCounter}`;
}

/** Create a single Portable Text block (normal paragraph). */
function ptBlock(text: string, key: string, style: string = 'normal'): PTBlock {
  return {
    _type: 'block',
    _key: key,
    children: [{ _type: 'span', _key: nextKey('s'), text, marks: [] }],
    markDefs: [],
    style,
  };
}

/** Create a bold-prefixed paragraph: **label** rest */
function ptBoldPrefixBlock(bold: string, rest: string, key: string): PTBlock {
  const markKey = nextKey('mk');
  return {
    _type: 'block',
    _key: key,
    children: [
      { _type: 'span', _key: nextKey('s'), text: bold, marks: ['strong'] },
      { _type: 'span', _key: nextKey('s'), text: rest, marks: [] },
    ],
    markDefs: [],
    style: 'normal',
  };
}

// ─── homePage-zh ──────────────────────────────────────────────────────────────

const homePageZh = {
  _id: 'homePage-zh',
  _type: 'homePage',
  language: 'zh',
  heroTitle: '歡迎回家',
  heroSubtitle: '紐約伊薩卡的華人基督教會，歡迎大學生、家庭及社區鄰舍。',
  heroCtaText: '計劃您的來訪',
  heroCtaHref: '/zh/sundays',
  serviceTimes: [
    { _type: 'serviceTime', _key: 'st-worship', label: '主日崇拜', time: '9:45 AM' },
    { _type: 'serviceTime', _key: 'st-sunday-school', label: '主日學', time: '11:15 AM' },
  ],
  pillars: [
    {
      _type: 'pillar',
      _key: 'pillar-rooted',
      title: '根植聖經',
      description: '我們持守聖經為神所默示的話語，是一切生活與信仰的根基。',
    },
    {
      _type: 'pillar',
      _key: 'pillar-community',
      title: '以基督為中心的群體',
      description: '我們以基督為中心聚集，歡迎來自不同背景的學生、家庭和鄰舍。',
    },
    {
      _type: 'pillar',
      _key: 'pillar-culture',
      title: '連結文化',
      description: '我們珍惜華人傳統，同時建立一個跨越文化與世代的教會家庭。',
    },
  ],
  nextSteps: [
    {
      _type: 'nextStep',
      _key: 'ns-visit',
      title: '計劃您的來訪',
      body: '每週日上午9:45加入我們。了解聚會流程及如何抵達。',
      href: '/zh/sundays',
    },
    {
      _type: 'nextStep',
      _key: 'ns-connect',
      title: '建立連結',
      body: '發現小組、事工，以及與他人一同成長的方式。',
      href: '/zh/ministries',
    },
    {
      _type: 'nextStep',
      _key: 'ns-sermons',
      title: '觀看講道',
      body: '回顧近期講道或探索一個教導系列。',
      href: '/zh/sermons',
    },
  ],
};

// ─── aboutPage-zh ─────────────────────────────────────────────────────────────

const aboutPageZh = {
  _id: 'aboutPage-zh',
  _type: 'aboutPage',
  language: 'zh',
  whoWeAreHeading: '我們是誰',
  whoWeAreBody: [
    ptBlock(
      '伊的家華人基督教會（FICCC）於1968年由一群在康奈爾大學的華人研究生和學者創立。他們渴望建立一個以基督為中心的社區，在這裡可以用母語敬拜，同時歡迎伊薩卡更廣大的社區。',
      'about-body-1',
    ),
    ptBlock(
      '經過數十年的成長，教會已發展為一個多世代、多文化的會眾，連結華人傳統與美國生活。每週日我們在429 Mitchell Street聚集敬拜、教導和團契——以英語和普通話進行——服務手指湖地區的學生、家庭和鄰舍。',
      'about-body-2',
    ),
    ptBlock(
      '我們的使命是榮耀神，培養愛神、彼此相愛、向世界傳福音的耶穌基督門徒。我們相信地方教會是神推進祂國度的首要器皿，致力於裝備每位成員過忠心服事的生活。',
      'about-body-3',
    ),
    ptBlock(
      '無論您是伊薩卡的長期居民、訪問學者，還是遠離家鄉的學生，在FICCC都有您的位置。我們邀請您來到這裡，體驗基督之愛的溫暖社區。',
      'about-body-4',
    ),
  ],
  visionHeading: '我們的異象',
  visionBody: [
    ptBoldPrefixBlock(
      '培養謙卑的僕人，愛主、愛失喪的人、愛地方教會——一生之久。',
      '',
      'vision-1',
    ),
    ptBlock(
      '大多數走進我們教會的學生和學者只會在伊薩卡待幾年。但我們相信，這幾年中所發生的——敬拜的習慣、社區的深度、與聖經的相遇——能夠塑造一生的軌跡。',
      'vision-2',
    ),
    ptBlock(
      '我們的異象是培養基督的跟隨者，不僅在此期間「參加教會」，而是帶著門徒訓練的印記走向各處：進入職場、家庭、教會和世界各地的社區。',
      'vision-3',
    ),
  ],
  churchStats: [
    { _type: 'statItem', _key: 'stat-members', value: '~150', label: '會眾人數' },
    { _type: 'statItem', _key: 'stat-baptisms', value: '~20', label: '每年受洗人數' },
    { _type: 'statItem', _key: 'stat-ministers', value: '18', label: '差派全職傳道人' },
    { _type: 'statItem', _key: 'stat-years', value: '40+', label: '在伊薩卡的年數' },
  ],
  beliefs: [
    {
      _type: 'beliefItem',
      _key: 'belief-01-god',
      title: '一、神',
      content: [
        ptBlock(
          '我們相信獨一的真神，祂是永恆存在的三個位格——聖父、聖子、聖靈——每一位都完全是神，各有位格之分，卻在本質和目的上合而為一。祂是萬物的創造者、維持者和統治者。',
          'b01',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-02-bible',
      title: '二、聖經',
      content: [
        ptBlock(
          '我們相信聖經——舊約和新約——是神所默示的話語，在原稿中完全無誤。聖經是信仰和生活的最高和最終權威，是神啟示的完整記錄。',
          'b02',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-03-humanity',
      title: '三、人的境況',
      content: [
        ptBlock(
          '我們相信神按自己的形像造人，但人因悖逆而墮落。全人類生來就有罪性，與神隔絕，處於神公義的審判之下。人無法靠自己的努力恢復與神的關係。',
          'b03',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-04-christ',
      title: '四、耶穌基督',
      content: [
        ptBlock(
          '我們相信耶穌基督是完全的神，也是完全的人。祂由童貞女馬利亞所生，過無罪的生活，行了神蹟，被釘在十字架上為罪人代死，第三天從死裡復活，升天坐在父神的右邊。',
          'b04',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-05-atonement',
      title: '五、基督十架的救贖',
      content: [
        ptBlock(
          '我們相信主耶穌基督為我們的罪而死，作為替代的贖罪祭。凡相信祂的人，都因祂所流的寶血而被稱為義。祂的死是完全的、充分的，足以贖一切人的罪。',
          'b05',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-06-spirit',
      title: '六、聖靈',
      content: [
        ptBlock(
          '我們相信聖靈叫世人知罪，使信徒重生，從得救的那一刻起內住在他們裡面，賜能力使他們過敬虔的生活並事奉。聖靈光照聖經，分賜屬靈恩賜，建造教會。',
          'b06',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-07-church',
      title: '七、教會',
      content: [
        ptBlock(
          '我們相信普世教會是基督的身體，由一切重生的信徒組成，基督是教會的元首。地方教會是受洗信徒的群體，為敬拜、教導、團契和傳福音而組織，遵行洗禮和聖餐。',
          'b07',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-08-life',
      title: '八、基督徒的生活',
      content: [
        ptBlock(
          '我們相信神稱義的恩典不可與祂成聖的能力和目的分開。神命令我們至高地愛祂，犧牲地愛人，藉著禱告、服事、奉獻和順服祂的話語來活出信仰。',
          'b08',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-09-return',
      title: '九、基督的再來',
      content: [
        ptBlock(
          '我們相信主耶穌基督將親自、有形地再來。祂的再來是教會有福的盼望，激勵我們過聖潔的生活和忠心的事奉。',
          'b09',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-10-response',
      title: '十、回應與永恆的歸宿',
      content: [
        ptBlock(
          '我們相信神命令所有人悔改相信主耶穌基督。凡拒絕福音的人將面對永遠的刑罰；凡接受的人將享受與神同在的永生福樂。',
          'b10',
        ),
      ],
    },
    {
      _type: 'beliefItem',
      _key: 'belief-11-eschaton',
      title: '十一、末後的事',
      content: [
        ptBlock(
          '我們相信身體的復活、義人的永恆福樂和惡人的永遠受苦。我們盼望新天新地，在那裡有義居住，神將擦去一切的眼淚。',
          'b11',
        ),
      ],
    },
  ],
};

// ─── siteSettings-zh ──────────────────────────────────────────────────────────

const siteSettingsZh = {
  _id: 'siteSettings-zh',
  _type: 'siteSettings',
  language: 'zh',
  churchName: '以撒迦中國播道會',
  address: '429 Mitchell Street, Ithaca, NY 14850',
  phone: '(607) 280-8898',
  email: 'ithacachen@yahoo.com',
  socialLinks: [
    {
      _type: 'socialLink',
      _key: 'social-wechat',
      platform: 'wechat',
      url: 'https://weixin.qq.com/',
    },
  ],
};

// ─── visitPage-zh ─────────────────────────────────────────────────────────────

const visitPageZh = {
  _id: 'visitPage-zh',
  _type: 'visitPage',
  language: 'zh',
  heroTitle: '主日聚會',
  heroSubtitle: '您第一次來教會需要知道的一切',
  schedule: [
    {
      _type: 'scheduleItem',
      _key: 'sched-worship',
      label: '主日崇拜',
      time: '9:45 AM',
      description: '包含詩歌敬拜、禱告和聖經信息的崇拜聚會',
    },
    {
      _type: 'scheduleItem',
      _key: 'sched-sunday-school',
      label: '主日學',
      time: '11:15 AM',
      description: '按年齡分班——兒童、青少年和成人',
    },
  ],
  whatToExpect: [
    ptBlock(
      '無論您是第一次來教會，還是曾經參加過其他教會，都歡迎您如實地來到這裡。',
      'expect-1',
    ),
    ptBoldPrefixBlock('穿著：', '隨意穿著即可——大多數人穿休閒服裝。', 'expect-2'),
    ptBoldPrefixBlock(
      '主日流程：',
      '聚會包括詩歌敬拜、禱告、讀經和講道。崇拜以中文為主，部分環節為雙語。',
      'expect-3',
    ),
    ptBoldPrefixBlock(
      '歡迎孩子：',
      '兒童隨時歡迎參加主堂崇拜。崇拜後我們也提供按年齡分組的主日學課程。',
      'expect-4',
    ),
    ptBoldPrefixBlock('聚會多長時間？', '主日崇拜通常約75分鐘。', 'expect-5'),
  ],
  transportation: [
    ptBoldPrefixBlock('地址：', '429 Mitchell Street, Ithaca, NY 14850', 'transport-1'),
    ptBoldPrefixBlock(
      '停車：',
      '教會旁設有免費停車場。Mitchell Street 及附近街道也有路邊停車位。',
      'transport-2',
    ),
    ptBoldPrefixBlock(
      '靠近康奈爾：',
      '我們距離康奈爾大學校園很近。如果您是沒有車的學生，我們很樂意安排接送——請與我們聯繫！',
      'transport-3',
    ),
    ptBoldPrefixBlock(
      '公共交通：',
      'TCAT公車可到達附近地區。請查詢 tcatbus.com 了解時刻表。',
      'transport-4',
    ),
  ],
  faqItems: [
    {
      _type: 'faqItem',
      _key: 'faq-dress',
      question: '應該穿什麼？',
      answer: '沒有穿著要求——隨意穿著即可。大多數人穿休閒服裝。',
    },
    {
      _type: 'faqItem',
      _key: 'faq-children',
      question: '歡迎兒童嗎？',
      answer: '當然！兒童隨時歡迎參加主堂崇拜，崇拜後我們也提供按年齡分組的主日學課程。',
    },
    {
      _type: 'faqItem',
      _key: 'faq-language',
      question: '崇拜使用什麼語言？',
      answer: '我們的崇拜以中文為主，部分環節為雙語（中英文）。無論您的語言背景如何，都歡迎您。',
    },
    {
      _type: 'faqItem',
      _key: 'faq-parking',
      question: '有停車位嗎？',
      answer: '有——教會旁設有免費停車場，附近街道也有路邊停車位。',
    },
    {
      _type: 'faqItem',
      _key: 'faq-duration',
      question: '聚會多長時間？',
      answer: '主日崇拜通常約75分鐘。主日學在11:15 AM開始，約45分鐘。',
    },
    {
      _type: 'faqItem',
      _key: 'faq-contact',
      question: '平日如何聯繫教會？',
      answer:
        '我們很期待幫助您融入社區！聚會後請到歡迎桌了解小組、查經班和其他連結方式。您也可以通過我們的聯繫頁面與我們溝通。',
    },
  ],
  rideRequestEnabled: true,
};

// ─── Execute migration ────────────────────────────────────────────────────────

const documents = [homePageZh, aboutPageZh, siteSettingsZh, visitPageZh];

async function migrate() {
  if (dryRun) {
    for (const doc of documents) {
      console.log(`── ${doc._id} (${doc._type}) ──`);
      console.log(JSON.stringify(doc, null, 2));
      console.log();
    }
    console.log(`✅ Dry run complete — ${documents.length} documents would be created/replaced.`);
    return;
  }

  const client = createClient({
    projectId: projectId!,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  });

  let created = 0;
  let failed = 0;

  for (const doc of documents) {
    try {
      await client.createOrReplace(doc);
      console.log(`✅ ${doc._id} — created/replaced`);
      created++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`❌ ${doc._id} — FAILED: ${message}`);
      failed++;
    }
  }

  console.log(
    `\n🏁 Migration complete: ${created} succeeded, ${failed} failed out of ${documents.length} documents.`,
  );

  if (failed > 0) {
    process.exit(1);
  }
}

migrate().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
