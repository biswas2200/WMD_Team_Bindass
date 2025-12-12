package com.ruvaa.backend.controller;

import com.ruvaa.backend.entity.Mission;
import com.ruvaa.backend.model.dto.ApiResponse;
import com.ruvaa.backend.service.MissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/kodra/missions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MissionController {

    private final MissionService missionService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<Mission>>> getMissions(@PathVariable Long userId) {
        List<Mission> missions = missionService.getMissionsForUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Missions retrieved successfully", missions));
    }

    @GetMapping("/{userId}/{missionId}")
    public ResponseEntity<ApiResponse<Mission>> getMissionDetail(@PathVariable Long userId, @PathVariable Long missionId) {
        Mission mission = missionService.getMission(missionId); // Assuming MissionService has getMission method
        return ResponseEntity.ok(ApiResponse.success("Mission detail retrieved successfully", mission));
    }

    @PostMapping("/{missionId}/start")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startMission(@PathVariable Long missionId) {
        // Assuming MissionService has a startMission method
        missionService.startMission(missionId);
        return ResponseEntity.ok(ApiResponse.success("Mission started", Map.of("success", true, "startedAt", LocalDateTime.now())));
    }

    @PostMapping("/{missionId}/submit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitMission(@PathVariable Long missionId, @RequestBody Map<String, String> payload) {
        String prUrl = payload.get("prUrl");
        Map<String, Object> judgeResult = missionService.evaluateMissionSubmission(missionId, prUrl);
        return ResponseEntity.ok(ApiResponse.success("Mission submitted for review", judgeResult));
    }

    @PostMapping("/{missionId}/skip")
    public ResponseEntity<ApiResponse<Map<String, Object>>> skipMission(@PathVariable Long missionId) {
        missionService.skipMission(missionId);
        return ResponseEntity.ok(ApiResponse.success("Mission skipped", Map.of("success", true)));
    }
}
