package com.i2i.pms.pms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Project key is required")
    @Size(min = 2, max = 10, message = "Project key must be between 2 and 10 characters")
    @Column(name = "project_key", unique = true, nullable = false)
    private String projectKey;

    @NotBlank(message = "Project name is required")
    @Size(min = 2, max = 100, message = "Project name must be between 2 and 100 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    @Column(name = "description")
    private String description;

    @Column(name = "project_type")
    @Enumerated(EnumType.STRING)
    private ProjectType projectType = ProjectType.SOFTWARE;

    @Column(name = "project_category")
    @Enumerated(EnumType.STRING)
    private ProjectCategory projectCategory = ProjectCategory.BUSINESS;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "progress")
    private Integer progress = 0; // Progress percentage (0-100)

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.PLANNING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_user_id")
    private User projectLead;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "project_members",
        joinColumns = @JoinColumn(name = "project_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id")
    )
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Issue> issues = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Milestone> milestones = new HashSet<>();

    // Enums
    public enum ProjectType {
        SOFTWARE, BUSINESS, SERVICE_DESK, OPERATIONS
    }

    public enum ProjectCategory {
        BUSINESS, SOFTWARE_DEVELOPMENT, IT_SERVICE, MARKETING, SALES, HR, FINANCE
    }

    public enum ProjectStatus {
        PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
    }

    // Constructors
    public Project() {}

    public Project(String projectKey, String name, String description) {
        this.projectKey = projectKey;
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

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
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

    public ProjectType getProjectType() {
        return projectType;
    }

    public void setProjectType(ProjectType projectType) {
        this.projectType = projectType;
    }

    public ProjectCategory getProjectCategory() {
        return projectCategory;
    }

    public void setProjectCategory(ProjectCategory projectCategory) {
        this.projectCategory = projectCategory;
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

    public User getProjectLead() {
        return projectLead;
    }

    public void setProjectLead(User projectLead) {
        this.projectLead = projectLead;
    }

    public Set<User> getMembers() {
        return members;
    }

    public void setMembers(Set<User> members) {
        this.members = members;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public Set<Issue> getIssues() {
        return issues;
    }

    public void setIssues(Set<Issue> issues) {
        this.issues = issues;
    }

    public Set<Milestone> getMilestones() {
        return milestones;
    }

    public void setMilestones(Set<Milestone> milestones) {
        this.milestones = milestones;
    }

    // Helper methods
    public void addMember(User user) {
        this.members.add(user);
        user.getProjects().add(this);
    }

    public void removeMember(User user) {
        this.members.remove(user);
        user.getProjects().remove(this);
    }

    public void addIssue(Issue issue) {
        this.issues.add(issue);
        issue.setProject(this);
    }

    public void removeIssue(Issue issue) {
        this.issues.remove(issue);
        issue.setProject(null);
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
        Project project = (Project) o;
        return id != null && id.equals(project.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", projectKey='" + projectKey + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", projectType=" + projectType +
                ", projectCategory=" + projectCategory +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 