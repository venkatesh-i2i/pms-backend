package com.i2i.pms.pms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Role name is required")
    @Size(min = 2, max = 50, message = "Role name must be between 2 and 50 characters")
    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    @Column(name = "description")
    private String description;

    // @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    // private Set<User> users = new HashSet<>();

    // Constructors
    public Role() {}

    public Role(String name) {
        this.name = name;
    }

    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // public Set<User> getUsers() {
    //     return users;
    // }

    // public void setUsers(Set<User> users) {
    //     this.users = users;
    // }

    // Helper methods
    // public void addUser(User user) {
    //     this.users.add(user);
    //     user.getRoles().add(this);
    // }

    // public void removeUser(User user) {
    //     this.users.remove(user);
    //     user.getRoles().remove(this);
    // }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return id != null && id.equals(role.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
} 