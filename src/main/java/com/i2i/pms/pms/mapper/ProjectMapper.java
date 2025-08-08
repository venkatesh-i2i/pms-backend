package com.i2i.pms.pms.mapper;

import com.i2i.pms.pms.dto.CreateProjectRequest;
import com.i2i.pms.pms.dto.ProjectDto;
import com.i2i.pms.pms.entity.Project;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProjectMapper {

    public ProjectDto toDto(Project project) {
        if (project == null) {
            return null;
        }

        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setProjectKey(project.getProjectKey());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setProjectType(project.getProjectType());
        dto.setProjectCategory(project.getProjectCategory());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        dto.setIsActive(project.getIsActive());
        
        // Note: projectLead, members, issueCount are ignored as per original mapping
        return dto;
    }

    public Project toEntity(CreateProjectRequest request) {
        if (request == null) {
            return null;
        }

        Project project = new Project();
        project.setProjectKey(request.getProjectKey());
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setProjectType(request.getProjectType());
        project.setProjectCategory(request.getProjectCategory());
        project.setIsActive(true); // constant = "true"
        
        // Note: id, createdAt, updatedAt, projectLead, members, issues are ignored
        return project;
    }

    public void updateProjectFromRequest(Project project, CreateProjectRequest request) {
        if (project == null || request == null) {
            return;
        }

        if (request.getProjectKey() != null) {
            project.setProjectKey(request.getProjectKey());
        }
        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getProjectType() != null) {
            project.setProjectType(request.getProjectType());
        }
        if (request.getProjectCategory() != null) {
            project.setProjectCategory(request.getProjectCategory());
        }
        
        // Note: Other fields are ignored as per original mapping
    }

    public List<ProjectDto> toDtoList(List<Project> projects) {
        if (projects == null) {
            return null;
        }
        return projects.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
} 