package com.ruvaa.backend.service;

import com.ruvaa.backend.entity.CodeAnalysis;
import com.ruvaa.backend.entity.Mission;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MissionService {

    private final MissionRepository missionRepository;
    private final PythonAIIntegrationService pythonAIIntegrationService;

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
    
    public Map<String, Object> evaluateMissionSubmission(Long missionId, String prUrl) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        log.info("Evaluating mission submission for mission ID: {} with PR URL: {}", missionId, prUrl);

        // For now, mocking code content and issue details for the LLM-as-a-Judge
        String originalCode = "const API_KEY = 'sk-proj-12345';";
        String fixedCode = "const API_KEY = process.env.API_KEY;";
        String issueDescription = "Hardcoded API key in config file";
        String expectedFixPattern = "Use environment variables for secrets.";

        Map<String, Object> judgeResult = pythonAIIntegrationService.evaluateCodeFix(
            originalCode, fixedCode, issueDescription, expectedFixPattern
        );

        // Update mission status based on judgeResult
        if ((Boolean) judgeResult.getOrDefault("properly_fixed", false)) {
            mission.setStatus("COMPLETED");
            mission.setCompletedAt(LocalDateTime.now());
            mission.setPrUrl(prUrl);
            missionRepository.save(mission);
            log.info("Mission ID: {} successfully completed and validated.", missionId);
        } else {
            mission.setStatus("FAILED"); // Or "NEEDS_REVISION"
            missionRepository.save(mission);
            log.warn("Mission ID: {} failed validation. Judge result: {}", missionId, judgeResult);
        }
        
        return judgeResult;
    }

    public Mission getMission(Long missionId) {
        return missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));
    }

    public void startMission(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));
        mission.setStatus("IN_PROGRESS");
        mission.setStartedAt(LocalDateTime.now());
        missionRepository.save(mission);
        log.info("User started mission ID: {}", missionId);
    }

    public void skipMission(Long missionId) {
        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));
        mission.setStatus("SKIPPED");
        missionRepository.save(mission);
        log.warn("User skipped mission ID: {}", missionId);
    }
}
