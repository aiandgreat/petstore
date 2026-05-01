package com.petstore.controller;

import com.petstore.model.UserAccount;
import com.petstore.repository.UserRepository;
import com.petstore.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) return ResponseEntity.status(409).body(Map.of("error","EMAIL_TAKEN"));
        UserAccount u = new UserAccount();
        u.setEmail(req.getEmail());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        u.setRole("CUSTOMER");
        userRepo.save(u);
        String token = jwtUtil.generateToken(u.getEmail(), 1000L * 60 * 60);
        return ResponseEntity.status(201).body(Map.of("token", token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        var user = userRepo.findByEmail(req.getEmail()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("error","INVALID_CREDENTIALS"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) return ResponseEntity.status(401).body(Map.of("error","INVALID_CREDENTIALS"));
        String token = jwtUtil.generateToken(user.getEmail(), 1000L * 60 * 60);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String,String> body) {
        String token = body.get("token");
        try {
            var claims = jwtUtil.parseToken(token).getBody();
            String sub = claims.getSubject();
            String newToken = jwtUtil.generateToken(sub, 1000L * 60 * 60);
            return ResponseEntity.ok(Map.of("token", newToken));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error","INVALID_TOKEN"));
        }
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
