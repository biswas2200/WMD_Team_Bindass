package com.ruvaa.backend.controller;

import com.ruvaa.backend.service.CodeRabbitService;
import com.ruvaa.backend.service.GitHubService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final GitHubService gitHubService;
    private final CodeRabbitService codeRabbitService;

    @PostMapping("/github")
    public ResponseEntity<String> handleGitHubWebhook(
            @RequestHeader("X-GitHub-Event") String eventType,
            @RequestBody Map<String, Object> payload) {
        
        log.info("Received GitHub Webhook: {}", eventType);
        
        if ("push".equals(eventType)) {
            // content...
            // gitHubService.handlePushEvent(payload);
            return ResponseEntity.ok("Push Event Processed");
        }
        
        return ResponseEntity.ok("Event Ignored");
    }

    @PostMapping("/coderabbit")
    public ResponseEntity<String> handleCodeRabbitWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Received CodeRabbit Webhook");
        try {
            Map<String, Object> reviewResults = codeRabbitService.parseReviewResults(payload);
            log.info("CodeRabbit review parsed: {}", reviewResults);
            // TODO: Use reviewResults to update mission status and user scores.
            return ResponseEntity.ok("CodeRabbit Review Processed");
        } catch (Exception e) {
            log.error("Error processing CodeRabbit webhook: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error processing webhook");
        }
    }
}
