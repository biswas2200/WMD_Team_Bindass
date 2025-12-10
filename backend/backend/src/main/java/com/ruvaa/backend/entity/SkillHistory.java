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
@Table(name = "skill_history")
public class SkillHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "skill_name")
    private String skillName; // SECURITY, PYTHON, JAVA, etc.

    @Column(name = "old_score")
    private Integer oldScore;

    @Column(name = "new_score")
    private Integer newScore;

    @Column(name = "change_reason")
    private String changeReason; // "Completed Mission X"

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @PrePersist
    public void onCreate() {
        recordedAt = LocalDateTime.now();
    }
}
