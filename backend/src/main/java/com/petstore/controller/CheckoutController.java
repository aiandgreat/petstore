package com.petstore.controller;

import com.petstore.model.*;
import com.petstore.repository.CartItemRepository;
import com.petstore.repository.OrderRepository;
import com.petstore.repository.PetRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/checkout")
public class CheckoutController {
    private final CartItemRepository cartRepo;
    private final OrderRepository orderRepo;
    private final PetRepository petRepo;

    public CheckoutController(CartItemRepository cartRepo, OrderRepository orderRepo, PetRepository petRepo) {
        this.cartRepo = cartRepo;
        this.orderRepo = orderRepo;
        this.petRepo = petRepo;
    }

    @PostMapping("/orders")
    @Transactional
    public ResponseEntity<?> createOrder(Authentication auth) {
        String userId = auth.getName();
        List<CartItem> items = cartRepo.findByUserId(userId);
        if (items.isEmpty()) return ResponseEntity.badRequest().body("Cart empty");

        OrderEntity order = new OrderEntity();
        order.setUserId(userId);
        order.setStatus("PROCESSING");

        for (CartItem ci : items) {
            Pet pet = petRepo.findById(ci.getPetId()).orElseThrow(() -> new RuntimeException("Pet not found"));
            if (!"AVAILABLE".equals(pet.getStatus())) throw new RuntimeException("Pet not available");
            OrderItem oi = new OrderItem();
            oi.setPetId(pet.getId());
            oi.setPetName(pet.getName());
            oi.setUnitPriceCents(pet.getPriceCents());
            oi.setQuantity(ci.getQuantity());
            order.getItems().add(oi);

            pet.setStatus("SOLD");
            petRepo.save(pet);
        }

        OrderEntity saved = orderRepo.save(order);
        // clear cart
        cartRepo.deleteByUserId(userId);

        return ResponseEntity.ok(saved);
    }
}
