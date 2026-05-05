import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// Use a lightweight burger glyph to avoid icon dependency issues
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import PetstoreLogo from './PetstoreLogo'

type Props = {
  page: 'home' | 'about'
  onNavigate: (p: 'home' | 'about') => void
  onAddPet?: () => void
}

export default function NavBar({ page, onNavigate, onAddPet }: Props) {
  const [open, setOpen] = React.useState(false)

  const items: { key: 'home' | 'about'; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About Us' }
  ]

  return (
    <AppBar position="sticky" color="transparent" elevation={0} className="backdrop-blur" component="nav" aria-label="Primary">
      <Toolbar className="mx-auto max-w-6xl w-full">
        <Box className="flex items-center gap-4" sx={{ flexGrow: 1 }}>
          <button
            type="button"
            aria-label="Go to home page"
            onClick={() => onNavigate('home')}
            className="mr-2 rounded-xl transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <PetstoreLogo />
          </button>
        </Box>

        <Box className="hidden sm:flex" sx={{ gap: 1 }}>
          {items.map((it) => (
            <Button
              key={it.key}
              color={page === it.key ? 'primary' : 'inherit'}
              variant={page === it.key ? 'contained' : 'text'}
              aria-current={page === it.key ? 'page' : undefined}
              onClick={() => onNavigate(it.key)}
            >
              {it.label}
            </Button>
          ))}
          <Button
            onClick={() => onAddPet && onAddPet()}
            variant="outlined"
            color="primary"
            className="ml-2"
            aria-label="Add a new pet"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderColor: 'primary.main'
              }
            }}
          >
            Add Pet
          </Button>
        </Box>

        <IconButton
          color="inherit"
          aria-label="open drawer"
          aria-controls="mobile-nav-drawer"
          aria-expanded={open ? 'true' : undefined}
          edge="end"
          onClick={() => setOpen(true)}
          sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
        >
          <span aria-hidden className="text-2xl leading-none">☰</span>
        </IconButton>

          <Drawer id="mobile-nav-drawer" anchor="right" open={open} onClose={() => setOpen(false)}>
            <Box sx={{ width: 260 }} role="presentation">
            <List>
              {items.map((it) => (
                <ListItem key={it.key} disablePadding>
                    <ListItemButton onClick={() => { onNavigate(it.key); setOpen(false) }} selected={page === it.key}>
                    <ListItemText primary={it.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => { setOpen(false); onAddPet && onAddPet() }}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  <ListItemText primary="Add Pet" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <Box className="p-4">
              <Typography variant="body2" color="text.secondary">Petstore — small friendly shop</Typography>
            </Box>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  )
}
