package com.i2i.pms.pms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(name = "title", nullable = false)
    private String title;

    @NotBlank(message = "Message is required")
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_task_id")
    private Issue relatedTask;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_project_id")
    private Project relatedProject;

    // Enum for notification types
    public enum NotificationType {
        TASK_ASSIGNED, TASK_UPDATED, TASK_COMPLETED, TASK_OVERDUE,
        PROJECT_ASSIGNED, PROJECT_UPDATED, PROJECT_DEADLINE,
        COMMENT_ADDED, WORKLOG_ADDED, MENTION, SYSTEM
    }

    // Constructors
    public Notification() {}

    public Notification(String title, String message, NotificationType type, User user) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Issue getRelatedTask() {
        return relatedTask;
    }

    public void setRelatedTask(Issue relatedTask) {
        this.relatedTask = relatedTask;
    }

    public Project getRelatedProject() {
        return relatedProject;
    }

    public void setRelatedProject(Project relatedProject) {
        this.relatedProject = relatedProject;
    }

    // JPA Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Notification that = (Notification) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", type=" + type +
                ", isRead=" + isRead +
                ", createdAt=" + createdAt +
                '}';
    }
}
