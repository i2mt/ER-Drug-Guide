import React, { useEffect, useState } from 'react'

export default function AddDrugModal({ mode = 'add', initial, onClose, onSave }) {
  const [name, setName] = useState('')
  const [faName, setFaName] = useState('')
  const [category, setCategory] = useState('')
  const [dose, setDose] = useState('')
  const [routine, setRoutine] = useState('')
  const [preferred, setPreferred] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setFaName(initial.faName || '')
      setCategory(initial.category || '')
      setDose(initial.dose || '')
      setRoutine(initial.routine || '')
      setPreferred(initial.preferred || '')
      setNotes(initial.notes || '')
    }
  }, [initial])

  function handleSave() {
    if (!name || !category) {
      alert('حداقل نام انگلیسی دارو و دسته دارویی را وارد کنید.')
      return
    }
    const base = initial || {}
    const obj = {
      ...base,
      name,
      faName,
      category,
      dose,
      routine,
      preferred,
      notes
    }
    onSave(obj)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{mode === 'edit' ? 'ویرایش دارو' : 'افزودن دارو'}</h3>

        <label>نام دارو (English):</label>
        <input dir="ltr" value={name} onChange={e => setName(e.target.value)} />

        <label>نام فارسی دارو:</label>
        <input value={faName} onChange={e => setFaName(e.target.value)} />

        <label>دسته دارویی:</label>
        <input value={category} onChange={e => setCategory(e.target.value)} />

        <label>دوز (English):</label>
        <input dir="ltr" value={dose} onChange={e => setDose(e.target.value)} />

        <label>روتین (مثلاً BID / OD / QID):</label>
        <input dir="ltr" value={routine} onChange={e => setRoutine(e.target.value)} />

        <label>زمان ترجیحی:</label>
        <input dir="ltr" value={preferred} onChange={e => setPreferred(e.target.value)} />

        <label>توضیحات (فارسی):</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} />

        <div className="modal-actions">
          <button className="btn" onClick={handleSave}>ذخیره</button>
          <button className="btn ghost" onClick={onClose}>انصراف</button>
        </div>
      </div>
    </div>
  )
}
