package com.i2i.pms.pms.repository;

import com.i2i.pms.pms.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    Optional<Project> findByProjectKey(String projectKey);
    
    Optional<Project> findByName(String name);
    
    List<Project> findByProjectType(Project.ProjectType projectType);
    
    List<Project> findByProjectCategory(Project.ProjectCategory projectCategory);
    
    List<Project> findByIsActive(Boolean isActive);
    
    List<Project> findByProjectLeadId(Long projectLeadId);
    
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.id = :userId")
    List<Project> findByMemberId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Project p WHERE p.projectKey LIKE %:keyword% OR p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Project> findByKeyword(@Param("keyword") String keyword);
    
    boolean existsByProjectKey(String projectKey);
    
    boolean existsByName(String name);
    
    @Query("SELECT COUNT(p) FROM Project p")
    Long countAllProjects();
    
    // Dashboard queries
    @Query("SELECT COUNT(p) FROM Project p WHERE p.isActive = true")
    Long countActiveProjects();
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.isActive = false")
    Long countCompletedProjects();
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.projectLead.id = :leadUserId")
    Long countProjectsByLead(@Param("leadUserId") Long leadUserId);
    
    @Query("SELECT COUNT(p) FROM Project p JOIN p.members m WHERE m.id = :memberUserId")
    Long countProjectsByMember(@Param("memberUserId") Long memberUserId);
    
    @Query("SELECT p.projectType, COUNT(p) FROM Project p GROUP BY p.projectType")
    List<Object[]> countProjectsByType();
    
    @Query("SELECT p.projectCategory, COUNT(p) FROM Project p GROUP BY p.projectCategory")
    List<Object[]> countProjectsByCategory();
    
    @Query("SELECT p FROM Project p ORDER BY p.updatedAt DESC")
    List<Project> findRecentProjects();
    
    @Query("SELECT p FROM Project p WHERE p.projectLead.id = :leadUserId ORDER BY p.updatedAt DESC")
    List<Project> findRecentProjectsByLead(@Param("leadUserId") Long leadUserId);
    
    @Query("SELECT p FROM Project p JOIN p.members m WHERE m.id = :memberUserId ORDER BY p.updatedAt DESC")
    List<Project> findRecentProjectsByMember(@Param("memberUserId") Long memberUserId);
} 