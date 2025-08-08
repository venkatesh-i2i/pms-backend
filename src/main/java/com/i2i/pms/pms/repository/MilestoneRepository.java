package com.i2i.pms.pms.repository;

import com.i2i.pms.pms.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    List<Milestone> findByProjectIdOrderByDateAsc(Long projectId);

    List<Milestone> findByProjectIdAndCompletedOrderByDateAsc(Long projectId, Boolean completed);

    @Query("SELECT m FROM Milestone m WHERE m.project.id = :projectId AND m.date BETWEEN :startDate AND :endDate ORDER BY m.date ASC")
    List<Milestone> findByProjectIdAndDateBetween(@Param("projectId") Long projectId, 
                                                  @Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);

    @Query("SELECT m FROM Milestone m WHERE m.date < :date AND m.completed = false ORDER BY m.date ASC")
    List<Milestone> findOverdueMilestones(@Param("date") LocalDate date);

    @Query("SELECT m FROM Milestone m WHERE m.project.id = :projectId AND m.date = :date")
    List<Milestone> findByProjectIdAndDate(@Param("projectId") Long projectId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.project.id = :projectId")
    Long countByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.project.id = :projectId AND m.completed = true")
    Long countCompletedByProjectId(@Param("projectId") Long projectId);
}
