package com.avisek.app.e_com_project.controller;

import com.avisek.app.e_com_project.model.User;
import com.avisek.app.e_com_project.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")

@RequiredArgsConstructor
public class AuthController {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String role     = body.getOrDefault("role", "USER"); 

        if (username == null || username.isBlank() || password == null || password.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));

        if (username.length() < 3 || username.length() > 20)
            return ResponseEntity.badRequest().body(Map.of("error", "Username must be 3-20 characters"));

        if (password.length() < 4)
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 4 characters"));

        if (userRepo.existsByUsername(username))
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role("ROLE_" + role.toUpperCase())
                .build();

        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully", "username", username));
    }


    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null)
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        return ResponseEntity.ok(Map.of(
                "username", userDetails.getUsername(),
                "role", isAdmin ? "ADMIN" : "USER"
        ));
    }
}
