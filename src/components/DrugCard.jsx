import React, { useState } from 'react'

// نگاشت دسته دارویی به رنگ نرم برای نوار کنار کارت
const categoryColors = {
  Antibiotic: 'var(--col-antibiotic)',
  Antihypertensive: 'var(--col-antihypertensive)',
  Antiplatelet: 'var(--col-antiplatelet)',
  Antilipid: 'var(--col-antilipid)',
  Bronchodilator: 'var(--col-bronchodilator)',
  Corticosteroid: 'var(--col-corticosteroid)',
  Analgesic: 'var(--col-analgesic)',
  'Analgesic / Opioid': 'var(--col-opioid)',
  Anticoagulant: 'var(--col-anticoagulant)',
  Diuretic: 'var(--col-diuretic)',
  Antidiabetic: 'var(--col-antidiabetic)',
  GI: 'var(--col-gi)',
  Anticonvulsant: 'var(--col-anticonvulsant)',
  Antiepileptic: 'var(--col-anticonvulsant)',
  Electrolyte: 'var(--col-electrolyte)',
  'GI Protectant': 'var(--col-gi)',
  Thyroid: 'var(--col-other)',
  Supplement: 'var(--col-other)',
  Antifungal: 'var(--col-antibiotic)',
  Antiviral: 'var(--col-antibiotic)',
  Other: 'var(--col-other)',
  'Beta-blocker': 'var(--col-antihypertensive)',
  'Anti-leukotriene': 'var(--col-other)',
  Antianginal: 'var(--col-other)'
}

// تبدیل اعداد فارسی به انگلیسی
function toEnglishDigits(value) {
  if (value == null) return ''
  const str = value.toString()
  const fa = '۰۱۲۳۴۵۶۷۸۹'
  const en = '0123456789'
  return str.replace(/[۰-۹]/g, d => en[fa.indexOf(d)])
}

// نمایش متن لاتین (دوز، روتین، ساعت‌ها)
const L = ({ children }) => (
  <span dir="ltr" className="latin-num">
    {toEnglishDigits(children)}
  </span>
)

// رندر روتین با بولد شدن روتین‌های انتخابی (مثل BID برای سفازولین)
function renderRoutine(drug) {
  const text = drug.routine || ''
  const highlights = Array.isArray(drug.preferredRoutineHighlight)
    ? drug.preferredRoutineHighlight
    : []

  if (!text) return null

  // جدا کردن بر اساس خط فاصله (مثلاً "OD - BID")
  const parts = text.split('-').map(p => p.trim()).filter(p => p.length > 0)

  return parts.map((part, idx) => {
    const isBold = highlights.includes(part)
    const node = isBold ? (
      <strong key={`rt-${idx}`} className="preferred-bold">
        <L>{part}</L>
      </strong>
    ) : (
      <span key={`rt-${idx}`}>
        <L>{part}</L>
      </span>
    )

    const sep =
      idx < parts.length - 1 ? (
        <span key={`rt-sep-${idx}`}>{' - '}</span>
      ) : null

    return (
      <React.Fragment key={`rt-wrap-${idx}`}>
        {node}
        {sep}
      </React.Fragment>
    )
  })
}

// رندر زمان ترجیحی با بولد شدن ساعت‌های انتخابی
function renderPreferred(drug) {
  const text = drug.preferred || ''
  const highlights = Array.isArray(drug.preferredHighlight)
    ? drug.preferredHighlight
    : []

  if (!text) return <span>-</span>

  // هم "-" و هم "–" را جداکننده در نظر بگیریم
  const parts = text.split(/[-–]/).map(p => p.trim()).filter(p => p.length > 0)

  return parts.map((part, idx) => {
    const isBold = highlights.includes(part)
    const node = isBold ? (
      <strong key={`pf-${idx}`} className="preferred-bold">
        <L>{part}</L>
      </strong>
    ) : (
      <span key={`pf-${idx}`}>
        <L>{part}</L>
      </span>
    )

    const sep =
      idx < parts.length - 1 ? (
        <span key={`pf-sep-${idx}`}>{' - '}</span>
      ) : null

    return (
      <React.Fragment key={`pf-wrap-${idx}`}>
        {node}
        {sep}
      </React.Fragment>
    )
  })
}

export default function DrugCard({ drug }) {
  const [open, setOpen] = useState(false)

  const cssVar = categoryColors[drug.category] || 'var(--col-default)'

  const handleToggle = () => {
    setOpen(o => !o)
  }

  return (
    <article
      className={open ? 'card expanded' : 'card'}
      style={{ cursor: 'pointer' }}
      onClick={handleToggle}
    >
      {/* نوار رنگی کناری */}
      <div
        className="card-left"
        style={{ background: `linear-gradient(180deg, ${cssVar}, transparent)` }}
      />

      <div className="card-body">
        {/* نام دارو و دسته */}
        <div className="row top">
          <div className="name">
            <span className="pill">💊</span>
            <div>
              <div className="drug-name">
                <L>{drug.name}</L>
              </div>
              {drug.faName && (
                <div className="fa-name">
                  {drug.faName}
                </div>
              )}
            </div>
          </div>
          <div className="cat">{drug.category}</div>
        </div>

        {/* دوز و روتین */}
        <div className="row details" style={{ alignItems: 'center' }}>
          <div>
            <strong>دوز:</strong>{' '}
            <L>{drug.dose}</L>
          </div>
          <div>
  <strong>روتین:</strong>{' '}
  <span className="routine-ltr" dir="ltr">
    {renderRoutine(drug)}
  </span>
</div>

        </div>

        {/* زمان ترجیحی */}
        <div className="row small preferred-line">
  <strong>زمان ترجیحی:</strong>{' '}
  <span className="preferred-hours" dir="ltr">
    {renderPreferred(drug)}
  </span>
</div>


        {/* توضیحات (اگر هست) */}
        {drug.notes && drug.notes.trim() !== '' && (
          <div className="card-details-brief">
            <div className="card-details-expanded">
              <div className="notes">
                <span className="notes-label">توضیحات: </span>
                {toEnglishDigits(drug.notes)}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
