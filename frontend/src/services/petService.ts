import axios from 'axios'
import { Pet } from '../types'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1' })

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
