package com.ruvaa.backend.service;

import com.ruvaa.backend.dto.ProfileRequest;
import com.ruvaa.backend.dto.ProfileResponse;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    public ProfileResponse updateProfile(String email, ProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getName() != null) user.setName(request.getName());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        // Map other fields as necessary, ignoring legacy fields if needed
        
        userRepository.save(user);
        return mapToResponse(user);
    }

    private ProfileResponse mapToResponse(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setName(user.getName());
        response.setLocation(user.getLocation());
        // Map other fields
        return response;
    }
}