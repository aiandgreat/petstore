package com.petstore.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
public class LocalStorageService implements StorageService {
    private final Path storageDir = Path.of("uploads");

    public LocalStorageService() throws IOException {
        Files.createDirectories(storageDir);
    }

    @Override
    public String store(MultipartFile file, String key) throws IOException {
        String filename = key + "_" + file.getOriginalFilename();
        Path target = storageDir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        // return accessible path relative to server
        return "/uploads/" + filename;
    }
}
