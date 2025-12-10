package com.ruvaa.backend.service;

import com.ruvaa.backend.entity.CodeAnalysis;
import com.ruvaa.backend.entity.Mission;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MissionService {

    private final MissionRepository missionRepository;

    public List<Mission> getMissionsForUser(Long userId) {
        return missionRepository.findByUserId(userId);
    }

    public Mission createMissionFromAnalysis(User user, CodeAnalysis analysis) {
        Mission mission = new Mission();
        mission.setUser(user);
        mission.setRepoName(analysis.getRepoName());
        mission.setStatus("PENDING");
        
        // Simple logic: Create mission based on lowest score
        if (analysis.getSecurityScore() < 50) {
            mission.setTitle("Secure Your Secrets");
            mission.setDescription("We detected potential secrets in your code. Use environment variables instead of hardcoded strings.");
            mission.setIssueType("SECURITY");
            mission.setDifficulty("MEDIUM");
            mission.setXpReward(100);
        } else if (analysis.getLogicScore() < 50) {
            mission.setTitle("Improve Error Handling");
            mission.setDescription("Several try-catch blocks are empty or missing. Add proper error logging.");
            mission.setIssueType("LOGIC");
            mission.setDifficulty("EASY");
            mission.setXpReward(50);
        } else {
             mission.setTitle("Optimize Performance");
             mission.setDescription("Review loops and database queries for N+1 problems.");
             mission.setIssueType("PERFORMANCE");
             mission.setDifficulty("HARD");
             mission.setXpReward(150);
        }
        
        return missionRepository.save(mission);
    }
    
    public void completeMission(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));
        mission.setStatus("COMPLETED");
        mission.setCompletedAt(LocalDateTime.now());
        missionRepository.save(mission);
    }
}
