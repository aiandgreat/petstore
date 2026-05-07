import React from 'react'
import { Container, Paper, Typography } from '@mui/material'
import PetstoreLogo from '../components/PetstoreLogo'

export default function About() {
  return (
    <Container maxWidth="md" className="py-16">
      <Paper className="p-10 rounded-2xl shadow-lg mx-auto bg-white/95">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4 transform scale-150">
            <PetstoreLogo />
          </div>
          <Typography variant="h3" className="font-extrabold mb-6">About Us</Typography>
          <Typography variant="subtitle1" color="text.secondary" className="mb-8 max-w-prose">
            Small team. Big hearts. We pair loving families with healthy, well-cared-for pets.
          </Typography>
        </div>

        <div className="space-y-4 text-slate-700 leading-relaxed max-w-prose mx-auto">
          <Typography variant="body1">
            Petstore began with a small team of animal lovers who wanted to make finding a companion easier and more delightful. We curate healthy, happy pets and provide clear information so you can make the best choice for your family.
          </Typography>
          <Typography variant="body1">
            We believe in responsible sourcing, transparent care histories, and supporting local shelters where possible. Our practices prioritize the welfare of animals and the confidence of their future families.
          </Typography>

          <div className="mt-6 text-center">
            <Typography variant="h5" className="mb-3 font-semibold">Our history</Typography>
            <Typography variant="body2" className="mx-auto max-w-2xl text-slate-700">
              Started by a group of local animal advocates, Petstore grew from a simple idea: make it easier for families to find healthy, well-cared-for pets. Over time we've partnered with trusted caregivers and shelters to expand our selection while keeping care standards high.
            </Typography>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-emerald-50 text-emerald-900 text-center">
            <Typography variant="h6" className="font-semibold">Contact Us</Typography>
            <Typography variant="body1" className="mt-1 font-medium">
              <a href="mailto:ajsgarcia.student@ua.edu.ph" className="underline">ajsgarcia.student@ua.edu.ph</a>
            </Typography>
            <Typography variant="body2" className="mt-1 text-emerald-800/80">We reply to inquiries within 1–2 business days.</Typography>
          </div>
        </div>
      </Paper>
    </Container>
  )
}
