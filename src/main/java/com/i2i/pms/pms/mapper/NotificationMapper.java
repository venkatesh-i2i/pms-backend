package com.i2i.pms.pms.mapper;

import com.i2i.pms.pms.dto.NotificationDto;
import com.i2i.pms.pms.entity.Notification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification notification) {
        if (notification == null) {
            return null;
        }

        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getId());
        }

        if (notification.getType() != null) {
            dto.setType(notification.getType().name());
        }

        if (notification.getRelatedTask() != null) {
            dto.setRelatedTaskId(notification.getRelatedTask().getId());
        }

        if (notification.getRelatedProject() != null) {
            dto.setRelatedProjectId(notification.getRelatedProject().getId());
        }

        return dto;
    }

    public List<NotificationDto> toDtoList(List<Notification> notifications) {
        if (notifications == null) {
            return null;
        }
        return notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
