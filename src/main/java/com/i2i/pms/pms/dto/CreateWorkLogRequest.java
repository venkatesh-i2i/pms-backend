package com.i2i.pms.pms.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateWorkLogRequest {

    @NotNull(message = "Task ID is required")
    private Long taskId;

    @NotNull(message = "Hours worked is required")
    @Positive(message = "Hours worked must be positive")
    private Integer hoursWorked;

    private String description;

    private LocalDate workDate;
}