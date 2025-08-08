package com.i2i.pms.pms.mapper;

import com.i2i.pms.pms.dto.RoleDto;
import com.i2i.pms.pms.entity.Role;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RoleMapper {

    public RoleDto toDto(Role role) {
        if (role == null) {
            return null;
        }

        RoleDto dto = new RoleDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setDescription(role.getDescription());
        return dto;
    }

    public Role toEntity(RoleDto dto) {
        if (dto == null) {
            return null;
        }

        Role role = new Role();
        role.setId(dto.getId());
        role.setName(dto.getName());
        role.setDescription(dto.getDescription());
        return role;
    }

    public List<RoleDto> toDtoList(List<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 