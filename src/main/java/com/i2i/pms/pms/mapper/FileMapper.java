package com.i2i.pms.pms.mapper;

import com.i2i.pms.pms.dto.FileDto;
import com.i2i.pms.pms.entity.FileAttachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FileMapper {

    @Autowired
    private UserMapper userMapper;

    public FileDto toDto(FileAttachment fileAttachment) {
        if (fileAttachment == null) {
            return null;
        }

        FileDto dto = new FileDto();
        dto.setId(fileAttachment.getId());
        dto.setFilename(fileAttachment.getFilename());
        dto.setOriginalFilename(fileAttachment.getOriginalFilename());
        dto.setFileSize(fileAttachment.getFileSize());
        dto.setFileType(fileAttachment.getFileType());
        dto.setUploadedAt(fileAttachment.getUploadedAt());

        if (fileAttachment.getProject() != null) {
            dto.setProjectId(fileAttachment.getProject().getId());
        }

        if (fileAttachment.getTask() != null) {
            dto.setTaskId(fileAttachment.getTask().getId());
        }

        if (fileAttachment.getUploadedBy() != null) {
            dto.setUploadedBy(userMapper.toDto(fileAttachment.getUploadedBy()));
        }

        // Generate download URL
        dto.setDownloadUrl("/api/files/" + fileAttachment.getId() + "/download");

        return dto;
    }

    public List<FileDto> toDtoList(List<FileAttachment> fileAttachments) {
        if (fileAttachments == null) {
            return null;
        }
        return fileAttachments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
