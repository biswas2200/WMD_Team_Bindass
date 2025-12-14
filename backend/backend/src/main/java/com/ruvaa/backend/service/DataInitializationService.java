package com.ruvaa.backend.service;

import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MissionGeneratorService missionGeneratorService;

    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            User demoUser = new User();
            demoUser.setUsername("demo");
            demoUser.setPassword(passwordEncoder.encode("demo123"));
            demoUser.setName("Demo User");
            demoUser.setEmail("demo@ruvaa.com");
            demoUser.setLocation("Srinagar, J&K");
            User savedUser = userRepository.save(demoUser);
            
            missionGeneratorService.generateMissionsForUser(savedUser, java.util.Collections.emptyList());
        }
    }
}