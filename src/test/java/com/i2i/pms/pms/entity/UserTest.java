package com.i2i.pms.pms.entity;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserTest {

    @Test
    void testUserCreation() {
        User user = new User();
        user.setName("John Doe");
        user.setUsername("johndoe");
        user.setEmail("john.doe@example.com");
        user.setPassword("password123");

        assertEquals("John Doe", user.getName());
        assertEquals("johndoe", user.getUsername());
        assertEquals("john.doe@example.com", user.getEmail());
        assertEquals("password123", user.getPassword());
        assertTrue(user.getIsActive());
    }

    @Test
    void testUserWithRoles() {
        User user = new User("Jane Doe", "janedoe", "jane.doe@example.com", "password123");
        Role adminRole = new Role("ADMIN", "Administrator role");
        Role userRole = new Role("USER", "User role");

        user.addRole(adminRole);
        user.addRole(userRole);

        assertEquals(2, user.getRoles().size());
        assertTrue(user.getRoles().contains(adminRole));
        assertTrue(user.getRoles().contains(userRole));
    }

    @Test
    void testUserConstructor() {
        User user = new User("Test User", "testuser", "test@example.com", "password123");

        assertEquals("Test User", user.getName());
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("password123", user.getPassword());
    }
} 