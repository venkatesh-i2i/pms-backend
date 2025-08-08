package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.entity.Role;
import com.i2i.pms.pms.exception.DuplicateResourceException;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.repository.RoleRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Optional<Role> getRoleById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public Role createRole(Role role) {
        // Business logic validation
        if (roleRepository.existsByName(role.getName())) {
            throw new DuplicateResourceException("Role", "name", role.getName());
        }
        
        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(Long id, Role roleDetails) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        if (roleOptional.isEmpty()) {
            throw new ResourceNotFoundException("Role", "id", id);
        }

        Role role = roleOptional.get();
        
        // Check if new name conflicts with existing roles (excluding current role)
        if (!role.getName().equals(roleDetails.getName()) && 
            roleRepository.existsByName(roleDetails.getName())) {
            throw new DuplicateResourceException("Role", "name", roleDetails.getName());
        }

        // Update role details
        role.setName(roleDetails.getName());
        role.setDescription(roleDetails.getDescription());

        return roleRepository.save(role);
    }

    @Override
    public void deleteRole(Long id) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        if (roleOptional.isEmpty()) {
            throw new ResourceNotFoundException("Role", "id", id);
        }

        Role role = roleOptional.get();
        
        // Check if role is assigned to any users
        long userCount = userRepository.countByRoles_Name(role.getName());
        if (userCount > 0) {
            throw new RuntimeException("Cannot delete role '" + role.getName() + "' as it is assigned to " + 
                                    userCount + " user(s). Please remove all user assignments first.");
        }
        
        roleRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return roleRepository.existsByName(name);
    }
} 