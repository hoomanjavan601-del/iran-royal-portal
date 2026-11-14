import { useState } from "react";
import "./App.css";

type Group = "همه اخبار" | "جوانمردان" | "شاه گشتاسبیان" | "وفاداریان";

type News = {
  id: number;
  title: string;
  summary: string;
  group: string;
  date: string;
};

const initialNews: News[] = [
  {
    id: 1,
    title: "آغاز فعالیت رسمی درگاه پادشاهی ایران",
    summary: "درگاه پادشاهی ایران با هدف انتشار اخبار و اطلاعیه‌های سه گروه خیالی آغاز به کار کرد.",
    group: "اطلاعیه مشترک",
    date: "۱۴۰۵/۰۸/۲۳"
  },
  {
    id: 2,
    title: "اطلاعیه گروه جوانمردان",
    summary: "گروه جوانمردان از آغاز دوره جدید فعالیت‌های فرهنگی و رسانه‌ای خود خبر داد.",
    group: "جوانمردان",
    date: "۱۴۰۵/۰۸/۲۳"
  },
  {
    id: 3,
    title: "بیانیه شاه گشتاسبیان",
    summary: "شاه گشتاسبیان در اطلاعیه‌ای بر اهمیت گفتگو و همکاری میان گروه‌ها تأکید کرد.",
    group: "شاه گشتاسبیان",
    date: "۱۴۰۵/۰۸/۲۳"
  }
];

function App() {
  const [news, setNews] = useState<News[]>(() => {
    try {
      const saved = localStorage.getItem("royal-news");
      return saved ? JSON.parse(saved) : initialNews;
    } catch {
      return initialNews;
    }
  });

  const [category, setCategory] = useState<Group>("همه اخبار");
  const [search, setSearch] = useState("");
  const [admin, setAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [group, setGroup] = useState("جوانمردان");

  const categories: Group[] = [
    "همه اخبار",
    "جوانمردان",
    "شاه گشتاسبیان",
    "وفاداریان"
  ];

  const filteredNews = news.filter(item => {
    const matchesCategory =
      category === "همه اخبار" ||
      item.group === category ||
      item.group === "اطلاعیه مشترک";

    const matchesSearch =
      item.title.includes(search) ||
      item.summary.includes(search);

    return matchesCategory && matchesSearch;
  });

  function publishNews() {
    if (!title.trim() || !summary.trim()) {
      alert("عنوان و متن خبر را وارد کنید.");
      return;
    }

    const newNews: News = {
      id: Date.now(),
      title,
      summary,
      group,
      date: new Date().toLocaleDateString("fa-IR")
    };

    const updated = [newNews, ...news];

    setNews(updated);
    localStorage.setItem("royal-news", JSON.stringify(updated));

    setTitle("");
    setSummary("");
    setShowForm(false);
  }

  function deleteNews(id: number) {
    if (!confirm("آیا از حذف این خبر مطمئن هستید؟")) return;

    const updated = news.filter(item => item.id !== id);
    setNews(updated);
    localStorage.setItem("royal-news", JSON.stringify(updated));
  }

  return (
    <div className="portal" dir="rtl">

      <div className="topbar">
        <span>درگاه رسمی اخبار دنیای خیالی پادشاهی ایران</span>
        <span>۱۴۰۵</span>
      </div>

      <header className="hero">
        <div className="crown">♛</div>
        <div className="hero-title">درگاه پادشاهی ایران</div>
        <div className="hero-subtitle">
          پایگاه خبری و اطلاع‌رسانی سه گروه
        </div>
        <div className="gold-line"></div>
        <div className="hero-motto">
          «آگاهی، همبستگی و آینده‌نگری»
        </div>
      </header>

      <nav className="navigation">
        <button onClick={() => setCategory("همه اخبار")}>صفحه اصلی</button>
        <button onClick={() => setCategory("جوانمردان")}>جوانمردان</button>
        <button onClick={() => setCategory("شاه گشتاسبیان")}>شاه گشتاسبیان</button>
        <button onClick={() => setCategory("وفاداریان")}>وفاداریان</button>
        <button onClick={() => setCategory("همه اخبار")}>آرشیو اخبار</button>
      </nav>

      <main className="content">

        <section className="welcome">
          <div>
            <div className="welcome-label">ROYAL NEWS PORTAL</div>
            <h2>به خبرگزاری پادشاهی ایران خوش آمدید</h2>
            <p>
              تازه‌ترین اخبار، بیانیه‌ها و اطلاعیه‌های گروه‌های
              جوانمردان، شاه گشتاسبیان و وفاداریان.
            </p>
          </div>
          <div className="welcome-symbol">♛</div>
        </section>

        <div className="section-heading">
          <h2>آخرین اخبار</h2>
          <span>{filteredNews.length} خبر</span>
        </div>

        <div className="filters">
          {categories.map(item => (
            <button
              key={item}
              className={category === item ? "active-filter" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <input
          className="search"
          placeholder="جستجو در اخبار..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <section className="news-list">
          {filteredNews.map(item => (
            <article className="news-card" key={item.id}>
              <div className="news-top">
                <span className="news-category">{item.group}</span>
                <span className="news-date">{item.date}</span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.summary}</p>

              {admin && (
                <button
                  className="delete-button"
                  onClick={() => deleteNews(item.id)}
                >
                  حذف خبر
                </button>
              )}
            </article>
          ))}

          {filteredNews.length === 0 && (
            <div className="empty">خبری در این بخش وجود ندارد.</div>
          )}
        </section>

        <section className="admin-section">
          <h2>مدیریت خبرگزاری</h2>
          <p>بخش مدیریت انتشار اخبار</p>

          <button
            className="admin-button"
            onClick={() => setAdmin(!admin)}
          >
            {admin ? "بستن حالت مدیریت" : "نمایش ابزار مدیریت"}
          </button>

          {admin && (
            <button
              className="publish-button"
              onClick={() => setShowForm(!showForm)}
            >
              + انتشار خبر جدید
            </button>
          )}

          {showForm && admin && (
            <div className="form">
              <h3>انتشار خبر جدید</h3>

              <input
                placeholder="عنوان خبر"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />

              <textarea
                placeholder="متن کامل خبر..."
                value={summary}
                onChange={e => setSummary(e.target.value)}
              />

              <select
                value={group}
                onChange={e => setGroup(e.target.value)}
              >
                <option>جوانمردان</option>
                <option>شاه گشتاسبیان</option>
                <option>وفاداریان</option>
                <option>اطلاعیه مشترک</option>
              </select>

              <button className="publish-button" onClick={publishNews}>
                انتشار
              </button>
            </div>
          )}
        </section>

      </main>

      <footer>
        <div className="footer-crown">♛</div>
        <h3>درگاه پادشاهی ایران</h3>
        <p>پایگاه خبری دنیای خیالی سه گروه</p>
        <div className="footer-line"></div>
        <small>تمامی اخبار این پایگاه متعلق به یک دنیای داستانی و خیالی است.</small>
      </footer>

    </div>
  );
}

export default App;
