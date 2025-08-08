package com.i2i.pms.pms.config;

import com.i2i.pms.pms.entity.Role;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.service.RoleService;
import com.i2i.pms.pms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserService userService;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.username:}")
    private String adminUsername;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        try {
            // Ensure required roles are present
            ensureRoles();

            // Require credentials via properties/environment to avoid hardcoding secrets
            if (isBlank(adminEmail) || isBlank(adminUsername) || isBlank(adminPassword)) {
                System.out.println("[AdminInitializer] Skipping admin seeding: app.admin.{email,username,password} not fully provided");
                return;
            }

            // Create admin user if missing
            if (!userService.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setName("System Administrator");
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(adminPassword);
                admin.setIsActive(true);

                User saved = userService.createUser(admin);

                Optional<Role> adminRole = roleService.getRoleByName("ADMIN");
                adminRole.ifPresent(role -> {
                    try {
                        userService.assignRoleToUser(saved.getId(), role.getId());
                    } catch (Exception e) {
                        System.out.println("[AdminInitializer] Warning: failed to assign ADMIN role: " + e.getMessage());
                    }
                });

                System.out.println("[AdminInitializer] Created admin user: " + adminEmail);
            } else {
                System.out.println("[AdminInitializer] Admin user already exists: " + adminEmail);
            }
        } catch (Exception e) {
            System.out.println("[AdminInitializer] Warning: " + e.getMessage());
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void ensureRoles() {
        ensureRole("ADMIN", "Administrator role");
        // Aligning terminology: MANAGER maps to Project Manager in UI
        ensureRole("MANAGER", "Project Manager role");
        ensureRole("DEVELOPER", "Developer role");
        ensureRole("TESTER", "Tester/QA role");
    }

    private void ensureRole(String name, String description) {
        try {
            if (!roleService.existsByName(name)) {
                Role role = new Role();
                role.setName(name);
                role.setDescription(description);
                roleService.createRole(role);
                System.out.println("[AdminInitializer] Created role: " + name);
            }
        } catch (Exception e) {
            System.out.println("[AdminInitializer] Warning: could not ensure role '" + name + "': " + e.getMessage());
        }
    }
}


