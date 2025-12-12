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
@Table(name = "missions")
public class Mission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "repo_name")
    private String repoName;

    @Column(name = "issue_type")
    private String issueType; // SECURITY, PERFORMANCE, LOGIC

    @Column(name = "status")
    private String status; // PENDING, IN_PROGRESS, COMPLETED, VERIFIED

    @Column(name = "difficulty")
    private String difficulty; // EASY, MEDIUM, HARD

    @Column(name = "xp_reward")
    private Integer xpReward;

    @Column(name = "pr_url")
    private String prUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }
}
