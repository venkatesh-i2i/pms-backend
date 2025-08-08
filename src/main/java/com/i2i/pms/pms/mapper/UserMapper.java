package com.i2i.pms.pms.mapper;

import com.i2i.pms.pms.dto.CreateUserRequest;
import com.i2i.pms.pms.dto.UpdateUserRequest;
import com.i2i.pms.pms.dto.UserDto;
import com.i2i.pms.pms.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setIsActive(user.getIsActive());
        // Include role (single role string) and avatar initials
        dto.setRole(user.getPrimaryRoleName());
        dto.setAvatar(user.generateAvatar());
        return dto;
    }

    public User toEntity(CreateUserRequest request) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setIsActive(true); // constant = "true"
        // Note: id, createdAt, updatedAt, roles are ignored
        // These will be set by the service layer
        return user;
    }

    public void updateUserFromRequest(User user, UpdateUserRequest request) {
        if (user == null || request == null) {
            return;
        }

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPassword() != null) {
            user.setPassword(request.getPassword());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }
        // Note: id, createdAt, updatedAt, roles are ignored
    }

    public List<UserDto> toDtoList(List<User> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> toDtoList(Set<User> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 