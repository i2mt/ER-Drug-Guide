import React from 'react'

export default function SearchBar({ value, onChange, categories, category, setCategory }) {
  return (
    <div className="searchbar">
      <input
        dir="rtl"
        className="search-input"
        placeholder="جستجوی نام دارو (فارسی/انگلیسی)، دسته یا توضیحات..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <select className="select-cat" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">همه دسته‌ها</option>
        {categories.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>
    </div>
  )
}
