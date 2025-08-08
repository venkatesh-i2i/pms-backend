package com.i2i.pms.pms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateIssueStatusRequest {
    @NotBlank(message = "Status is required")
    private String status;
}
