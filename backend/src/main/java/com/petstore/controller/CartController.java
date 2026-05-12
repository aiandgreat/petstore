package com.petstore.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.model.CartItem;
import com.petstore.model.Pet;
import com.petstore.repository.CartItemRepository;
import com.petstore.repository.PetRepository;

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
    public List<CartItem> getCart(@RequestHeader(value = "X-User-Id", required = false) String userId) {
        return cartRepo.findByUserId(resolveUserId(userId));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartItem req, @RequestHeader(value = "X-User-Id", required = false) String userId) {
        req.setUserId(resolveUserId(userId));
        // validate pet exists and available
        Pet pet = petRepo.findById(req.getPetId()).orElse(null);
        if (pet == null) return ResponseEntity.badRequest().body("Pet not found");
        if (!"AVAILABLE".equals(pet.getStatus())) return ResponseEntity.badRequest().body("Pet not available");
        CartItem saved = cartRepo.save(req);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id, @RequestHeader(value = "X-User-Id", required = false) String userId) {
        String effectiveUserId = resolveUserId(userId);
        return cartRepo.findById(id).map(ci -> {
            if (!effectiveUserId.equals(ci.getUserId())) return ResponseEntity.status(403).body("Not owner");
            cartRepo.delete(ci);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private String resolveUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            return "guest";
        }
        return userId;
    }
}
