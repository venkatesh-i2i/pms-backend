package com.i2i.pms.pms.service;

import com.i2i.pms.pms.entity.FileAttachment;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.entity.User;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface FileAttachmentService {

    List<FileAttachment> getFilesByProject(Long projectId);

    List<FileAttachment> getFilesByIssue(Long issueId);

    List<FileAttachment> getFilesByUser(Long userId);

    Optional<FileAttachment> getFileById(Long id);

    FileAttachment uploadFile(MultipartFile file, Project project, Issue issue, User uploadedBy);

    Resource loadFileAsResource(String filename);

    void deleteFile(Long id);

    boolean isUploadedBy(Long fileId, String userEmail);

    Long getFileCountByProject(Long projectId);

    Long getFileCountByIssue(Long issueId);
}
