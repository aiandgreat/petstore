package com.petstore.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.model.Pet;
import com.petstore.repository.PetRepository;

@RestController
@RequestMapping("/api/v1/pets")
public class PetController {
    private final PetRepository petRepository;

    public PetController(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @GetMapping
    public List<Pet> list() {
        return petRepository.findAll();
    }

    @GetMapping("/{id}")
    public Pet get(@PathVariable Long id) {
        return petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));
    }

    @PostMapping
    public ResponseEntity<Pet> create(@RequestBody Pet pet) {
        Pet saved = petRepository.save(pet);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> update(@PathVariable Long id, @RequestBody Pet pet) {
        Pet existing = petRepository.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));
        existing.setName(pet.getName());
        existing.setCategory(pet.getCategory());
        existing.setBreed(pet.getBreed());
        existing.setAgeMonths(pet.getAgeMonths());
        existing.setPriceCents(pet.getPriceCents());
        existing.setStatus(pet.getStatus());
        existing.setImageUrl(pet.getImageUrl());
        Pet saved = petRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!petRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        petRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
