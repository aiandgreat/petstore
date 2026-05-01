package com.petstore.controller;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/checkout")
public class StripeController {
    @Value("${stripe.secret:}")
    private String stripeSecret;

    @Value("${stripe.webhookSecret:}")
    private String webhookSecret;

    @PostConstruct
    public void init() { if (stripeSecret != null && !stripeSecret.isBlank()) Stripe.apiKey = stripeSecret; }

    @PostMapping("/payment")
    public ResponseEntity<?> createPayment(@RequestBody Map<String,Object> body) throws Exception {
        Integer amount = (Integer) body.getOrDefault("amount", 100);
        Map<String,Object> params = new HashMap<>();
        params.put("amount", amount);
        params.put("currency", "usd");
        params.put("payment_method_types", java.util.List.of("card"));
        PaymentIntent pi = PaymentIntent.create(params);
        return ResponseEntity.ok(Map.of("clientSecret", pi.getClientSecret()));
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestHeader("Stripe-Signature") String sig, @RequestBody String payload) {
        try {
            var event = Webhook.constructEvent(payload, sig, webhookSecret);
            // handle event types as needed
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook error");
        }
    }
}
