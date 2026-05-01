import React, { useEffect, useState } from 'react'
import { Container, Grid, Typography, CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import PetCard from './components/PetCard'
import { fetchPets } from './services/petService'
import theme from './theme/muiTheme'

export default function App() {
  const [pets, setPets] = useState<any[]>([])

  useEffect(() => {
    fetchPets().then(setPets).catch(console.error)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ my: 4 }}>Petstore Catalog</Typography>
        <Grid container spacing={2}>
          {pets.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <PetCard pet={p} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  )
}
