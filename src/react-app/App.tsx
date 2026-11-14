import { useEffect, useMemo, useState, type FormEvent } from "react";

type GroupName = "جوانمردان" | "شاه گشتاسبیان" | "وفاداریان";
type NewsGroup = GroupName | "درگاه پادشاهی" | "بین‌الملل";
type NewsCategory = "سیاست" | "بین‌الملل" | "اقتصاد" | "اطلاعیه";
type CategoryFilter = "همه" | NewsCategory;

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  group: NewsGroup;
  date: string;
  featured: boolean;
};

type NewsDraft = Omit<NewsItem, "id" | "date">;

const STORAGE_KEY = "royal-portal-news-v3";

const GROUPS: GroupName[] = [
  "جوانمردان",
  "شاه گشتاسبیان",
  "وفاداریان",
];

const initialNews: NewsItem[] = [
  {
    id: "news-1",
    title: "جنگ خیالی جوانمردان و ائتلاف اروپا؛ بحران وارد مرحله تازه‌ای شد",
    summary:
      "در جهان داستانی درگاه پادشاهی، تنش میان جریان کمونیست جوانمردان و ائتلاف اروپا به یک بحران بزرگ سیاسی و نظامی تبدیل شده است.",
    content:
      "در پی افزایش اختلافات سیاسی میان جریان خیالی جوانمردان و ائتلاف اروپا، روابط دو طرف وارد بحرانی بی‌سابقه شده است. چند کشور اروپایی خواستار تشکیل نشست اضطراری شده‌اند.\n\nهم‌زمان، نمایندگان چند کشور پیشنهاد کرده‌اند مذاکراتی با هدف جلوگیری از گسترش بحران برگزار شود. آینده این رویارویی به تصمیم‌های سیاسی روزهای آینده بستگی خواهد داشت.\n\nاین رویداد بخشی از سناریوی داستانی این وب‌سایت است.",
    category: "بین‌الملل",
    group: "جوانمردان",
    date: "۱۴۰۵/۰۸/۲۳",
    featured: true,
  },
  {
    id: "news-2",
    title: "ادعای آغاز طرح تسلیحاتی هسته‌ای ایران؛ جهان در انتظار واکنش تهران",
    summary:
      "در سناریوی خیالی این خبرگزاری، انتشار بیانیه‌ای درباره برنامه هسته‌ای ایران موجی از واکنش‌های دیپلماتیک را به همراه داشته است.",
    content:
      "در ادامه تحولات داستانی، انتشار بیانیه‌ای درباره طرح تسلیحاتی هسته‌ای ایران، توجه رسانه‌ها و دولت‌های جهان را به خود جلب کرده است.\n\nشماری از کشورها خواستار شفاف‌سازی و گفت‌وگوی فوری شده‌اند. در مقابل، برخی جریان‌های سیاسی این موضوع را مسئله‌ای مرتبط با استقلال و امنیت ملی توصیف کرده‌اند.\n\nقرار است در روزهای آینده نشستی بین‌المللی برای بررسی پیامدهای سیاسی این ادعا برگزار شود.\n\nاین گزارش کاملاً خیالی است و صرفاً یک رویداد سیاسی در دنیای داستانی سایت را روایت می‌کند.",
    category: "بین‌الملل",
    group: "درگاه پادشاهی",
    date: "۱۴۰۵/۰۸/۲۳",
    featured: false,
  },
  {
    id: "news-3",
    title: "شورای اروپا نشست فوق‌العاده درباره بحران ایران برگزار می‌کند",
    summary:
      "مقام‌های اروپایی در روایت داستانی این خبرگزاری، خواستار بررسی آخرین تحولات و یافتن راهی برای کاهش تنش‌ها شده‌اند.",
    content:
      "شورای اروپا در پی تحولات اخیر، برگزاری یک نشست فوق‌العاده را در دستور کار قرار داده است.\n\nدر این نشست، روابط با ایران، آینده مذاکرات و وضعیت منطقه مورد بررسی قرار خواهد گرفت. برخی نمایندگان نیز بر ضرورت جلوگیری از گسترش بحران تأکید کرده‌اند.",
    category: "بین‌الملل",
    group: "بین‌الملل",
    date: "۱۴۰۵/۰۸/۲۲",
    featured: false,
  },
  {
    id: "news-4",
    title: "شاه گشتاسبیان خواستار تشکیل شورای ملی گفت‌وگو شد",
    summary:
      "شاه گشتاسبیان از پیشنهاد تشکیل شورایی برای بررسی آینده سیاسی کشور و تدوین چارچوبی مشترک خبر داده‌اند.",
    content:
      "جریان شاه گشتاسبیان در بیانیه‌ای داستانی، خواستار آغاز گفت‌وگو میان گروه‌های سیاسی شده است.\n\nبر اساس این پیشنهاد، شورایی متشکل از نمایندگان جریان‌های مختلف تشکیل خواهد شد تا موضوعاتی مانند قانون اساسی، ساختار حکومت و آینده کشور را بررسی کند.",
    category: "سیاست",
    group: "شاه گشتاسبیان",
    date: "۱۴۰۵/۰۸/۲۲",
    featured: false,
  },
  {
    id: "news-5",
    title: "وفاداریان طرح آشتی سیاسی سه‌جانبه را ارائه کردند",
    summary:
      "این جریان پیشنهاد داده است نمایندگان سه گروه برای بررسی اختلافات و ایجاد توافقی سیاسی گرد هم آیند.",
    content:
      "وفاداریان با انتشار بیانیه‌ای، طرحی برای کاهش اختلافات میان سه جریان اصلی ارائه کرده‌اند.\n\nدر این طرح، نشست مشترک، تدوین توافق‌نامه سیاسی و تشکیل کمیته‌ای برای بررسی مسائل مورد اختلاف پیش‌بینی شده است.\n\nاین پیشنهاد هنوز با پاسخ رسمی دو جریان دیگر روبه‌رو نشده است.",
    category: "سیاست",
    group: "وفاداریان",
    date: "۱۴۰۵/۰۸/۲۱",
    featured: false,
  },
  {
    id: "news-6",
    title: "اختلاف بر سر پیش‌نویس قانون اساسی؛ سه جریان دیدگاه‌های متفاوتی دارند",
    summary:
      "بررسی پیش‌نویس قانون اساسی در جهان داستانی ایران با اختلاف نظر میان نمایندگان جریان‌های سیاسی همراه شده است.",
    content:
      "جلسات بررسی پیش‌نویس قانون اساسی با بحث‌های گسترده‌ای درباره ساختار حکومت، حقوق شهروندان و اختیارات نهادهای مختلف همراه بوده است.\n\nنمایندگان سه جریان هنوز درباره چند بند اصلی به توافق نرسیده‌اند. با این حال، قرار است مذاکرات در نشست آینده ادامه پیدا کند.",
    category: "سیاست",
    group: "درگاه پادشاهی",
    date: "۱۴۰۵/۰۸/۲۰",
    featured: false,
  },
  {
    id: "news-7",
    title: "پیشنهاد روسیه برای میانجی‌گری در بحران ایران",
    summary:
      "در روایت داستانی خبرگزاری، مسکو پیشنهاد داده است زمینه گفت‌وگو میان طرف‌های درگیر اختلافات سیاسی فراهم شود.",
    content:
      "روسیه در بیانیه‌ای خیالی، آمادگی خود را برای میانجی‌گری میان طرف‌های بحران اعلام کرده است.\n\nاین پیشنهاد می‌تواند زمینه برگزاری مذاکراتی تازه را فراهم کند. هنوز مشخص نیست طرف‌های مختلف چه واکنشی به این ابتکار نشان خواهند داد.",
    category: "بین‌الملل",
    group: "بین‌الملل",
    date: "۱۴۰۵/۰۸/۱۹",
    featured: false,
  },
  {
    id: "news-8",
    title: "طرح اقتصادی بزرگ برای بازسازی زیرساخت‌های ایران معرفی شد",
    summary:
      "یک برنامه اقتصادی خیالی با محوریت توسعه حمل‌ونقل، صنعت، انرژی و حمایت از کسب‌وکارها معرفی شده است.",
    content:
      "در جریان نشست اقتصادی درگاه پادشاهی، طرحی برای بازسازی زیرساخت‌های کشور معرفی شد.\n\nاین برنامه شامل سرمایه‌گذاری در حمل‌ونقل، توسعه صنایع، بهبود خدمات عمومی و حمایت از تولید داخلی است.\n\nقرار است جزئیات بیشتری از این طرح در گزارش‌های بعدی منتشر شود.",
    category: "اقتصاد",
    group: "درگاه پادشاهی",
    date: "۱۴۰۵/۰۸/۱۸",
    featured: false,
  },
  {
    id: "news-9",
    title: "توافق اولیه برای تشکیل مجلس موقت سیاسی",
    summary:
      "نمایندگان چند جریان در یک نشست داستانی درباره تشکیل نهادی موقت برای پیگیری مسائل کشور به توافق اولیه رسیدند.",
    content:
      "پس از چند دور گفت‌وگو، نمایندگان جریان‌های مختلف با بررسی اولیه تشکیل یک مجلس موقت موافقت کرده‌اند.\n\nاین نهاد قرار است محلی برای گفت‌وگو، ارائه پیشنهادها و بررسی مسائل مهم کشور باشد. درباره ترکیب اعضا و اختیارات آن هنوز تصمیم نهایی گرفته نشده است.",
    category: "سیاست",
    group: "درگاه پادشاهی",
    date: "۱۴۰۵/۰۸/۱۷",
    featured: false,
  },
];

const emptyDraft = (): NewsDraft => ({
  title: "",
  summary: "",
  content: "",
  category: "سیاست",
  group: "درگاه پادشاهی",
  featured: false,
});

function loadNews(): NewsItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed as NewsItem[];
    }
  } catch {
    // در صورت خراب بودن اطلاعات ذخیره‌شده، خبرهای اولیه نمایش داده می‌شوند.
  }

  return initialNews;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function todayPersian() {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap');

:root {
  font-family: 'Vazirmatn', Tahoma, sans-serif;
  color: #f5f0df;
  background: #090d0b;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  display: block;
  min-width: 320px;
  min-height: 100vh;
  background: #090d0b;
  color: #f5f0df;
  font-family: 'Vazirmatn', Tahoma, sans-serif;
}

button, input, textarea, select {
  font: inherit;
}

button {
  cursor: pointer;
}

.portal {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 50% -20%, rgba(166, 127, 42, .15), transparent 48%),
    #090d0b;
}

.top-line {
  height: 4px;
  background: linear-gradient(90deg, #75551d, #d6b45f, #8b6828, #d6b45f, #75551d);
}

.container {
  width: min(1160px, calc(100% - 36px));
  margin: auto;
}

.header {
  border-bottom: 1px solid rgba(202, 170, 91, .22);
  background: rgba(9, 13, 11, .94);
}

.header-inner {
  min-height: 94px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-symbol {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  color: #e4c16b;
  border: 1px solid rgba(220, 184, 92, .65);
  border-radius: 15px;
  font-size: 31px;
  background: linear-gradient(145deg, #19251b, #0b100d);
  box-shadow: 0 0 25px rgba(198, 158, 65, .10);
}

.brand-title {
  font-size: 21px;
  font-weight: 900;
  color: #f0d58d;
  margin: 0;
}

.brand-subtitle {
  color: #9e9b8d;
  font-size: 11px;
  margin-top: 4px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 15px;
  font-size: 12px;
  font-weight: 700;
  transition: .2s;
}

.btn-gold {
  color: #19160e;
  background: linear-gradient(135deg, #e6cc83, #b68a37);
}

.btn-gold:hover {
  filter: brightness(1.12);
  transform: translateY(-1px);
}

.btn-outline {
  color: #e3c675;
  background: transparent;
  border-color: rgba(211, 177, 92, .45);
}

.btn-outline:hover {
  background: rgba(211, 177, 92, .10);
}

.btn-danger {
  color: #ffb9b9;
  background: rgba(160, 44, 44, .15);
  border-color: rgba(230, 94, 94, .35);
}

.fiction-banner {
  background: rgba(137, 99, 29, .13);
  border-bottom: 1px solid rgba(203, 160, 69, .18);
  color: #dfc47c;
  font-size: 11px;
  text-align: center;
  padding: 10px 12px;
}

.hero {
  position: relative;
  overflow: hidden;
  margin-top: 30px;
  padding: 45px 40px;
  border: 1px solid rgba(210, 174, 88, .28);
  border-radius: 20px;
  background:
    radial-gradient(circle at 10% 50%, rgba(26, 91, 55, .32), transparent 35%),
    linear-gradient(115deg, #111d15, #11120e 75%);
}

.hero::after {
  content: "♛";
  position: absolute;
  left: 42px;
  top: -45px;
  font-size: 245px;
  line-height: 1;
  color: rgba(204, 168, 81, .055);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
}

.eyebrow {
  color: #d0ad60;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.hero h1 {
  font-size: clamp(25px, 4vw, 42px);
  line-height: 1.7;
  margin: 12px 0 8px;
  color: #f1dfac;
  font-weight: 900;
}

.hero p {
  color: #b8b7a9;
  line-height: 2.2;
  font-size: 13px;
  max-width: 620px;
  margin: 0;
}

.hero-bottom {
  margin-top: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.live-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #f0b6a9;
  border: 1px solid rgba(219, 101, 83, .35);
  background: rgba(153, 48, 35, .12);
  padding: 7px 11px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 800;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e56b59;
  box-shadow: 0 0 10px #e56b59;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 13px;
  margin: 18px 0 30px;
}

.stat {
  border: 1px solid rgba(203, 170, 91, .16);
  background: linear-gradient(145deg, rgba(24, 35, 26, .9), rgba(17, 19, 15, .9));
  border-radius: 14px;
  padding: 17px 20px;
}

.stat-number {
  font-size: 25px;
  font-weight: 900;
  color: #e6c879;
}

.stat-label {
  color: #99998d;
  font-size: 11px;
  margin-top: 3px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin: 30px 0 15px;
}

.section-title h2 {
  color: #e8d39b;
  font-size: 18px;
  margin: 0;
}

.section-title span {
  color: #8d8c81;
  font-size: 11px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 13px;
  flex-wrap: wrap;
  margin-bottom: 17px;
}

.tabs {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.tab {
  border: 1px solid rgba(203, 170, 91, .19);
  background: #111610;
  color: #aaa99d;
  border-radius: 9px;
  padding: 9px 13px;
  font-size: 11px;
  font-weight: 700;
}

.tab.active {
  color: #16130c;
  background: linear-gradient(135deg, #e6ca7b, #b68b3d);
  border-color: transparent;
}

.search {
  min-width: 220px;
  max-width: 310px;
  flex: 1;
  position: relative;
}

.search input {
  width: 100%;
  color: #eee7d5;
  background: #111610;
  border: 1px solid rgba(203, 170, 91, .22);
  border-radius: 10px;
  padding: 11px 14px;
  outline: none;
  font-size: 12px;
}

.search input:focus {
  border-color: #cba75a;
}

.featured {
  display: grid;
  grid-template-columns: 1fr 190px;
  overflow: hidden;
  border: 1px solid rgba(209, 174, 89, .34);
  border-radius: 16px;
  background: linear-gradient(115deg, #17251a, #121610);
  margin-bottom: 18px;
}

.featured-main {
  padding: 25px;
}

.featured-side {
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #26351e, #171b12);
  border-right: 1px solid rgba(203, 170, 91, .19);
  color: rgba(230, 199, 121, .7);
  font-size: 90px;
}

.featured h3 {
  color: #f0dcaa;
  font-size: 20px;
  line-height: 1.9;
  margin: 12px 0;
}

.featured p {
  color: #b6b6a8;
  font-size: 12px;
  line-height: 2.1;
  margin: 0 0 18px;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 6px;
  padding: 5px 9px;
  font-size: 10px;
  font-weight: 800;
  color: #e2c477;
  background: rgba(201, 162, 72, .12);
  border: 1px solid rgba(201, 162, 72, .2);
  margin-left: 6px;
}

.badge-red {
  color: #f1a79b;
  background: rgba(176, 60, 44, .13);
  border-color: rgba(176, 60, 44, .25);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.news-card {
  display: flex;
  flex-direction: column;
  min-height: 245px;
  border: 1px solid rgba(203, 170, 91, .16);
  background: linear-gradient(145deg, #151d16, #10130f);
  border-radius: 14px;
  padding: 18px;
  transition: .2s;
}

.news-card:hover {
  transform: translateY(-3px);
  border-color: rgba(211, 177, 92, .48);
  box-shadow: 0 9px 30px rgba(0, 0, 0, .2);
}

.card-meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.card-date {
  color: #888b7c;
  font-size: 10px;
}

.news-card h3 {
  color: #e7d7aa;
  font-size: 14px;
  line-height: 1.9;
  margin: 15px 0 9px;
}

.news-card p {
  color: #a8aa9d;
  font-size: 11px;
  line-height: 2;
  margin: 0 0 16px;
}

.card-bottom {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(203, 170, 91, .10);
}

.read-more {
  border: 0;
  background: transparent;
  color: #d9b968;
  font-size: 11px;
  font-weight: 800;
  padding: 5px 0;
}

.card-actions {
  display: flex;
  gap: 5px;
}

.icon-btn {
  border: 1px solid rgba(203, 170, 91, .2);
  background: transparent;
  color: #d9c17f;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 10px;
}

.empty {
  color: #aaa99b;
  text-align: center;
  padding: 40px 15px;
  border: 1px dashed rgba(203, 170, 91, .25);
  border-radius: 13px;
  grid-column: 1 / -1;
}

.footer {
  border-top: 1px solid rgba(203, 170, 91, .16);
  margin-top: 55px;
  padding: 25px 0 32px;
  text-align: center;
  color: #777b70;
  font-size: 10px;
  line-height: 2.2;
}

.footer strong {
  color: #c5a75f;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
  background: rgba(0, 0, 0, .78);
  backdrop-filter: blur(6px);
  overflow-y: auto;
}

.modal {
  width: min(620px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  background: #111812;
  border: 1px solid rgba(211, 177, 92, .4);
  border-radius: 17px;
  padding: 25px;
  box-shadow: 0 25px 100px rgba(0, 0, 0, .6);
}

.modal h2 {
  color: #e8d39b;
  font-size: 19px;
  margin: 0 0 18px;
}

.modal-close {
  float: left;
  background: transparent;
  border: 0;
  color: #cbb36e;
  font-size: 22px;
}

.article-title {
  color: #f0dca5;
  font-size: 22px;
  line-height: 1.9;
  margin: 15px 0;
}

.article-content {
  color: #c3c3b5;
  font-size: 13px;
  line-height: 2.5;
  white-space: pre-line;
}

.form-group {
  margin: 14px 0;
}

.form-group label {
  display: block;
  color: #c9b77e;
  font-size: 11px;
  margin-bottom: 7px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  background: #090f0b;
  border: 1px solid rgba(203, 170, 91, .22);
  border-radius: 9px;
  color: #f2ead7;
  padding: 11px;
  outline: none;
  font-size: 12px;
}

.form-group textarea {
  min-height: 110px;
  resize: vertical;
  line-height: 2;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #c9a858;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #c8c0a7;
  font-size: 11px;
  margin: 15px 0;
}

.group-choice {
  width: 100%;
  text-align: right;
  border: 1px solid rgba(203, 170, 91, .2);
  border-radius: 11px;
  background: #151e16;
  color: #e4d5a8;
  padding: 15px;
  margin: 8px 0;
  font-weight: 800;
}

.group-choice:hover {
  border-color: #c8a85c;
  background: #1b281b;
}

.notice {
  color: #d0b66e;
  background: rgba(199, 160, 70, .09);
  border: 1px solid rgba(199, 160, 70, .18);
  border-radius: 9px;
  padding: 11px;
  font-size: 10px;
  line-height: 2;
  margin-top: 14px;
}

.toast {
  position: fixed;
  z-index: 40;
  bottom: 22px;
  right: 50%;
  transform: translateX(50%);
  color: #17140c;
  background: #e0c477;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 10px 35px rgba(0, 0, 0, .4);
}

@media (max-width: 800px) {
  .news-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .featured {
    grid-template-columns: 1fr 120px;
  }

  .featured-side {
    font-size: 65px;
  }
}

@media (max-width: 560px) {
  .container {
    width: min(100% - 24px, 1160px);
  }

  .header-inner {
    padding: 13px 0;
    align-items: flex-start;
  }

  .brand-symbol {
    width: 43px;
    height: 43px;
    font-size: 25px;
  }

  .brand-title {
    font-size: 15px;
  }

  .brand-subtitle {
    font-size: 9px;
  }

  .header-actions {
    gap: 6px;
  }

  .header-actions .btn {
    font-size: 9px;
    padding: 8px;
  }

  .hero {
    padding: 28px 20px;
    margin-top: 18px;
  }

  .hero::after {
    left: 5px;
    font-size: 150px;
  }

  .hero p {
    font-size: 11px;
  }

  .stats {
    gap: 7px;
  }

  .stat {
    padding: 12px;
  }

  .stat-number {
    font-size: 19px;
  }

  .stat-label {
    font-size: 9px;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .featured {
    grid-template-columns: 1fr;
  }

  .featured-side {
    display: none;
  }

  .featured-main {
    padding: 19px;
  }

  .featured h3 {
    font-size: 16px;
  }

  .search {
    max-width: none;
    min-width: 100%;
  }

  .tab {
    padding: 8px 10px;
    font-size: 10px;
  }

  .modal {
    padding: 18px;
  }

  .article-title {
    font-size: 18px;
  }
}
`;

function App() {
  const [news, setNews] = useState<NewsItem[]>(loadNews);
  const [activeGroup, setActiveGroup] = useState<GroupName | "مهمان">("مهمان");
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>("همه");
  const [search, setSearch] = useState("");

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [draft, setDraft] = useState<NewsDraft>(emptyDraft);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
    } catch {
      setToast("ذخیره محلی در این مرورگر امکان‌پذیر نبود.");
    }
  }, [news]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredNews = useMemo(() => {
    const term = search.trim().toLowerCase();

    return news.filter((item) => {
      const categoryMatch =
        activeCategory === "همه" || item.category === activeCategory;

      const textMatch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.group.toLowerCase().includes(term);

      return categoryMatch && textMatch;
    });
  }, [news, activeCategory, search]);

  const featuredNews = filteredNews.find((item) => item.featured) || filteredNews[0];

  const otherNews = filteredNews.filter(
    (item) => item.id !== featuredNews?.id
  );

  function openNewArticle() {
    setEditingId(null);
    setDraft(emptyDraft());
    setEditorOpen(true);
  }

  function openEditArticle(item: NewsItem) {
    setEditingId(item.id);
    setDraft({
      title: item.title,
      summary: item.summary,
      content: item.content,
      category: item.category,
      group: item.group,
      featured: item.featured,
    });
    setSelectedNews(null);
    setEditorOpen(true);
  }

  function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.title.trim() || !draft.summary.trim() || !draft.content.trim()) {
      setToast("لطفاً همه بخش‌های اصلی خبر را کامل کن.");
      return;
    }

    if (editingId) {
      setNews((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, ...draft }
            : draft.featured
              ? { ...item, featured: false }
              : item
        )
      );
      setToast("خبر با موفقیت ویرایش شد.");
    } else {
      const newArticle: NewsItem = {
        ...draft,
        id: makeId(),
        date: todayPersian(),
      };

      setNews((previous) => [
        ...(draft.featured
          ? previous.map((item) => ({ ...item, featured: false }))
          : previous),
        newArticle,
      ]);

      setToast("خبر جدید منتشر شد.");
    }

    setEditorOpen(false);
    setEditingId(null);
  }

  function deleteArticle(id: string) {
    const confirmed = window.confirm("از حذف این خبر مطمئنی؟");
    if (!confirmed) return;

    setNews((previous) => previous.filter((item) => item.id !== id));
    setSelectedNews(null);
    setToast("خبر حذف شد.");
  }

  function chooseGroup(group: GroupName | "مهمان") {
    setActiveGroup(group);
    setShowLogin(false);
    setToast(group === "مهمان" ? "ورود به حالت مهمان انجام شد." : `ورود نمایشی به ${group} انجام شد.`);
  }

  return (
    <div className="portal" dir="rtl">
      <style>{css}</style>

      <div className="top-line" />

      <header className="header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-symbol">♛</div>
            <div>
              <h1 className="brand-title">درگاه پادشاهی ایران</h1>
              <div className="brand-subtitle">
                مرکز خبر، سیاست و اطلاع‌رسانی جهان داستانی
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="btn btn-outline" onClick={() => setShowLogin(true)}>
              ورود گروه‌ها
            </button>

            <button
              className="btn btn-gold"
              onClick={() => {
                if (isEditorMode) {
                  setIsEditorMode(false);
                  setToast("حالت تحریریه غیرفعال شد.");
                } else {
                  setIsEditorMode(true);
                  setToast("حالت تحریریه آزمایشی فعال شد.");
                }
              }}
            >
              {isEditorMode ? "خروج از تحریریه" : "پنل تحریریه"}
            </button>
          </div>
        </div>
      </header>

      <div className="fiction-banner">
        ⚠️ اطلاعیه مهم: تمام گروه‌ها، شخصیت‌ها و رویدادهای این وب‌سایت خیالی هستند و خبر واقعی محسوب نمی‌شوند.
      </div>

      <main className="container">
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">ROYAL IRAN NEWS NETWORK</div>

            <h1>روایت قدرت، سیاست و آینده</h1>

            <p>
              آخرین تحولات سیاسی، بیانیه‌های گروه‌ها، بحران‌های بین‌المللی
              و گزارش‌های ویژه را در مرکز خبری درگاه پادشاهی ایران دنبال کنید.
            </p>

            <div className="hero-bottom">
              <span className="live-label">
                <span className="live-dot" />
                خبرگزاری جهان داستانی
              </span>

              <span className="badge">
                مشاهده به‌عنوان: {activeGroup}
              </span>
            </div>
          </div>
        </section>

        <section className="stats">
          <div className="stat">
            <div className="stat-number">{news.length}</div>
            <div className="stat-label">خبر ثبت‌شده</div>
          </div>

          <div className="stat">
            <div className="stat-number">۳</div>
            <div className="stat-label">جریان سیاسی اصلی</div>
          </div>

          <div className="stat">
            <div className="stat-number">∞</div>
            <div className="stat-label">داستان‌های پیش رو</div>
          </div>
        </section>

        {isEditorMode && (
          <div className="notice">
            حالت تحریریه آزمایشی فعال است.
            <button
              className="btn btn-gold"
              style={{ marginRight: 12 }}
              onClick={openNewArticle}
            >
              + انتشار خبر جدید
            </button>
            <div style={{ marginTop: 8 }}>
              توجه: این پنل در نسخه فعلی رمز عبور و امنیت واقعی ندارد.
            </div>
          </div>
        )}

        <div className="section-title">
          <h2>آخرین اخبار و تحولات</h2>
          <span>مرکز رسانه‌ای درگاه پادشاهی</span>
        </div>

        <div className="toolbar">
          <div className="tabs">
            {(["همه", "سیاست", "بین‌الملل", "اقتصاد", "اطلاعیه"] as CategoryFilter[]).map(
              (category) => (
                <button
                  key={category}
                  className={`tab ${activeCategory === category ? "active" : ""}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>

          <div className="search">
            <input
              type="search"
              placeholder="جست‌وجو در اخبار..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {featuredNews && (
          <section className="featured">
            <div className="featured-main">
              <span className="badge badge-red">خبر ویژه</span>
              <span className="badge">{featuredNews.category}</span>

              <h3>{featuredNews.title}</h3>

              <p>{featuredNews.summary}</p>

              <button
                className="btn btn-gold"
                onClick={() => setSelectedNews(featuredNews)}
              >
                مطالعه گزارش کامل ←
              </button>
            </div>

            <div className="featured-side">♛</div>
          </section>
        )}

        <div className="news-grid">
          {otherNews.length === 0 && !featuredNews ? (
            <div className="empty">
              خبری با این مشخصات پیدا نشد.
            </div>
          ) : (
            otherNews.map((item) => (
              <article className="news-card" key={item.id}>
                <div className="card-meta">
                  <span className="badge">{item.category}</span>
                  <span className="card-date">{item.date}</span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.summary}</p>

                <div className="card-bottom">
                  <button
                    className="read-more"
                    onClick={() => setSelectedNews(item)}
                  >
                    ادامه خبر ←
                  </button>

                  {isEditorMode && (
                    <div className="card-actions">
                      <button
                        className="icon-btn"
                        onClick={() => openEditArticle(item)}
                      >
                        ویرایش
                      </button>

                      <button
                        className="icon-btn"
                        onClick={() => deleteArticle(item.id)}
                      >
                        حذف
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        <div className="section-title">
          <h2>جریان‌های سیاسی</h2>
          <span>سه جریان اصلی جهان داستانی</span>
        </div>

        <div className="news-grid">
          {GROUPS.map((group, index) => (
            <div className="news-card" key={group}>
              <span className="badge">جریان شماره {index + ۱}</span>
              <h3>{group}</h3>
              <p>
                مشاهده خبرها، بیانیه‌ها و تحولات مربوط به این جریان در
                خبرگزاری درگاه پادشاهی.
              </p>
              <div className="card-bottom">
                <button
                  className="read-more"
                  onClick={() => {
                    setSearch(group);
                    setActiveCategory("همه");
                    window.scrollTo({ top: 800, behavior: "smooth" });
                  }}
                >
                  مشاهده خبرهای گروه ←
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <strong>درگاه پادشاهی ایران</strong>
          <br />
          مرکز خبری جهان داستانی شما
          <br />
          تمامی رویدادها و اخبار این وب‌سایت ساختگی و داستانی هستند.
        </div>
      </footer>

      {selectedNews && (
        <div className="overlay" onClick={() => setSelectedNews(null)}>
          <article className="modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedNews(null)}
            >
              ×
            </button>

            <span className="badge">{selectedNews.category}</span>
            <span className="badge">{selectedNews.group}</span>

            <div className="card-date" style={{ marginTop: 12 }}>
              تاریخ انتشار: {selectedNews.date}
            </div>

            <h2 className="article-title">{selectedNews.title}</h2>

            <p className="article-content">{selectedNews.content}</p>

            <div className="notice">
              این گزارش بخشی از جهان داستانی درگاه پادشاهی ایران است.
            </div>

            {isEditorMode && (
              <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                <button
                  className="btn btn-outline"
                  onClick={() => openEditArticle(selectedNews)}
                >
                  ویرایش خبر
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => deleteArticle(selectedNews.id)}
                >
                  حذف خبر
                </button>
              </div>
            )}
          </article>
        </div>
      )}

      {showLogin && (
        <div className="overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>

            <h2>ورود به بخش گروه‌ها</h2>

            <p style={{ color: "#aaa99d", fontSize: 12, lineHeight: 2 }}>
              بخش موردنظر را برای ورود نمایشی انتخاب کنید.
            </p>

            {GROUPS.map((group) => (
              <button
                className="group-choice"
                key={group}
                onClick={() => chooseGroup(group)}
              >
                ورود به حساب نمایشی {group} ←
              </button>
            ))}

            <button
              className="group-choice"
              onClick={() => chooseGroup("مهمان")}
            >
              ادامه به‌عنوان مهمان ←
            </button>

            <div className="notice">
              این انتخاب در نسخه فعلی فقط نمایشی است؛ هنوز حساب کاربری واقعی،
              رمز عبور یا سطح دسترسی امن راه‌اندازی نشده است.
            </div>
          </div>
        </div>
      )}

      {editorOpen && (
        <div className="overlay" onClick={() => setEditorOpen(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setEditorOpen(false)}
            >
              ×
            </button>

            <h2>{editingId ? "ویرایش خبر" : "انتشار خبر جدید"}</h2>

            <form onSubmit={saveArticle}>
              <div className="form-group">
                <label>عنوان خبر</label>
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                  placeholder="عنوان اصلی خبر را بنویس..."
                  required
                />
              </div>

              <div className="form-group">
                <label>خلاصه خبر</label>
                <textarea
                  value={draft.summary}
                  onChange={(event) =>
                    setDraft({ ...draft, summary: event.target.value })
                  }
                  placeholder="خلاصه کوتاه خبر..."
                  required
                />
              </div>

              <div className="form-group">
                <label>متن کامل خبر</label>
                <textarea
                  value={draft.content}
                  onChange={(event) =>
                    setDraft({ ...draft, content: event.target.value })
                  }
                  placeholder="متن کامل گزارش را بنویس..."
                  style={{ minHeight: 180 }}
                  required
                />
              </div>

              <div className="form-group">
                <label>دسته‌بندی</label>
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      category: event.target.value as NewsCategory,
                    })
                  }
                >
                  <option value="سیاست">سیاست</option>
                  <option value="بین‌الملل">بین‌الملل</option>
                  <option value="اقتصاد">اقتصاد</option>
                  <option value="اطلاعیه">اطلاعیه</option>
                </select>
              </div>

              <div className="form-group">
                <label>منتشرکننده</label>
                <select
                  value={draft.group}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      group: event.target.value as NewsGroup,
                    })
                  }
                >
                  <option value="درگاه پادشاهی">درگاه پادشاهی</option>
                  <option value="جوانمردان">جوانمردان</option>
                  <option value="شاه گشتاسبیان">شاه گشتاسبیان</option>
                  <option value="وفاداریان">وفاداریان</option>
                  <option value="بین‌الملل">بین‌الملل</option>
                </select>
              </div>

              <label className="check-row">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(event) =>
                    setDraft({ ...draft, featured: event.target.checked })
                  }
                />
                نمایش این خبر به‌عنوان خبر ویژه
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn-gold" type="submit">
                  {editingId ? "ثبت تغییرات" : "انتشار خبر"}
                </button>

                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={() => setEditorOpen(false)}
                >
                  انصراف
                </button>
              </div>
            </form>

            <div className="notice">
              خبرها در این نسخه فقط در حافظه مرورگر فعلی ذخیره می‌شوند.
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
