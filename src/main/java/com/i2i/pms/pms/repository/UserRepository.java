package com.i2i.pms.pms.repository;

import com.i2i.pms.pms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsernameOrEmail(String username, String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByIsActive(Boolean isActive);
    
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r.name = :roleName")
    long countByRoles_Name(@Param("roleName") String roleName);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
} 