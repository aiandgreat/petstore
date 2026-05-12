package com.petstore.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.model.CartItem;
import com.petstore.model.OrderEntity;
import com.petstore.model.OrderItem;
import com.petstore.model.Pet;
import com.petstore.repository.CartItemRepository;
import com.petstore.repository.OrderRepository;
import com.petstore.repository.PetRepository;

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
    public ResponseEntity<?> createOrder(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        String userId = (userIdHeader == null || userIdHeader.isBlank()) ? "guest" : userIdHeader;
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
