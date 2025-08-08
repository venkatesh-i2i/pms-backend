package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.RoleDto;
import com.i2i.pms.pms.entity.Role;
import com.i2i.pms.pms.mapper.RoleMapper;
import com.i2i.pms.pms.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private RoleMapper roleMapper;

    // Get all roles
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        List<RoleDto> roleDtos = roleMapper.toDtoList(roles);
        return ResponseEntity.ok(roleDtos);
    }

    // Get role by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RoleDto> getRoleById(@PathVariable Long id) {
        Optional<Role> role = roleService.getRoleById(id);
        return role.map(roleMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get role by name
    @GetMapping("/name/{name}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<RoleDto> getRoleByName(@PathVariable String name) {
        Optional<Role> role = roleService.getRoleByName(name);
        return role.map(roleMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new role
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleDto> createRole(@Valid @RequestBody RoleDto roleDto) {
        Role role = roleMapper.toEntity(roleDto);
        Role savedRole = roleService.createRole(role);
        RoleDto savedRoleDto = roleMapper.toDto(savedRole);
        return ResponseEntity.ok(savedRoleDto);
    }

    // Update role
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleDto> updateRole(@PathVariable Long id, @Valid @RequestBody RoleDto roleDto) {
        Role role = roleMapper.toEntity(roleDto);
        Role updatedRole = roleService.updateRole(id, role);
        RoleDto updatedRoleDto = roleMapper.toDto(updatedRole);
        return ResponseEntity.ok(updatedRoleDto);
    }

    // Delete role
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok().build();
    }
} 