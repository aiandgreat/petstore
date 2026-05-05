package com.petstore.controller;

import com.petstore.model.CartItem;
import com.petstore.model.Pet;
import com.petstore.repository.CartItemRepository;
import com.petstore.repository.PetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
    private final CartItemRepository cartRepo;
    private final PetRepository petRepo;

    public CartController(CartItemRepository cartRepo, PetRepository petRepo) {
        this.cartRepo = cartRepo;
        this.petRepo = petRepo;
    }

    @GetMapping
    public List<CartItem> getCart(Authentication auth) {
        return cartRepo.findByUserId(auth.getName());
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartItem req, Authentication auth) {
        req.setUserId(auth.getName());
        // validate pet exists and available
        Pet pet = petRepo.findById(req.getPetId()).orElse(null);
        if (pet == null) return ResponseEntity.badRequest().body("Pet not found");
        if (!"AVAILABLE".equals(pet.getStatus())) return ResponseEntity.badRequest().body("Pet not available");
        CartItem saved = cartRepo.save(req);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id, Authentication auth) {
        return cartRepo.findById(id).map(ci -> {
            if (!auth.getName().equals(ci.getUserId())) return ResponseEntity.status(403).body("Not owner");
            cartRepo.delete(ci);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
