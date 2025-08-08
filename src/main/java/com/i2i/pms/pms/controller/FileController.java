package com.i2i.pms.pms.controller;

import com.i2i.pms.pms.dto.FileDto;
import com.i2i.pms.pms.entity.FileAttachment;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.exception.ResourceNotFoundException;
import com.i2i.pms.pms.mapper.FileMapper;
import com.i2i.pms.pms.repository.IssueRepository;
import com.i2i.pms.pms.repository.ProjectRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.FileAttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class FileController {

    @Autowired
    private FileAttachmentService fileAttachmentService;

    @Autowired
    private FileMapper fileMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    // Get files by project - matches API /api/projects/{projectId}/files
    @GetMapping("/api/projects/{projectId}/files")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<FileDto>> getFilesByProject(@PathVariable Long projectId) {
        List<FileAttachment> files = fileAttachmentService.getFilesByProject(projectId);
        List<FileDto> fileDtos = fileMapper.toDtoList(files);
        return ResponseEntity.ok(fileDtos);
    }

    // Get files by issue - matches API /api/issues/{issueId}/files
    @GetMapping("/api/issues/{issueId}/files")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<List<FileDto>> getFilesByIssue(@PathVariable Long issueId) {
        List<FileAttachment> files = fileAttachmentService.getFilesByIssue(issueId);
        List<FileDto> fileDtos = fileMapper.toDtoList(files);
        return ResponseEntity.ok(fileDtos);
    }

    // Upload file to project - matches API /api/projects/{projectId}/files
    @PostMapping("/api/projects/{projectId}/files")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<FileDto> uploadFileToProject(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        // Get project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId.toString()));

        // Upload file
        FileAttachment savedFile = fileAttachmentService.uploadFile(file, project, null, currentUser);
        FileDto fileDto = fileMapper.toDto(savedFile);
        return ResponseEntity.ok(fileDto);
    }

    // Upload file to issue - matches API /api/issues/{issueId}/files
    @PostMapping("/api/issues/{issueId}/files")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<FileDto> uploadFileToIssue(
            @PathVariable Long issueId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        
        // Get current user
        String currentUserEmail = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", currentUserEmail));

        // Get issue
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue", "id", issueId.toString()));

        // Upload file
        FileAttachment savedFile = fileAttachmentService.uploadFile(file, issue.getProject(), issue, currentUser);
        FileDto fileDto = fileMapper.toDto(savedFile);
        return ResponseEntity.ok(fileDto);
    }

    // Download file - matches API /api/files/{fileId}/download
    @GetMapping("/api/files/{fileId}/download")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            FileAttachment fileAttachment = fileAttachmentService.getFileById(fileId)
                    .orElseThrow(() -> new ResourceNotFoundException("File", "id", fileId.toString()));

            Resource resource = fileAttachmentService.loadFileAsResource(fileAttachment.getFilename());

            String contentType = fileAttachment.getFileType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + fileAttachment.getOriginalFilename() + "\"")
                    .body(resource);
        } catch (Exception ex) {
            throw new RuntimeException("File not found: " + fileId, ex);
        }
    }

    // Get file details - matches API /api/files/{fileId}
    @GetMapping("/api/files/{fileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DEVELOPER', 'TESTER')")
    public ResponseEntity<FileDto> getFile(@PathVariable Long fileId) {
        FileAttachment file = fileAttachmentService.getFileById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", fileId.toString()));
        FileDto fileDto = fileMapper.toDto(file);
        return ResponseEntity.ok(fileDto);
    }

    // Delete file - matches API /api/files/{fileId}
    @DeleteMapping("/api/files/{fileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or @fileAttachmentService.isUploadedBy(#fileId, authentication.name)")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        fileAttachmentService.deleteFile(fileId);
        return ResponseEntity.ok().build();
    }
}
