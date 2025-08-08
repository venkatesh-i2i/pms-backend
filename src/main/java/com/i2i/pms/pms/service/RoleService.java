package com.i2i.pms.pms.service;

import com.i2i.pms.pms.entity.Role;

import java.util.List;
import java.util.Optional;

public interface RoleService {

    List<Role> getAllRoles();
    
    Optional<Role> getRoleById(Long id);
    
    Optional<Role> getRoleByName(String name);
    
    Role createRole(Role role);
    
    Role updateRole(Long id, Role roleDetails);
    
    void deleteRole(Long id);
    
    boolean existsByName(String name);
} 