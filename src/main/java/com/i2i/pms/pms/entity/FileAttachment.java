package com.i2i.pms.pms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_attachments")
public class FileAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Filename is required")
    @Column(name = "filename", nullable = false)
    private String filename;

    @NotBlank(message = "Original filename is required")
    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @NotNull(message = "File size is required")
    @Positive(message = "File size must be positive")
    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @NotBlank(message = "File type is required")
    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Issue task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    // Constructors
    public FileAttachment() {}

    public FileAttachment(String filename, String originalFilename, Long fileSize, String fileType, User uploadedBy) {
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.uploadedBy = uploadedBy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Issue getTask() {
        return task;
    }

    public void setTask(Issue task) {
        this.task = task;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    // JPA Lifecycle methods
    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FileAttachment that = (FileAttachment) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "FileAttachment{" +
                "id=" + id +
                ", filename='" + filename + '\'' +
                ", originalFilename='" + originalFilename + '\'' +
                ", fileSize=" + fileSize +
                ", fileType='" + fileType + '\'' +
                ", uploadedAt=" + uploadedAt +
                '}';
    }
}
