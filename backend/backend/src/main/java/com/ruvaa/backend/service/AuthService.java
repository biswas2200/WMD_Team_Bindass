package com.ruvaa.backend.service;

import com.ruvaa.backend.dto.LoginRequest;
import com.ruvaa.backend.dto.LoginResponse;
import com.ruvaa.backend.dto.UserDto;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.UserRepository;
import com.ruvaa.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user);
        UserDto userDto = convertToDto(user);

        return new LoginResponse(token, "Bearer", userDto);
    }

    public UserDto register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // ensure default timestamps
        if(user.getCreatedAt() == null) user.onCreate();
        
        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId() != null ? user.getId().toString() : null);
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAge(user.getAge());
        dto.setLocation(user.getLocation());
        dto.setEducation(user.getEducation());
        dto.setInterests(user.getInterests());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}