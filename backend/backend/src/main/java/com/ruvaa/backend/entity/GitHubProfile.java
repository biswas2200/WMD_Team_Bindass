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
@Table(name = "github_profiles")
public class GitHubProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "github_username")
    private String githubUsername;

    @Column(name = "access_token")
    private String accessToken; // Encrypted ideally, but plain for now/demo

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    @PrePersist
    public void onCreate() {
        lastSyncedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        lastSyncedAt = LocalDateTime.now();
    }
}
