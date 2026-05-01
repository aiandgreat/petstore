import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1' })

export async function fetchPets() {
  const res = await api.get('/pets')
  return res.data
}
