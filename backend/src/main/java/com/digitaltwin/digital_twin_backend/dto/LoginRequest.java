package com.digitaltwin.digital_twin_backend.dto;

public record LoginRequest(
        String username,
        String password
) {
}