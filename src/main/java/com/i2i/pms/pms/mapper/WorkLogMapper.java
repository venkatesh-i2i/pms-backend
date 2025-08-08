package com.i2i.pms.pms.mapper;

import com.i2i.pms.pms.dto.WorkLogDto;
import com.i2i.pms.pms.entity.WorkLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class WorkLogMapper {

    @Autowired
    private UserMapper userMapper;

    public WorkLogDto toDto(WorkLog workLog) {
        if (workLog == null) {
            return null;
        }

        WorkLogDto dto = new WorkLogDto();
        dto.setId(workLog.getId());
        dto.setDescription(workLog.getComment());
        dto.setCreatedAt(workLog.getCreatedAt());

        // Convert minutes to hours
        if (workLog.getTimeSpent() != null) {
            dto.setHoursWorked(Math.round(workLog.getTimeSpent() / 60.0f));
        }

        // Convert datetime to date
        if (workLog.getDate() != null) {
            dto.setWorkDate(workLog.getDate().toLocalDate());
        }

        if (workLog.getIssue() != null) {
            dto.setTaskId(workLog.getIssue().getId());
        }

        if (workLog.getAuthor() != null) {
            dto.setAuthor(userMapper.toDto(workLog.getAuthor()));
        }

        return dto;
    }

    public List<WorkLogDto> toDtoList(List<WorkLog> workLogs) {
        if (workLogs == null) {
            return null;
        }
        return workLogs.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}