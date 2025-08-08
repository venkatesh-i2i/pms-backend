package com.i2i.pms.pms.mapper;

import com.i2i.pms.pms.dto.CreateIssueRequest;
import com.i2i.pms.pms.dto.IssueDto;
import com.i2i.pms.pms.dto.UpdateIssueRequest;
import com.i2i.pms.pms.entity.Issue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class IssueMapper {

    @Autowired
    private UserMapper userMapper;

    public IssueDto toDto(Issue issue) {
        if (issue == null) {
            return null;
        }

        IssueDto dto = new IssueDto();
        dto.setId(issue.getId());
        dto.setTaskKey(issue.getIssueKey());
        dto.setTitle(issue.getSummary());
        dto.setDescription(issue.getDescription());
        dto.setIssueType(issue.getIssueType());
        dto.setPriority(issue.getPriority());
        dto.setStatus(issue.getStatus());
        dto.setResolution(issue.getResolution());
        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());
        
        // Convert LocalDateTime to LocalDate for dueDate
        if (issue.getDueDate() != null) {
            dto.setDueDate(issue.getDueDate().toLocalDate());
        }
        
        // Convert minutes to hours
        if (issue.getEstimatedTime() != null) {
            dto.setEstimatedHours(Math.round(issue.getEstimatedTime() / 60.0f));
        }
        if (issue.getActualTime() != null) {
            dto.setActualHours(Math.round(issue.getActualTime() / 60.0f));
        }
        
        if (issue.getProject() != null) {
            dto.setProjectId(issue.getProject().getId());
        }

        if (issue.getAssignee() != null) {
            dto.setAssignee(userMapper.toDto(issue.getAssignee()));
        }

        if (issue.getReporter() != null) {
            dto.setReporter(userMapper.toDto(issue.getReporter()));
        }

        if (issue.getTags() != null) {
            dto.setTags(issue.getTags());
        }
        
        return dto;
    }

    public List<IssueDto> toDtoList(List<Issue> issues) {
        if (issues == null) {
            return null;
        }
        return issues.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Issue toEntity(CreateIssueRequest request) {
        if (request == null) {
            return null;
        }

        Issue issue = new Issue();
        issue.setSummary(request.getSummary());
        issue.setDescription(request.getDescription());
        issue.setIssueType(request.getIssueType());
        issue.setPriority(request.getPriority());
        issue.setDueDate(request.getDueDate());
        issue.setEstimatedTime(request.getEstimatedTime());
        
        return issue;
    }

    public void updateIssueFromRequest(Issue issue, CreateIssueRequest request) {
        if (issue == null || request == null) {
            return;
        }

        if (request.getSummary() != null) {
            issue.setSummary(request.getSummary());
        }
        if (request.getDescription() != null) {
            issue.setDescription(request.getDescription());
        }
        if (request.getIssueType() != null) {
            issue.setIssueType(request.getIssueType());
        }
        if (request.getPriority() != null) {
            issue.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            issue.setDueDate(request.getDueDate());
        }
        if (request.getEstimatedTime() != null) {
            issue.setEstimatedTime(request.getEstimatedTime());
        }
    }

    public void updateIssueFromUpdateRequest(Issue issue, UpdateIssueRequest request) {
        if (issue == null || request == null) {
            return;
        }

        if (request.getSummary() != null) {
            issue.setSummary(request.getSummary());
        }
        if (request.getDescription() != null) {
            issue.setDescription(request.getDescription());
        }
        if (request.getIssueType() != null) {
            issue.setIssueType(request.getIssueType());
        }
        if (request.getPriority() != null) {
            issue.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            issue.setStatus(request.getStatus());
        }
        if (request.getResolution() != null) {
            issue.setResolution(request.getResolution());
        }
        if (request.getDueDate() != null) {
            issue.setDueDate(request.getDueDate());
        }
        if (request.getEstimatedTime() != null) {
            issue.setEstimatedTime(request.getEstimatedTime());
        }
        if (request.getActualTime() != null) {
            issue.setActualTime(request.getActualTime());
        }
    }
}