package com.i2i.pms.pms.service;

import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.entity.User;

import java.util.List;
import java.util.Optional;

public interface ProjectService {

    List<Project> getAllProjects();
    
    Optional<Project> getProjectById(Long id);
    
    Optional<Project> getProjectByKey(String projectKey);
    
    Project createProject(Project project);
    
    Project updateProject(Long id, Project project);
    
    void deleteProject(Long id);
    
    List<Project> getProjectsByType(Project.ProjectType projectType);
    
    List<Project> getProjectsByCategory(Project.ProjectCategory projectCategory);
    
    List<Project> getProjectsByLead(Long leadUserId);
    
    List<Project> getProjectsByMember(Long memberUserId);
    
    List<Project> searchProjects(String keyword);
    
    Project addMemberToProject(Long projectId, Long userId);
    
    Project removeMemberFromProject(Long projectId, Long userId);
    
    Project setProjectLead(Long projectId, Long userId);
    
    boolean isProjectMember(Long projectId, Long userId);
    
    boolean isProjectLead(Long projectId, Long userId);
    
    Long getProjectIssueCount(Long projectId);
} 