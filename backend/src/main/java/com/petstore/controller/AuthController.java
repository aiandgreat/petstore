package com.petstore.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.model.UserAccount;
import com.petstore.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) return ResponseEntity.status(409).body(Map.of("error","EMAIL_TAKEN"));
        UserAccount u = new UserAccount();
        u.setEmail(req.getEmail());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRole("CUSTOMER");
        userRepo.save(u);
        return ResponseEntity.status(201).body(Map.of("email", u.getEmail(), "role", u.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        UserAccount user = userRepo.findByEmail(req.getEmail()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("error","INVALID_CREDENTIALS"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) return ResponseEntity.status(401).body(Map.of("error","INVALID_CREDENTIALS"));
        return ResponseEntity.ok(Map.of("email", user.getEmail(), "role", user.getRole()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh() {
        return ResponseEntity.status(410).body(Map.of("error", "JWT_DISABLED"));
    }

    public static class SignupRequest {
        @jakarta.validation.constraints.Email
        @jakarta.validation.constraints.NotBlank
        private String email;
        @jakarta.validation.constraints.NotBlank
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        @jakarta.validation.constraints.Email
        @jakarta.validation.constraints.NotBlank
        private String email;
        @jakarta.validation.constraints.NotBlank
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
