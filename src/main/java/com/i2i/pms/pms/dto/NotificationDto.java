package com.i2i.pms.pms.dto;

import com.i2i.pms.pms.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    private Long id;
    private Long userId;
    private String title;
    private String message;
    private String type; // TASK_ASSIGNED, TASK_UPDATED, etc.
    private Boolean isRead;
    private LocalDateTime createdAt;
    private Long relatedTaskId;
    private Long relatedProjectId;
}
