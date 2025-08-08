package com.i2i.pms.pms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Set<Role> roles = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_projects",
        joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "project_id", referencedColumnName = "id")
    )
    private Set<Project> projects = new HashSet<>();

    @OneToMany(mappedBy = "reporter", fetch = FetchType.LAZY)
    private Set<Issue> reportedIssues = new HashSet<>();

    @OneToMany(mappedBy = "assignee", fetch = FetchType.LAZY)
    private Set<Issue> assignedIssues = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_watched_issues",
        joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "issue_id", referencedColumnName = "id")
    )
    private Set<Issue> watchedIssues = new HashSet<>();

    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "changedBy", fetch = FetchType.LAZY)
    private Set<IssueHistory> issueHistory = new HashSet<>();

    // Constructors
    public User() {}

    public User(String name, String username, String email, String password) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Set<Project> getProjects() {
        return projects;
    }

    public void setProjects(Set<Project> projects) {
        this.projects = projects;
    }

    public Set<Issue> getReportedIssues() {
        return reportedIssues;
    }

    public void setReportedIssues(Set<Issue> reportedIssues) {
        this.reportedIssues = reportedIssues;
    }

    public Set<Issue> getAssignedIssues() {
        return assignedIssues;
    }

    public void setAssignedIssues(Set<Issue> assignedIssues) {
        this.assignedIssues = assignedIssues;
    }

    public Set<Issue> getWatchedIssues() {
        return watchedIssues;
    }

    public void setWatchedIssues(Set<Issue> watchedIssues) {
        this.watchedIssues = watchedIssues;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public Set<IssueHistory> getIssueHistory() {
        return issueHistory;
    }

    public void setIssueHistory(Set<IssueHistory> issueHistory) {
        this.issueHistory = issueHistory;
    }

    // Helper methods
    public void addRole(Role role) {
        this.roles.add(role);
        // role.getUsers().add(this); // Commented out since User entity doesn't have this relationship
    }

    public void removeRole(Role role) {
        this.roles.remove(role);
        // role.getUsers().remove(this); // Commented out since User entity doesn't have this relationship
    }

    // Generate avatar from user's name initials
    public String generateAvatar() {
        if (name == null || name.trim().isEmpty()) {
            return "UN"; // Default for Unknown
        }
        String[] nameParts = name.trim().split("\\s+");
        if (nameParts.length == 1) {
            return nameParts[0].substring(0, Math.min(2, nameParts[0].length())).toUpperCase();
        } else {
            return (nameParts[0].substring(0, 1) + nameParts[nameParts.length - 1].substring(0, 1)).toUpperCase();
        }
    }

    // Get primary role as string
    public String getPrimaryRoleName() {
        return roles.isEmpty() ? "USER" : roles.iterator().next().getName();
    }

    // JPA Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id != null && id.equals(user.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 