package com.i2i.pms.pms.service;

import com.i2i.pms.pms.entity.Notification;

import java.util.List;
import java.util.Optional;

public interface NotificationService {

    List<Notification> getNotificationsByUser(Long userId);

    List<Notification> getUnreadNotificationsByUser(Long userId);

    Optional<Notification> getNotificationById(Long notificationId, Long userId);

    Notification createNotification(Notification notification);

    Notification markAsRead(Long notificationId, Long userId);

    void markAllAsRead(Long userId);

    void deleteNotification(Long notificationId, Long userId);

    Long getUnreadCount(Long userId);

    void createTaskAssignedNotification(Long taskId, Long assigneeId);

    void createTaskUpdatedNotification(Long taskId);

    void createCommentAddedNotification(Long taskId, Long userId);

    void createProjectAssignedNotification(Long projectId, Long userId);
}
