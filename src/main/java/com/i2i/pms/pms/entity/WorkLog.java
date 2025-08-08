package com.i2i.pms.pms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "work_logs")
@Getter
@Setter
public class WorkLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Time spent is required")
    @Positive(message = "Time spent must be positive")
    @Column(name = "time_spent", nullable = false)
    private Integer timeSpent; // in minutes

    @Column(name = "time_spent_unit")
    @Enumerated(EnumType.STRING)
    private TimeUnit timeSpentUnit = TimeUnit.MINUTES;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    public enum TimeUnit {
        MINUTES, HOURS, DAYS, WEEKS
    }

    public WorkLog() {}

    public WorkLog(Integer timeSpent, String comment, Issue issue, User author) {
        this.timeSpent = timeSpent;
        this.comment = comment;
        this.issue = issue;
        this.author = author;
        this.date = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (date == null) {
            date = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WorkLog workLog = (WorkLog) o;
        return id != null && id.equals(workLog.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "WorkLog{" +
                "id=" + id +
                ", timeSpent=" + timeSpent +
                ", comment='" + comment + '\'' +
                ", date=" + date +
                '}';
    }
} 