package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.NotificationDto;
import com.i2i.pms.pms.entity.Notification;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.mapper.NotificationMapper;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationMapper notificationMapper;

    @Autowired
    private UserRepository userRepository;

    // Get notifications for current user - matches API /api/notifications
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<NotificationDto>> getNotifications(Authentication authentication) {
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        List<Notification> notifications = notificationService.getNotificationsByUser(currentUser.getId());
        List<NotificationDto> notificationDtos = notificationMapper.toDtoList(notifications);
        return ResponseEntity.ok(notificationDtos);
    }

    // Get unread notifications for current user
    @GetMapping("/unread")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(Authentication authentication) {
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        List<Notification> notifications = notificationService.getUnreadNotificationsByUser(currentUser.getId());
        List<NotificationDto> notificationDtos = notificationMapper.toDtoList(notifications);
        return ResponseEntity.ok(notificationDtos);
    }

    // Mark notification as read - matches API /api/notifications/{notificationId}/read
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<NotificationDto> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {
        
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        Notification notification = notificationService.markAsRead(notificationId, currentUser.getId());
        NotificationDto notificationDto = notificationMapper.toDto(notification);
        return ResponseEntity.ok(notificationDto);
    }

    // Mark all notifications as read
    @PutMapping("/mark-all-read")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok().build();
    }

    // Get notification count
    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Long> getNotificationCount(Authentication authentication) {
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        Long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(count);
    }

    // Get notification by ID
    @GetMapping("/{notificationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<NotificationDto> getNotification(
            @PathVariable Long notificationId,
            Authentication authentication) {
        
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        Notification notification = notificationService.getNotificationById(notificationId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId.toString()));
        
        NotificationDto notificationDto = notificationMapper.toDto(notification);
        return ResponseEntity.ok(notificationDto);
    }

    // Delete notification
    @DeleteMapping("/{notificationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId,
            Authentication authentication) {
        
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        notificationService.deleteNotification(notificationId, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}
