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

    @Column(name = "repo_name")
    private String repoName;

    @Column(name = "logic_score")
    private Integer logicScore;

    @Column(name = "security_score")
    private Integer securityScore;

    @Column(name = "performance_score")
    private Integer performanceScore;
    
    @Column(name = "best_practices_score")
    private Integer bestPracticesScore;

    @Column(columnDefinition = "TEXT")
    private String details_json; // Store full analysis blob

    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt;

    @PrePersist
    public void onCreate() {
        analyzedAt = LocalDateTime.now();
    }
}
