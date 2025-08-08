package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.dto.LoginRequest;
import com.i2i.pms.pms.dto.LoginResponse;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.service.AuthService;
import com.i2i.pms.pms.service.UserService;
import com.i2i.pms.pms.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // Find user by email
            User user = userService.getUserByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", loginRequest.getEmail()));

            // Check if user is active
            if (!user.getIsActive()) {
                return new LoginResponse("User account is deactivated");
            }

            // Validate password (simple string comparison for now)
            // In production, you should use BCrypt or similar password hashing
            if (!user.getPassword().equals(loginRequest.getPassword())) {
                return new LoginResponse("Invalid email or password");
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getId());

            // Return successful login response
            return new LoginResponse(token, user, "Login successful");

        } catch (ResourceNotFoundException e) {
            return new LoginResponse("Invalid email or password");
        } catch (Exception e) {
            return new LoginResponse("Login failed: " + e.getMessage());
        }
    }

    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    @Override
    public String getEmailFromToken(String token) {
        return jwtUtil.getEmailFromToken(token);
    }

    @Override
    public Long getUserIdFromToken(String token) {
        return jwtUtil.getUserIdFromToken(token);
    }
} 