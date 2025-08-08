package com.i2i.pms.pms.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.i2i.pms.pms.dto.LoginRequest;
import com.i2i.pms.pms.dto.LoginResponse;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.service.AuthService;
import com.i2i.pms.pms.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class UserControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testGetCurrentUser_WithValidToken() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        // First, create a test user and get a valid token
        User testUser = new User("Test User", "testuser", "test@example.com", "password123");
        testUser = userService.createUser(testUser);

        // Login to get a token
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password123");
        LoginResponse loginResponse = authService.login(loginRequest);

        // Test the /me endpoint
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + loginResponse.getToken())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testUser.getId()))
                .andExpect(jsonPath("$.name").value("Test User"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.isActive").value(true));
    }

    @Test
    void testGetCurrentUser_WithInvalidToken() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        // Test with invalid token
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer invalid_token")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testGetCurrentUser_WithoutToken() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        // Test without token
        mockMvc.perform(get("/api/users/me")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
} 