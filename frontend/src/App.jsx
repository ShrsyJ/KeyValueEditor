import React, { useEffect, useState } from "react"
import { fetchRecords, fetchRecord, updateRecord } from "./services/api"
import RecordsTable from "./components/RecordsTable"
import RecordEditor from "./components/RecordEditor"

export default function App() {
  const [columns, setColumns] = useState([])
  const [rows, setRows] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [record, setRecord] = useState(null)
  const [persona, setPersona] = useState(() => sessionStorage.getItem("persona") || "Creator")

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (selectedId != null) loadRecord(selectedId)
  }, [selectedId])

  function togglePersona() {
    const next = persona === "Creator" ? "Ops" : "Creator"
    setPersona(next)
    sessionStorage.setItem("persona", next)
  }

  async function load() {
    const data = await fetchRecords()
    setColumns(data.columns)
    setRows(data.rows)
    if (data.rows.length > 0 && !selectedId) {
      setSelectedId(data.rows[0].id)
    }
  }

  async function loadRecord(id) {
    const data = await fetchRecord(id)
    setColumns(data.columns)
    setRecord(data.record)
  }

  async function handleSave(id, payload) {
    await updateRecord(id, payload)
    // refresh list and record
    await load()
    await loadRecord(id)
    alert("Saved")
  }

  return (
    <div className="app">
      <div className="topbar">
        <h1>KeyValueEditor</h1>
        <div>
          <button className="profile-btn" onClick={togglePersona} title="Toggle persona">
            Persona: {persona}
          </button>
        </div>
      </div>

      <RecordsTable columns={columns} rows={rows} onSelect={setSelectedId} />

      <RecordEditor columns={columns} record={record} persona={persona} onSave={handleSave} />
    </div>
  )
}
