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
    private final GitHubService gitHubService; // Added for real implementation

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

        // STEP 1: Parse PR URL to get owner, repo, and PR number.
        // (Implementation needed)
        // Example: "https://github.com/testuser-github/auth-service/pull/12" -> owner: "testuser-github", repo: "auth-service", prNumber: 12

        // STEP 2: Use GitHubService to get the diff for the PR.
        // This would return the files changed and the patch/diff content.
        // Map<String, String> diff = gitHubService.getPullRequestDiff(owner, repo, prNumber);
        
        // STEP 3: For each changed file, get the original and new content.
        // String originalCode = gitHubService.getFileContent(owner, repo, filePath, baseSha);
        // String fixedCode = gitHubService.getFileContent(owner, repo, filePath, headSha);

        // NOTE: The following is a placeholder for the real code fetched from GitHub.
        // The mock values are removed to make way for the real implementation.
        String originalCode = ""; // TODO: Fetch from GitHubService using PR base commit
        String fixedCode = "";    // TODO: Fetch from GitHubService using PR head commit
        String issueDescription = mission.getDescription();

        log.info("Sending to AI Judge. Original Code is empty (TODO), Fixed Code is empty (TODO).");

        Map<String, Object> judgeResult = pythonAIIntegrationService.evaluateCodeFix(
            originalCode, fixedCode, issueDescription
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
