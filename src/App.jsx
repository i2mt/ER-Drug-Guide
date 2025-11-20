import React, { useState, useEffect, useMemo } from 'react';
import DrugCard from './components/DrugCard';
import AddDrugModal from './components/AddDrugModal';
import SearchBar from './components/SearchBar';
import initialData from './data/drugs.json';

const LOCAL_ALL_KEY = 'er_drug_guide_alldrugs_v1';
const THEME_KEY = 'er_drug_guide_theme_v1';

function ensureIds(list) {
  return list.map(d => {
    if (d.id) return d;
    let id = '';
    if (window.crypto && window.crypto.randomUUID) {
      id = window.crypto.randomUUID();
    } else {
      id = 'drug-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    }
    return { ...d, id };
  });
}

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [theme, setTheme] = useState('light');
  const [showAdd, setShowAdd] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else {
      setTheme('light');
    }

    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(LOCAL_ALL_KEY) || 'null');
    } catch {
      stored = null;
    }
    if (Array.isArray(stored) && stored.length > 0) {
      setDrugs(ensureIds(stored));
    } else {
      setDrugs(ensureIds(initialData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (drugs && drugs.length > 0) {
      localStorage.setItem(LOCAL_ALL_KEY, JSON.stringify(drugs));
    }
  }, [drugs]);

  const categories = useMemo(() => {
    const set = new Set(drugs.map(d => d.category).filter(Boolean));
    return Array.from(set).sort();
  }, [drugs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return drugs.filter(d => {
      if (category && d.category !== category) return false;
      if (!q) return true;

      const name = (d.name || '').toLowerCase();
      const faName = (d.faName || '').toLowerCase();
      const cat = (d.category || '').toLowerCase();
      const notes = (d.notes || '').toLowerCase();
      const pref = (d.preferred || '').toLowerCase();

      return (
        name.includes(q) ||
        faName.includes(q) ||
        cat.includes(q) ||
        notes.includes(q) ||
        pref.includes(q)
      );
    });
  }, [drugs, query, category]);

  const handleAddDrug = newDrug => {
    const withId = ensureIds([newDrug])[0];
    setDrugs(prev => [withId, ...prev]);
    setShowAdd(false);
  };

  const handleStartEdit = drug => {
    setEditingDrug(drug);
  };

  const handleSaveEdit = updated => {
    setDrugs(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    setEditingDrug(null);
  };

  const handleDelete = id => {
    if (!window.confirm('از حذف این دارو مطمئن هستید؟')) return;
    setDrugs(prev => prev.filter(d => d.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={theme === 'dark' ? 'app dark' : 'app'}>
      <header className="topbar">
        <div className="title">راهنمای سریع داروهای اورژانس</div>
        <div className="controls">
          <button className="btn ghost" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ حالت روز' : '🌙 حالت شب'}
          </button>
          <button className="btn" onClick={() => setShowAdd(true)}>
            افزودن دارو
          </button>
        </div>
      </header>

      <main className="container">
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
            نام دارو و اعداد به انگلیسی، نام فارسی قابل جستجو است.
          </div>
        </div>

        <section className="grid">
          {filtered.map(d => (
            <DrugCard
              key={d.id}
              drug={d}
              onEdit={() => handleStartEdit(d)}
              onDelete={() => handleDelete(d.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="empty">هیچ دارویی پیدا نشد.</div>
          )}
        </section>
      </main>

      <footer className="footer">
           راهنمای تنظیم کاردکس بیماران و زمان بندی داروهای شایع در اورژانس براساس مکانیسم اثر آن‌ها.
    در طراحی لیست زیر سعی شده تا حد ممکن از دلایل علمی استفاده شود.
    داروهایی که مصرف آن‌ها عموماً TDS و یا QID می‌باشند با توجه به مشخص بودن نحوه‌ی تنظیم، ذکر نگردیده‌اند.
      </footer>

      {showAdd && (
        <AddDrugModal
          mode="add"
          onClose={() => setShowAdd(false)}
          onSave={handleAddDrug}
        />
      )}

      {editingDrug && (
        <AddDrugModal
          mode="edit"
          initial={editingDrug}
          onClose={() => setEditingDrug(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
