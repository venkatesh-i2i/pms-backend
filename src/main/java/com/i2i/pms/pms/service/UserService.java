package com.i2i.pms.pms.service;

import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.entity.Role;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getAllUsers();
    
    Optional<User> getUserById(Long id);
    
    Optional<User> getUserByUsername(String username);
    
    Optional<User> getUserByEmail(String email);
    
    User createUser(User user);
    
    User updateUser(Long id, User userDetails);
    
    void deleteUser(Long id);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> getUsersByRole(String roleName);
    
    List<User> getUsersByNameContaining(String name);
    
    List<User> getActiveUsers();
    
    User assignRoleToUser(Long userId, Long roleId);
    
    User removeRoleFromUser(Long userId, Long roleId);
} 