package com.i2i.pms.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {

    private Long id;
    private String filename;
    private String originalFilename;
    private Long fileSize;
    private String fileType;
    private Long projectId;
    private Long taskId;
    private UserDto uploadedBy;
    private LocalDateTime uploadedAt;
    private String downloadUrl;
}
