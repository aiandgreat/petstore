import React from 'react'
import { Card, CardContent, CardMedia, Typography, CardActions, Button, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { Pet } from '../types'

export default function PetCard({ pet, onEdit, onDelete }: { pet: Pet, onEdit?: (p: Pet) => void, onDelete?: (p: Pet) => void }) {
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const price = (pet.priceCents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD'
  })
  const ageMonths = pet.ageMonths ?? pet.age_months

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <CardMedia
        component="img"
        height="220"
        image={pet.imageUrl}
        alt={pet.name}
        className="h-56 object-cover transition duration-500 group-hover:scale-105"
      />
      <CardContent className="space-y-3">
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="h6" className="text-slate-900">{pet.name}</Typography>
          <Chip size="small" color={pet.status === 'AVAILABLE' ? 'success' : 'default'} label={pet.status} />
        </Stack>
        <Typography variant="body2" color="text.secondary" className="leading-6">
          {pet.breed} • {pet.category}
        </Typography>
        <Typography variant="subtitle1" className="font-bold text-emerald-700">{price}</Typography>
      </CardContent>
      <CardActions className="flex flex-col gap-2 px-4 pb-4 sm:flex-row">
        <Button fullWidth variant="contained" color="primary" onClick={() => setDetailsOpen(true)}>
          View Details
        </Button>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => onEdit && onEdit(pet)}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderColor: 'primary.main'
              }
            }}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => onDelete && onDelete(pet)}
            sx={{
              '&:hover': {
                backgroundColor: 'error.main',
                color: 'error.contrastText',
                borderColor: 'error.main'
              }
            }}
          >
            Delete
          </Button>
        </div>
      </CardActions>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle className="pb-2 text-2xl font-bold">{pet.name}</DialogTitle>
        <DialogContent className="space-y-4">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="h-56 w-full rounded-2xl object-cover"
          />
          <div className="grid gap-2 text-base text-slate-700">
            <div><span className="font-semibold text-slate-900">Category:</span> {pet.category}</div>
            <div><span className="font-semibold text-slate-900">Breed:</span> {pet.breed}</div>
            <div><span className="font-semibold text-slate-900">Age:</span> {ageMonths ?? 0} months</div>
            <div><span className="font-semibold text-slate-900">Status:</span> {pet.status}</div>
            <div><span className="font-semibold text-slate-900">Price:</span> {price}</div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
