package com.i2i.pms.pms.service.impl;

import com.i2i.pms.pms.entity.FileAttachment;
import com.i2i.pms.pms.entity.Issue;
import com.i2i.pms.pms.entity.Project;
import com.i2i.pms.pms.entity.User;
import com.i2i.pms.pms.repository.FileAttachmentRepository;
import com.i2i.pms.pms.repository.UserRepository;
import com.i2i.pms.pms.service.FileAttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class FileAttachmentServiceImpl implements FileAttachmentService {

    @Autowired
    private FileAttachmentRepository fileAttachmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public List<FileAttachment> getFilesByProject(Long projectId) {
        return fileAttachmentRepository.findByProjectId(projectId);
    }

    @Override
    public List<FileAttachment> getFilesByIssue(Long issueId) {
        return fileAttachmentRepository.findByTaskId(issueId);
    }

    @Override
    public List<FileAttachment> getFilesByUser(Long userId) {
        return fileAttachmentRepository.findByUploadedById(userId);
    }

    @Override
    public Optional<FileAttachment> getFileById(Long id) {
        return fileAttachmentRepository.findById(id);
    }

    @Override
    public FileAttachment uploadFile(MultipartFile file, Project project, Issue issue, User uploadedBy) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            if (originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Save file to disk
            Path targetLocation = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Create FileAttachment entity
            FileAttachment fileAttachment = new FileAttachment();
            fileAttachment.setFilename(uniqueFilename);
            fileAttachment.setOriginalFilename(originalFilename);
            fileAttachment.setFileSize(file.getSize());
            fileAttachment.setFileType(file.getContentType());
            fileAttachment.setFilePath(targetLocation.toString());
            fileAttachment.setProject(project);
            fileAttachment.setTask(issue);
            fileAttachment.setUploadedBy(uploadedBy);

            return fileAttachmentRepository.save(fileAttachment);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename() + ". Please try again!", ex);
        }
    }

    @Override
    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + filename, ex);
        }
    }

    @Override
    public void deleteFile(Long id) {
        FileAttachment fileAttachment = fileAttachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id " + id));

        try {
            // Delete file from disk
            Path filePath = Paths.get(fileAttachment.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException ex) {
            // Log error but don't fail the operation
            System.err.println("Could not delete file from disk: " + ex.getMessage());
        }

        // Delete from database
        fileAttachmentRepository.delete(fileAttachment);
    }

    @Override
    public boolean isUploadedBy(Long fileId, String userEmail) {
        Optional<FileAttachment> fileAttachment = fileAttachmentRepository.findById(fileId);
        if (fileAttachment.isPresent()) {
            User uploadedBy = fileAttachment.get().getUploadedBy();
            return uploadedBy != null && uploadedBy.getEmail().equals(userEmail);
        }
        return false;
    }

    @Override
    public Long getFileCountByProject(Long projectId) {
        return fileAttachmentRepository.countByProjectId(projectId);
    }

    @Override
    public Long getFileCountByIssue(Long issueId) {
        return fileAttachmentRepository.countByTaskId(issueId);
    }
}
