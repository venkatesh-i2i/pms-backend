package com.i2i.pms.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneDto {

    private Long id;
    private String name;
    private LocalDate date;
    private String description;
    private Boolean completed;
}
