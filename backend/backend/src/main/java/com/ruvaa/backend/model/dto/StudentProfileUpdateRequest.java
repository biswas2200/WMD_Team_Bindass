package com.ruvaa.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.util.List;

/**
 * Request DTO for student profile updates
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileUpdateRequest {
    
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String fullName;
    
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String phoneNumber;
    
    @Min(value = 13, message = "Age must be at least 13")
    @Max(value = 35, message = "Age must be at most 35")
    private Integer age;
    
    private String city;
    private String state;
    private String stream;
    private String institutionName;
}