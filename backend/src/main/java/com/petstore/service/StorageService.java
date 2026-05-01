package com.petstore.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    String store(MultipartFile file, String key) throws IOException;
}
