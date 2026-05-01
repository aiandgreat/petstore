package com.petstore.controller;

import com.petstore.model.Pet;
import com.petstore.repository.PetRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
