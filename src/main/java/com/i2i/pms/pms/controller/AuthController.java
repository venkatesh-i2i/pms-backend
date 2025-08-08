package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.LoginRequest;
import com.i2i.pms.pms.dto.LoginResponse;
import com.i2i.pms.pms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        
        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout() {
        // For stateless JWT, logout is handled client-side by removing the token
        // But we can return a success message
        return ResponseEntity.ok(new LogoutResponse("Logged out successfully"));
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }

    // Simple response class for logout
    public static class LogoutResponse {
        private String message;
        
        public LogoutResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
} 