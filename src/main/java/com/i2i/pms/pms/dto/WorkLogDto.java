package com.i2i.pms.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkLogDto {

    private Long id;
    private Long taskId;
    private UserDto author;
    private Integer hoursWorked; // converted from minutes to hours
    private String description;
    private LocalDate workDate;
    private LocalDateTime createdAt;
}