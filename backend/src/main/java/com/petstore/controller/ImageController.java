package com.petstore.controller;

import com.petstore.model.Pet;
import com.petstore.repository.PetRepository;
import com.petstore.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/v1/admin/pets")
public class ImageController {
    private final StorageService storage;
    private final PetRepository petRepo;

    public ImageController(StorageService storage, PetRepository petRepo) { this.storage = storage; this.petRepo = petRepo; }

    @PostMapping("/{id}/image")
    public ResponseEntity<?> upload(@PathVariable Long id, @RequestParam MultipartFile file) throws Exception {
        Pet pet = petRepo.findById(id).orElseThrow(() -> new RuntimeException("Pet not found"));
        String key = "pet_" + id;
        String url = storage.store(file, key);
        pet.setImageUrl(url);
        petRepo.save(pet);
        return ResponseEntity.ok().body(java.util.Map.of("url", url));
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serve(@PathVariable String filename) throws MalformedURLException {
        Path p = Path.of("uploads").resolve(filename);
        Resource r = new UrlResource(p.toUri());
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE).body(r);
    }
}
