import React from "react"

export default function RecordsTable({ columns, rows, onSelect }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} onClick={() => onSelect(r.id)} style={{ cursor: "pointer" }}>
            {columns.map((c) => (
              <td key={c}>{r[c]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
