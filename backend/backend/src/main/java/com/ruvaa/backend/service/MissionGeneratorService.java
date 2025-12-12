package com.ruvaa.backend.service;

import com.ruvaa.backend.entity.CodeAnalysis;
import com.ruvaa.backend.entity.Mission;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MissionGeneratorService {

    private final KestraIntegrationService kestraIntegrationService;
    private final MissionRepository missionRepository;

    public List<Mission> generateMissionsForUser(User user, List<CodeAnalysis> analysisResults) {
        log.info("Generating missions for user: {}", user.getId());

        // In a real implementation, we would extract the issues from the analysisResults
        // and send them to Kestra. For now, we'll send an empty list.
        List<Object> issues = Collections.emptyList();
        String executionId = kestraIntegrationService.triggerMissionPrioritizer(user.getId(), issues);

        // We would then poll for the result and create missions based on the prioritized list.
        // For now, we'll just create a mock mission.

        Mission mission = new Mission();
        mission.setUser(user);
        mission.setTitle("Secure Your Authentication Service");
        mission.setDescription("We detected potential secrets in your code. Use environment variables instead of hardcoded strings.");
        mission.setIssueType("SECURITY");
        mission.setDifficulty("MEDIUM");
        mission.setXpReward(100);
        mission.setStatus("PENDING");

        missionRepository.save(mission);
        log.info("Created mock mission for user: {}", user.getId());

        return List.of(mission);
    }
}
