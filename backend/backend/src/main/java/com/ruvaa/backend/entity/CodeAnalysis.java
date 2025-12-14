package com.ruvaa.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "code_analysis")
public class CodeAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne 
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String repoName; // Added for MissionService compatibility

    private int logicScore;
    private int securityScore;
    private int performanceScore;
    private int bestPracticesScore; // Added for GeminiAIService

    @Column(columnDefinition = "TEXT")
    private String details_json; // Renamed from criticalIssuesJson to match GeminiAIService

    private LocalDateTime analyzedAt;

    @PrePersist
    public void onCreate() {
        analyzedAt = LocalDateTime.now();
    }
}
