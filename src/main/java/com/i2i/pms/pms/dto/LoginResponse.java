package com.i2i.pms.pms.dto;

import com.i2i.pms.pms.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class LoginResponse {

    private String token;
    private String email;
    private String name;
    private String username;
    private List<String> roles;
    private String message;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(String token, User user, String message) {
        this.token = token;
        this.email = user.getEmail();
        this.name = user.getName();
        this.username = user.getUsername();
        this.roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList());
        this.message = message;
    }

    public LoginResponse(String message) {
        this.message = message;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 