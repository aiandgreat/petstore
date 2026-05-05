import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, InputAdornment } from '@mui/material'
import { Pet } from '../types'

type Props = {
  open: boolean
  pet?: Pet | null
  onClose: () => void
  onSave: (pet: Partial<Pet>) => Promise<void>
}

export default function PetFormDialog({ open, pet, onClose, onSave }: Props) {
  const [form, setForm] = useState<Partial<Pet>>({})
  const [priceDollars, setPriceDollars] = useState('0.00')
  const [saving, setSaving] = useState(false)
  const categories = ['DOG', 'CAT', 'BIRD', 'FISH', 'REPTILE', 'OTHER']

  useEffect(() => {
    setForm(pet ? { ...pet } : { name: '', category: '', breed: '', ageMonths: 0, priceCents: 0, status: 'AVAILABLE', imageUrl: '' })
    setPriceDollars(((pet?.priceCents ?? 0) / 100).toFixed(2))
  }, [pet, open])

  async function submit() {
    setSaving(true)
    try {
      const normalizedPrice = Math.round(Number(priceDollars || '0') * 100)
      await onSave({ ...form, priceCents: Number.isFinite(normalizedPrice) ? normalizedPrice : 0 })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{pet ? 'Edit Pet' : 'Add Pet'}</DialogTitle>
      <DialogContent>
        <div className="grid gap-3 py-2">
          <TextField label="Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
          <TextField
            label="Category"
            select
            value={form.category || ''}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            fullWidth
          >
            {categories.map((categoryOption) => (
              <MenuItem key={categoryOption} value={categoryOption}>
                {categoryOption}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Breed" value={form.breed || ''} onChange={(e) => setForm({ ...form, breed: e.target.value })} fullWidth />
          <TextField label="Age (months)" type="number" value={String(form.ageMonths ?? form.age_months ?? 0)} onChange={(e) => setForm({ ...form, ageMonths: Number(e.target.value) })} fullWidth />
          <TextField
            label="Price (USD)"
            value={priceDollars}
            onChange={(e) => setPriceDollars(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
            helperText="Enter the price in dollars"
          />
          <TextField label="Status" select value={form.status || 'AVAILABLE'} onChange={(e) => setForm({ ...form, status: e.target.value })} fullWidth>
            <MenuItem value="AVAILABLE">AVAILABLE</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="SOLD">SOLD</MenuItem>
          </TextField>
          <TextField label="Image URL" value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} fullWidth />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button onClick={submit} variant="contained" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  )
}
