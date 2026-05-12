import axios from 'axios'
import { Pet } from '../types'

function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim()
  if (configured) {
    return configured
  }

  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.onrender.com')) {
    return 'https://petstore-backend-9wyp.onrender.com/api/v1'
  }

  return 'http://localhost:8080/api/v1'
}

const api = axios.create({ baseURL: resolveApiBaseUrl() })

export async function fetchPets(): Promise<Pet[]> {
  const res = await api.get('/pets')
  return res.data
}

export async function createPet(pet: Partial<Pet>): Promise<Pet> {
  const res = await api.post('/pets', pet)
  return res.data
}

export async function updatePet(id: number, pet: Partial<Pet>): Promise<Pet> {
  const res = await api.put(`/pets/${id}`, pet)
  return res.data
}

export async function deletePet(id: number): Promise<void> {
  await api.delete(`/pets/${id}`)
}
