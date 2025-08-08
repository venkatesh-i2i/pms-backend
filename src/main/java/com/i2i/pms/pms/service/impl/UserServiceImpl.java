package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.entity.Role;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.DuplicateResourceException;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.repository.RoleRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User createUser(User user) {
        // Business logic validation
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateResourceException("User", "username", user.getUsername());
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateResourceException("User", "email", user.getEmail());
        }
        
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", id);
        }

        User user = userOptional.get();
        
        // Check if new username conflicts with existing users (excluding current user)
        if (!user.getUsername().equals(userDetails.getUsername()) && 
            userRepository.existsByUsername(userDetails.getUsername())) {
            throw new DuplicateResourceException("User", "username", userDetails.getUsername());
        }
        
        // Check if new email conflicts with existing users (excluding current user)
        if (!user.getEmail().equals(userDetails.getEmail()) && 
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new DuplicateResourceException("User", "email", userDetails.getEmail());
        }

        // Update user details
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setUsername(userDetails.getUsername());
        user.setPassword(userDetails.getPassword());
        user.setIsActive(userDetails.getIsActive());

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<User> getUsersByRole(String roleName) {
        return userRepository.findByRoleName(roleName);
    }

    @Override
    public List<User> getUsersByNameContaining(String name) {
        return userRepository.findByNameContaining(name);
    }

    @Override
    public List<User> getActiveUsers() {
        return userRepository.findByIsActive(true);
    }

    @Override
    public User assignRoleToUser(Long userId, Long roleId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Role> roleOptional = roleRepository.findById(roleId);

        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        if (roleOptional.isEmpty()) {
            throw new ResourceNotFoundException("Role", "id", roleId);
        }

        User user = userOptional.get();
        Role role = roleOptional.get();
        
        // Check if role is already assigned
        if (user.getRoles().contains(role)) {
            throw new RuntimeException("Role " + role.getName() + " is already assigned to user " + user.getUsername());
        }
        
        user.addRole(role);
        return userRepository.save(user);
    }

    @Override
    public User removeRoleFromUser(Long userId, Long roleId) {
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Role> roleOptional = roleRepository.findById(roleId);

        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        if (roleOptional.isEmpty()) {
            throw new ResourceNotFoundException("Role", "id", roleId);
        }

        User user = userOptional.get();
        Role role = roleOptional.get();
        
        // Check if role is assigned to user
        if (!user.getRoles().contains(role)) {
            throw new RuntimeException("Role " + role.getName() + " is not assigned to user " + user.getUsername());
        }
        
        user.removeRole(role);
        return userRepository.save(user);
    }
} 