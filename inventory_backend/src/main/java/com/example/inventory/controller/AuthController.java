package com.example.inventory.controller;

import com.example.inventory.model.User;
import com.example.inventory.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public AuthController(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String password = (String) body.get("password");
        String name = (String) body.getOrDefault("name", username);
        String role = (String) body.getOrDefault("role", "ROLE_USER");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "username_and_password_required"));
        }

        if (userRepo.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "username_taken"));
        }

        User u = new User();
        u.setUsername(username);
        u.setPasswordHash(encoder.encode(password));
        u.setRole(role);
        // optionally set other fields like name
        userRepo.save(u);

        return ResponseEntity.ok(Map.of("user", Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "role", u.getRole()
        )));
    }

    @GetMapping("/login")
    @ResponseBody
    public ResponseEntity<?> loginGet(@RequestParam String username, @RequestParam String password) {
        return login(Map.of("username", username, "password", password));
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> login(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String password = (String) body.get("password");
        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid_credentials"));
        }
        Optional<User> opt = userRepo.findByUsername(username);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid_credentials"));
        User u = opt.get();
        if (!encoder.matches(password, u.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid_credentials"));
        }

        // For simplicity return user object; in production return JWT or set HTTP-only cookie
        return ResponseEntity.ok(Map.of("user", Map.of(
                "id", u.getId(),
                "username", u.getUsername(),
                "role", u.getRole()
        )));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // If you implement server sessions, invalidate them here. For stateless JWT, instruct client to delete token.
        return ResponseEntity.ok(Map.of("success", true));
    }
}
