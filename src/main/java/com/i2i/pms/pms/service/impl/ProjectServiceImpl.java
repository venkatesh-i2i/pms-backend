package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.DuplicateResourceException;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.ProjectRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    @Override
    public Optional<Project> getProjectByKey(String projectKey) {
        return projectRepository.findByProjectKey(projectKey);
    }

    @Override
    public Project createProject(Project project) {
        // Check if project key already exists
        if (projectRepository.existsByProjectKey(project.getProjectKey())) {
            throw new DuplicateResourceException("Project with key '" + project.getProjectKey() + "' already exists");
        }

        // Check if project name already exists
        if (projectRepository.existsByName(project.getName())) {
            throw new DuplicateResourceException("Project with name '" + project.getName() + "' already exists");
        }

        // Set project lead if provided
        if (project.getProjectLead() != null) {
            User projectLead = userRepository.findById(project.getProjectLead().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + project.getProjectLead().getId()));
            project.setProjectLead(projectLead);
            project.addMember(projectLead); // Project lead is automatically a member
        }

        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(Long id, Project project) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        // Check if project key is being changed and if it already exists
        if (!existingProject.getProjectKey().equals(project.getProjectKey()) && 
            projectRepository.existsByProjectKey(project.getProjectKey())) {
            throw new DuplicateResourceException("Project with key '" + project.getProjectKey() + "' already exists");
        }

        // Check if project name is being changed and if it already exists
        if (!existingProject.getName().equals(project.getName()) && 
            projectRepository.existsByName(project.getName())) {
            throw new DuplicateResourceException("Project with name '" + project.getName() + "' already exists");
        }

        existingProject.setProjectKey(project.getProjectKey());
        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setProjectType(project.getProjectType());
        existingProject.setProjectCategory(project.getProjectCategory());
        existingProject.setIsActive(project.getIsActive());

        // Update project lead if provided
        if (project.getProjectLead() != null) {
            User projectLead = userRepository.findById(project.getProjectLead().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + project.getProjectLead().getId()));
            existingProject.setProjectLead(projectLead);
            if (!existingProject.getMembers().contains(projectLead)) {
                existingProject.addMember(projectLead);
            }
        }

        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    @Override
    public List<Project> getProjectsByType(Project.ProjectType projectType) {
        return projectRepository.findByProjectType(projectType);
    }

    @Override
    public List<Project> getProjectsByCategory(Project.ProjectCategory projectCategory) {
        return projectRepository.findByProjectCategory(projectCategory);
    }

    @Override
    public List<Project> getProjectsByLead(Long leadUserId) {
        return projectRepository.findByProjectLeadId(leadUserId);
    }

    @Override
    public List<Project> getProjectsByMember(Long memberUserId) {
        return projectRepository.findByMemberId(memberUserId);
    }

    @Override
    public List<Project> searchProjects(String keyword) {
        return projectRepository.findByKeyword(keyword);
    }

    @Override
    public Project addMemberToProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        project.addMember(user);
        return projectRepository.save(project);
    }

    @Override
    public Project removeMemberFromProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Don't allow removing the project lead
        if (project.getProjectLead() != null && project.getProjectLead().getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot remove project lead from project");
        }

        project.removeMember(user);
        return projectRepository.save(project);
    }

    @Override
    public Project setProjectLead(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        project.setProjectLead(user);
        
        // Ensure the project lead is a member
        if (!project.getMembers().contains(user)) {
            project.addMember(user);
        }

        return projectRepository.save(project);
    }

    @Override
    public boolean isProjectMember(Long projectId, Long userId) {
        return projectRepository.findByMemberId(userId).stream()
                .anyMatch(project -> project.getId().equals(projectId));
    }

    @Override
    public boolean isProjectLead(Long projectId, Long userId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.isPresent() && 
               project.get().getProjectLead() != null && 
               project.get().getProjectLead().getId().equals(userId);
    }

    @Override
    public Long getProjectIssueCount(Long projectId) {
        return issueRepository.countByProjectId(projectId);
    }
} 