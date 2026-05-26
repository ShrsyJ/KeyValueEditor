import React, { useState, useEffect } from "react"

export default function RecordEditor({ columns, record, persona, onSave }) {
  const [form, setForm] = useState(record || {})

  useEffect(() => setForm(record || {}), [record])

  if (!record) return <div>Select a record to edit</div>

  const last4 = columns.slice(-4)

  function handleChange(col, val) {
    const next = { ...form, [col]: val }
    // Enforce validation_of equals skillid in UI before save
    if (col === "skillid" && columns.includes("validation_of")) {
      next["validation_of"] = val
    }
    setForm(next)
  }

  function canEdit(col) {
    if (col === "id") return false
    if (persona === "Creator") return true
    // Ops: only last 4 columns editable
    return last4.includes(col)
  }

  return (
    <div className="editor">
      <h3>Editing record id: {record.id}</h3>
      {columns.map((c) => (
        <div className="field" key={c}>
          <label>{c}</label>
          <input
            value={form[c] ?? ""}
            onChange={(e) => handleChange(c, e.target.value)}
            disabled={!canEdit(c)}
            style={{ width: "100%" }}
          />
        </div>
      ))}
      <button className="save-btn" onClick={() => onSave(record.id, form)}>
        Save
      </button>
    </div>
  )
}
