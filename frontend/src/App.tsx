import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Chip,
  Container,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { Snackbar, Alert } from '@mui/material'
import PetCard from './components/PetCard'
import PetFormDialog from './components/PetFormDialog'
import PetstoreLogo from './components/PetstoreLogo'
import NavBar from './components/NavBar'
import About from './pages/About'
import { createPet, deletePet, fetchPets, updatePet } from './services/petService'
import { Pet } from './types'
import theme from './theme/muiTheme'

export default function App() {
  const [pets, setPets] = useState<Pet[]>([])
  const [page, setPage] = useState<'home' | 'about'>('home')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [sortBy, setSortBy] = useState('featured')
  const [formOpen, setFormOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success')

  useEffect(() => {
    fetchPets().then(setPets).catch(console.error)
  }, [])

  async function reload() {
    try {
      const list = await fetchPets()
      setPets(list)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSavePet(pet: Partial<Pet>) {
    try {
      if (pet.id) {
        await updatePet(pet.id, pet)
        setSnackbarMsg('Pet updated')
      } else {
        await createPet(pet)
        setSnackbarMsg('Pet added')
      }
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
      await reload()
    } catch (err) {
      console.error(err)
      setSnackbarMsg('Failed to save pet')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      throw err
    }
  }

  async function handleDeletePet(pet: Pet) {
    // open confirmation dialog
    setPendingDelete(pet)
  }

  const [pendingDelete, setPendingDelete] = useState<Pet | null>(null)

  async function confirmDelete() {
    if (!pendingDelete) return
    try {
      await deletePet(pendingDelete.id)
      await reload()
      setSnackbarMsg('Pet deleted')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
    } catch (err) {
      console.error(err)
      setSnackbarMsg('Failed to delete pet')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    } finally {
      setPendingDelete(null)
    }
  }

  const categories = useMemo(() => ['ALL', ...new Set(pets.map((pet) => pet.category).filter(Boolean))], [pets])
  const statuses = useMemo(() => ['ALL', ...new Set(pets.map((pet) => pet.status).filter(Boolean))], [pets])
  const totalPetValue = useMemo(
    () => pets.reduce((sum, pet) => sum + pet.priceCents, 0) / 100,
    [pets]
  )
  const availablePets = useMemo(
    () => pets.filter((pet) => pet.status === 'AVAILABLE').length,
    [pets]
  )
  const dogPets = useMemo(
    () => pets.filter((pet) => pet.category?.toUpperCase() === 'DOG').length,
    [pets]
  )
  const catPets = useMemo(
    () => pets.filter((pet) => pet.category?.toUpperCase() === 'CAT').length,
    [pets]
  )

  const filteredPets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = pets.filter((pet) => {
      const matchesQuery = !normalizedQuery || [pet.name, pet.breed, pet.category]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))

      const matchesCategory = category === 'ALL' || pet.category === category
      const matchesStatus = status === 'ALL' || pet.status === status

      return matchesQuery && matchesCategory && matchesStatus
    })

    if (sortBy === 'price-low') {
      return [...filtered].sort((a, b) => a.priceCents - b.priceCents)
    }

    if (sortBy === 'price-high') {
      return [...filtered].sort((a, b) => b.priceCents - a.priceCents)
    }

    return filtered
  }, [pets, query, category, status, sortBy])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar page={page} onNavigate={setPage} onAddPet={() => { setEditingPet(null); setFormOpen(true) }} />
      {page === 'home' ? (
        <Box className="min-h-screen pb-12">
          <Container maxWidth="lg" className="py-6 sm:py-8">
          <Paper className="mb-8 overflow-hidden border border-emerald-100/80 bg-white/90 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-6">
                <PetstoreLogo />
                <div className="space-y-4">
                  <Typography variant="h3" component="h1" className="text-balance text-4xl text-slate-900 sm:text-5xl">
                    Pawsome to see you here!
                  </Typography>
                  <Typography variant="body1" className="max-w-2xl text-lg leading-8 text-slate-600">
                    Search by name, breed, or category. Filter by availability and sort pets by price to find the right companion quicker.
                  </Typography>
                </div>
              </div>

              <div className="grid gap-4 rounded-3xl bg-gradient-to-br from-emerald-500 via-green-600 to-lime-500 p-6 text-white shadow-2xl shadow-emerald-700/25">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-50/80">Our Vibe</p>
                  <p className="mt-2 text-2xl font-black leading-tight">
                    Friendly, trusted, and full of wag-worthy companions — curated to help you find a perfect match for your home.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <div className="text-2xl font-black">{dogPets}</div>
                    <div className="mt-1 text-white/80">Dogs</div>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <div className="text-2xl font-black">{availablePets}</div>
                    <div className="mt-1 text-white/80">Available Pets</div>
                  </div>
                  <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                    <div className="text-2xl font-black">{catPets}</div>
                    <div className="mt-1 text-white/80">Cats</div>
                  </div>
                </div>
              </div>
            </div>
          </Paper>

          <Paper className="mb-8 border border-emerald-100/80 bg-white/95 p-4 shadow-lg shadow-emerald-900/5 md:p-6">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] lg:items-end">
              <TextField
                label="Search pets"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try 'Coco', 'cat', or 'goldfish'"
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={category} label="Category" onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={status} label="Status" onChange={(event) => setStatus(event.target.value)}>
                  {statuses.map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select value={sortBy} label="Sort by" onChange={(event) => setSortBy(event.target.value)}>
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="price-low">Price: Low to high</MenuItem>
                  <MenuItem value="price-high">Price: High to low</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Paper>

          <div className="mb-4 flex items-center justify-between px-1">
            <Typography variant="h5" className="text-slate-900">Pet listings</Typography>
            <Typography variant="body2" className="text-slate-500">
              {filteredPets.length} result{filteredPets.length === 1 ? '' : 's'}
            </Typography>
          </div>

          {filteredPets.length === 0 ? (
            <Paper className="border border-dashed border-emerald-200 bg-white/85 p-10 text-center shadow-none">
              <Typography variant="h6" className="text-slate-900">No pets match those filters</Typography>
              <Typography variant="body2" className="mt-2 text-slate-500">
                Try clearing a filter or searching for another breed, category, or name.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredPets.map((pet) => (
                <Grid item xs={12} sm={6} md={4} key={pet.id}>
                  <PetCard pet={pet} onEdit={(p) => { setEditingPet(p); setFormOpen(true) }} onDelete={handleDeletePet} />
                </Grid>
              ))}
            </Grid>
          )}
          
          <PetFormDialog open={formOpen} pet={editingPet || undefined} onClose={() => setFormOpen(false)} onSave={handleSavePet} />
          <Dialog
            open={Boolean(pendingDelete)}
            onClose={() => setPendingDelete(null)}
            aria-labelledby="confirm-delete-title"
          >
            <DialogTitle id="confirm-delete-title">Confirm deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to permanently delete {pendingDelete?.name ?? 'this pet'}? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button color="error" variant="contained" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar open={snackbarOpen} autoHideDuration={3500} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMsg}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
      ) : (
        <About />
      )}
    </ThemeProvider>
  )
}
