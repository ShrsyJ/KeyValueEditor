import axios from "axios"

const api = axios.create({ baseURL: "http://localhost:8000/api" })

export async function fetchRecords() {
  const res = await api.get("/records")
  return res.data
}

export async function fetchRecord(id) {
  const res = await api.get(`/records/${id}`)
  return res.data
}

export async function updateRecord(id, payload) {
  const res = await api.put(`/records/${id}`, payload)
  return res.data
}

export default api
