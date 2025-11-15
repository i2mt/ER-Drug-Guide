import React, { useMemo, useState } from 'react'
import DrugCard from './components/DrugCard'
import SearchBar from './components/SearchBar'
import initialData from './data/drugs.json'

export default function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // حالا لیست داروها فقط از فایل JSON می‌آید
  const drugs = initialData

  // دسته‌ها برای فیلتر
  const categories = useMemo(() => {
    const set = new Set(drugs.map(d => d.category).filter(Boolean))
    return Array.from(set).sort()
  }, [drugs])

  // فیلتر کردن با جستجو (فارسی + انگلیسی) و دسته
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return drugs.filter(d => {
      if (category && d.category !== category) return false
      if (!q) return true

      const name   = (d.name || '').toLowerCase()
      const faName = (d.faName || '').toLowerCase()
      const cat    = (d.category || '').toLowerCase()
      const notes  = (d.notes || '').toLowerCase()
      const pref   = (d.preferred || '').toLowerCase()

      return (
        name.includes(q) ||
        faName.includes(q) ||
        cat.includes(q) ||
        notes.includes(q) ||
        pref.includes(q)
      )
    })
  }, [drugs, query, category])

  return (
    <div className={theme === 'dark' ? 'app dark' : 'app'}>
      <header className="topbar">
        <div className="title">راهنمای سریع داروهای اورژانس</div>
        <div className="controls">
          <button className="btn ghost" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ حالت روز' : '🌙 حالت شب'}
          </button>
        </div>
      </header>

      <main className="container">
        {/* اگر intro-card را در CSS نگه داشته‌ای، می‌توانی این بلوک را بالای سرچ بگذاری */}
        <div className="intro-card">
          <strong></strong>
          <div>
            راهنمای تنظیم کاردکس بیماران و زمان‌بندی داروهای شایع در اورژانس بر اساس مکانیسم اثر آن‌ها. 
داروهایی که مصرف آن‌ها معمولاً  
<span class="latin-small">TDS</span>
  یا  
<span class="latin-small">QID</span> 
  می‌باشد با توجه به مشخص بودن نحوهٔ تنظیم، ذکر نگردیده‌اند.

          </div>
        </div>

        <SearchBar
          value={query}
          onChange={setQuery}
          categories={categories}
          category={category}
          setCategory={setCategory}
        />

        <div className="meta-row">
          <div className="count">
            نتایج: {filtered.length} / مجموع: {drugs.length}
          </div>
          <div className="hint">
          </div>
        </div>

        <section className="grid">
          {filtered.map(d => (
            <DrugCard key={d.name} drug={d} />
          ))}
          {filtered.length === 0 && (
            <div className="empty">هیچ دارویی پیدا نشد.</div>
          )}
        </section>
      </main>

      <footer className="footer">
  <span className="signature"> v 0.5 © 2025 — Developed by Mohammad Mahdi Taghavi </span>
</footer>

    </div>
  )
}
