package com.i2i.pms.pms.repository;

import com.i2i.pms.pms.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, Boolean isRead);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    Long countUnreadByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId AND n.isRead = false")
    int markAllAsReadForUser(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.relatedTask.id = :taskId ORDER BY n.createdAt DESC")
    List<Notification> findByRelatedTaskId(@Param("taskId") Long taskId);

    @Query("SELECT n FROM Notification n WHERE n.relatedProject.id = :projectId ORDER BY n.createdAt DESC")
    List<Notification> findByRelatedProjectId(@Param("projectId") Long projectId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.type = :type ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndType(@Param("userId") Long userId, @Param("type") Notification.NotificationType type);
}
