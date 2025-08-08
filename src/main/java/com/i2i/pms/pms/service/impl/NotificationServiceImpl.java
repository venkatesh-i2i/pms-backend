package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Notification;
import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.NotificationRepository;
import com.i2i.pms.pms.repository.ProjectRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadNotificationsByUser(Long userId) {
        return notificationRepository.findUnreadByUserId(userId);
    }

    @Override
    public Optional<Notification> getNotificationById(Long notificationId, Long userId) {
        // Only return if the notification belongs to the user
        return notificationRepository.findById(notificationId)
                .filter(notification -> notification.getUser().getId().equals(userId));
    }

    @Override
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public Notification markAsRead(Long notificationId, Long userId) {
        Notification notification = getNotificationById(notificationId, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found or access denied"));
        
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    @Override
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = getNotificationById(notificationId, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found or access denied"));
        
        notificationRepository.delete(notification);
    }

    @Override
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Override
    public void createTaskAssignedNotification(Long taskId, Long assigneeId) {
        Issue task = issueRepository.findById(taskId).orElse(null);
        User assignee = userRepository.findById(assigneeId).orElse(null);
        
        if (task != null && assignee != null) {
            Notification notification = new Notification();
            notification.setTitle("Task Assigned");
            notification.setMessage("You have been assigned to task: " + task.getIssueKey());
            notification.setType(Notification.NotificationType.TASK_ASSIGNED);
            notification.setUser(assignee);
            notification.setRelatedTask(task);
            notification.setRelatedProject(task.getProject());
            
            createNotification(notification);
        }
    }

    @Override
    public void createTaskUpdatedNotification(Long taskId) {
        Issue task = issueRepository.findById(taskId).orElse(null);
        
        if (task != null && task.getAssignee() != null) {
            Notification notification = new Notification();
            notification.setTitle("Task Updated");
            notification.setMessage("Task has been updated: " + task.getIssueKey());
            notification.setType(Notification.NotificationType.TASK_UPDATED);
            notification.setUser(task.getAssignee());
            notification.setRelatedTask(task);
            notification.setRelatedProject(task.getProject());
            
            createNotification(notification);
        }
    }

    @Override
    public void createCommentAddedNotification(Long taskId, Long userId) {
        Issue task = issueRepository.findById(taskId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        
        if (task != null && user != null && task.getAssignee() != null && 
            !task.getAssignee().getId().equals(userId)) {
            
            Notification notification = new Notification();
            notification.setTitle("New Comment");
            notification.setMessage("New comment added to task: " + task.getIssueKey());
            notification.setType(Notification.NotificationType.COMMENT_ADDED);
            notification.setUser(task.getAssignee());
            notification.setRelatedTask(task);
            notification.setRelatedProject(task.getProject());
            
            createNotification(notification);
        }
    }

    @Override
    public void createProjectAssignedNotification(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        
        if (project != null && user != null) {
            Notification notification = new Notification();
            notification.setTitle("Project Assignment");
            notification.setMessage("You have been added to project: " + project.getName());
            notification.setType(Notification.NotificationType.PROJECT_ASSIGNED);
            notification.setUser(user);
            notification.setRelatedProject(project);
            
            createNotification(notification);
        }
    }
}
