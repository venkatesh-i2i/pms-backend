package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.CreateUserRequest;
import com.i2i.pms.pms.dto.IssueDto;
import com.i2i.pms.pms.dto.RoleDto;
import com.i2i.pms.pms.dto.UpdateUserRequest;
import com.i2i.pms.pms.dto.UserDto;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Role;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.mapper.IssueMapper;
import com.i2i.pms.pms.mapper.RoleMapper;
import com.i2i.pms.pms.mapper.UserMapper;
import com.i2i.pms.pms.service.AuthService;
import com.i2i.pms.pms.service.IssueService;
import com.i2i.pms.pms.service.RoleService;
import com.i2i.pms.pms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private AuthService authService;

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private IssueMapper issueMapper;

    @Autowired
    private RoleMapper roleMapper;

    // Get all users
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDto> userDtos = userMapper.toDtoList(users);
        return ResponseEntity.ok(userDtos);
    }

    // Get current user
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestHeader("Authorization") String authorization) {
        try {
            // Extract token from Authorization header
            String token = authorization;
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Validate token
            if (!authService.validateToken(token)) {
                return ResponseEntity.status(401).build();
            }

            // Get user ID from token
            Long userId = authService.getUserIdFromToken(token);
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }

            // Find user by ID
            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId.toString()));

            // Check if user is active
            if (!user.getIsActive()) {
                return ResponseEntity.status(403).build();
            }

            // Convert to DTO and return
            UserDto userDto = userMapper.toDto(user);
            return ResponseEntity.ok(userDto);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    // Get user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new user
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest createUserRequest) {
        User user = userMapper.toEntity(createUserRequest);
        User savedUser = userService.createUser(user);
        UserDto userDto = userMapper.toDto(savedUser);
        return ResponseEntity.ok(userDto);
    }

    // Update user
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        User user = userService.getUserById(id).orElseThrow(() -> new RuntimeException("User not found"));
        userMapper.updateUserFromRequest(user, updateUserRequest);
        User updatedUser = userService.updateUser(id, user);
        UserDto userDto = userMapper.toDto(updatedUser);
        return ResponseEntity.ok(userDto);
    }

    // Delete user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    // Get all roles
    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        List<RoleDto> roleDtos = roleMapper.toDtoList(roles);
        return ResponseEntity.ok(roleDtos);
    }

    // Assign role to user
    @PostMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserDto> assignRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User savedUser = userService.assignRoleToUser(userId, roleId);
        UserDto userDto = userMapper.toDto(savedUser);
        return ResponseEntity.ok(userDto);
    }

    // Remove role from user
    @DeleteMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<UserDto> removeRoleFromUser(@PathVariable Long userId, @PathVariable Long roleId) {
        User savedUser = userService.removeRoleFromUser(userId, roleId);
        UserDto userDto = userMapper.toDto(savedUser);
        return ResponseEntity.ok(userDto);
    }

    // Get users by role name
    @GetMapping("/by-role/{roleName}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable String roleName) {
        List<User> users = userService.getUsersByRole(roleName);
        List<UserDto> userDtos = userMapper.toDtoList(users);
        return ResponseEntity.ok(userDtos);
    }

    // Get issues by assignee (user ID) - matches API specification /api/users/{userId}/issues
    @GetMapping("/{userId}/issues")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<IssueDto>> getIssuesByAssignee(@PathVariable Long userId) {
        List<Issue> issues = issueService.getIssuesByAssignee(userId);
        List<IssueDto> issueDtos = issueMapper.toDtoList(issues);
        return ResponseEntity.ok(issueDtos);
    }
} 