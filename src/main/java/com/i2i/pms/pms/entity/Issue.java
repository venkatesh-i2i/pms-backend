package com.i2i.pms.pms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Issue key is required")
    @Size(min = 2, max = 20, message = "Issue key must be between 2 and 20 characters")
    @Column(name = "issue_key", unique = true, nullable = false)
    private String issueKey;

    @NotBlank(message = "Summary is required")
    @Size(min = 2, max = 255, message = "Summary must be between 2 and 255 characters")
    @Column(name = "summary", nullable = false)
    private String summary;

    @Size(max = 10000, message = "Description cannot exceed 10000 characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "issue_type")
    @Enumerated(EnumType.STRING)
    private IssueType issueType = IssueType.TASK;

    @Column(name = "priority")
    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status = Status.TODO;

    @Column(name = "resolution")
    @Enumerated(EnumType.STRING)
    private Resolution resolution;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Getter
    @Column(name = "estimated_time")
    private Integer estimatedTime; // in minutes

    @Column(name = "actual_time")
    private Integer actualTime; // in minutes

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "issue_tags", joinColumns = @JoinColumn(name = "issue_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "issue_watchers",
        joinColumns = @JoinColumn(name = "issue_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id")
    )
    private Set<User> watchers = new HashSet<>();

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<IssueHistory> history = new HashSet<>();

    // Enums
    public enum IssueType {
        BUG, TASK, STORY, EPIC, SUBTASK, IMPROVEMENT, NEW_FEATURE
    }

    public enum Priority {
        LOWEST, LOW, MEDIUM, HIGH, HIGHEST, CRITICAL
    }

    public enum Status {
        TODO, IN_PROGRESS, IN_REVIEW, TESTING, DONE, BLOCKED, CANCELLED
    }

    public enum Resolution {
        FIXED, WONTFIX, DUPLICATE, INCOMPLETE, CANNOT_REPRODUCE, DONE
    }

    // Constructors
    public Issue() {}

    public Issue(String issueKey, String summary, String description) {
        this.issueKey = issueKey;
        this.summary = summary;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIssueKey() {
        return issueKey;
    }

    public void setIssueKey(String issueKey) {
        this.issueKey = issueKey;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IssueType getIssueType() {
        return issueType;
    }

    public void setIssueType(IssueType issueType) {
        this.issueType = issueType;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Resolution getResolution() {
        return resolution;
    }

    public void setResolution(Resolution resolution) {
        this.resolution = resolution;
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

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Integer getActualTime() {
        return actualTime;
    }

    public void setActualTime(Integer actualTime) {
        this.actualTime = actualTime;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public Set<User> getWatchers() {
        return watchers;
    }

    public void setWatchers(Set<User> watchers) {
        this.watchers = watchers;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public Set<IssueHistory> getHistory() {
        return history;
    }

    public void setHistory(Set<IssueHistory> history) {
        this.history = history;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    // Helper methods
    public void addWatcher(User user) {
        this.watchers.add(user);
        user.getWatchedIssues().add(this);
    }

    public void removeWatcher(User user) {
        this.watchers.remove(user);
        user.getWatchedIssues().remove(this);
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
        comment.setIssue(this);
    }

    public void removeComment(Comment comment) {
        this.comments.remove(comment);
        comment.setIssue(null);
    }

    public void addHistory(IssueHistory history) {
        this.history.add(history);
        history.setIssue(this);
    }

    public void removeHistory(IssueHistory history) {
        this.history.remove(history);
        history.setIssue(null);
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
        Issue issue = (Issue) o;
        return id != null && id.equals(issue.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Issue{" +
                "id=" + id +
                ", issueKey='" + issueKey + '\'' +
                ", summary='" + summary + '\'' +
                ", issueType=" + issueType +
                ", priority=" + priority +
                ", status=" + status +
                ", resolution=" + resolution +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
} 