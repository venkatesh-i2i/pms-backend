package com.i2i.pms.pms.repository;

import com.i2i.pms.pms.entity.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {

    List<FileAttachment> findByProjectId(Long projectId);

    List<FileAttachment> findByTaskId(Long taskId);

    List<FileAttachment> findByUploadedById(Long uploadedById);

    @Query("SELECT f FROM FileAttachment f WHERE f.project.id = :projectId AND f.task IS NULL")
    List<FileAttachment> findByProjectIdAndTaskIsNull(@Param("projectId") Long projectId);

    @Query("SELECT f FROM FileAttachment f WHERE f.task.id = :taskId")
    List<FileAttachment> findByTaskIdNotNull(@Param("taskId") Long taskId);

    @Query("SELECT f FROM FileAttachment f WHERE f.uploadedBy.id = :userId ORDER BY f.uploadedAt DESC")
    List<FileAttachment> findByUploadedByIdOrderByUploadedAtDesc(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) FROM FileAttachment f WHERE f.project.id = :projectId")
    Long countByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(f) FROM FileAttachment f WHERE f.task.id = :taskId")
    Long countByTaskId(@Param("taskId") Long taskId);
}
