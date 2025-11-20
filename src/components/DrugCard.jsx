import React, { useState } from 'react';

export default function DrugCard({ drug, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  // Check if the drug is an IV drug based on the category or other criteria
  const isIVDrug = drug.category.toLowerCase().includes('iv') || drug.dose.toLowerCase().includes('iv');

  return (
    <div className={`card ${isIVDrug ? 'ampule' : ''}`}> {/* Add the class for ampule */}
      <div className="card-left">
        {/* Show pill icon for non-IV drugs, ampule for IV drugs */}
        {isIVDrug ? (
          <div className="ampule-pill">🔬</div> // You can replace this with a custom icon or shape
        ) : (
          <div className={`pill ${drug.category.toLowerCase()}`}>{drug.category}</div>
        )}
      </div>
      <div className="card-body">
        <div className="row top">
          <div className="name">
            <span className="drug-name">{drug.name}</span>
            <span className="fa-name">{drug.faName}</span>
          </div>
          <div className="cat">{drug.category}</div>
        </div>
        <div className="row details">
          <div className="dose">{drug.dose}</div>
          <div className="routine-ltr">{drug.routine}</div>
        </div>
        <div className="row small">
          <div className="preferred-line">{drug.preferred}</div>
        </div>
        {expanded && (
          <div className="card-details-expanded">
            <div className="notes">
              <strong>توضیحات:</strong> {drug.notes}
            </div>
          </div>
        )}
        <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'بستن' : 'نمایش توضیحات'}
        </button>
        <div className="actions">
          <button onClick={onEdit}>ویرایش</button>
          <button onClick={onDelete}>حذف</button>
        </div>
      </div>
    </div>
  );
}
