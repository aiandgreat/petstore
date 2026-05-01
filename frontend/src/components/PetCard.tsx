import React from 'react'
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material'

export default function PetCard({ pet }: { pet: any }) {
  return (
    <Card>
      <CardMedia component="img" height="180" image={pet.imageUrl} alt={pet.name} />
      <CardContent>
        <Typography variant="h6">{pet.name}</Typography>
        <Typography variant="body2" color="text.secondary">{pet.breed} • {pet.category}</Typography>
        <Typography variant="subtitle1">${(pet.priceCents/100).toFixed(2)}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Add to Cart</Button>
      </CardActions>
    </Card>
  )
}
