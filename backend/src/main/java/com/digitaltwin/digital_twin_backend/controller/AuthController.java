package com.digitaltwin.digital_twin_backend.controller;

import com.digitaltwin.digital_twin_backend.dto.LoginRequest;
import com.digitaltwin.digital_twin_backend.entity.User;
import com.digitaltwin.digital_twin_backend.security.JwtService;
import com.digitaltwin.digital_twin_backend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody User user) {

        User savedUser = userService.saveUser(user);

        UserResponse response = new UserResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        User user = userService.findByUsername(request.username())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.password(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            return ResponseEntity.status(401).build();
        }

        String token =
                jwtService.generateToken(user.getUsername());

        LoginResponse response = new LoginResponse(
                token,
                user.getUsername(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }

    public record UserResponse(
            Long id,
            String username,
            String email,
            String role
    ) {
    }

    public record LoginResponse(
            String token,
            String username,
            String role
    ) {
    }
}