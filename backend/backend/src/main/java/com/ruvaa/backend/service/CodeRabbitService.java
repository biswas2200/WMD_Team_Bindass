package com.ruvaa.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class CodeRabbitService {

    private final RestTemplate restTemplate;

    @Value("${coderabbit.api.url:https://api.coderabbit.ai}")
    private String codeRabbitApiUrl;

    @Value("${coderabbit.api.key}")
    private String codeRabbitApiKey;

    /**
     * Triggers a CodeRabbit review for a given Pull Request URL.
     *
     * @param prUrl The URL of the Pull Request to review.
     * @param missionId The ID of the related mission.
     * @return The review ID from CodeRabbit.
     */
    public String triggerReview(String prUrl, Long missionId) {
        log.info("Triggering CodeRabbit review for PR: {} (Mission ID: {})", prUrl, missionId);

        String url = String.format("%s/reviews", codeRabbitApiUrl);
        HttpHeaders headers = createHeaders();
        Map<String, Object> body = Map.of(
                "pr_url", prUrl,
                "review_type", "security_focused",
                "custom_instructions", "Reviewing for Kodra Mission: " + missionId
        );
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            if (response != null && response.containsKey("review_id")) {
                String reviewId = (String) response.get("review_id");
                log.info("CodeRabbit review triggered with ID: {}", reviewId);
                return reviewId;
            } else {
                log.error("Failed to trigger CodeRabbit review or parse review ID. Response: {}", response);
                return null;
            }
        } catch (Exception e) {
            log.error("Error calling CodeRabbit API to trigger review", e);
            return null;
        }
    }

    /**
     * Parses a CodeRabbit review payload.
     *
     * @param reviewPayload The raw payload from CodeRabbit webhook.
     * @return A map containing parsed review results.
     */
    public Map<String, Object> parseReviewResults(Map<String, Object> reviewPayload) {
        log.info("Parsing CodeRabbit review results.");
        if (reviewPayload == null || !reviewPayload.containsKey("summary")) {
            log.error("Invalid or empty CodeRabbit payload received.");
            return Map.of("error", "Invalid payload");
        }
        return (Map<String, Object>) reviewPayload.get("summary");
    }

    /**
     * Calculates score improvement based on review results.
     * This is a simplified calculation. A real implementation would be more complex.
     *
     * @param oldAnalysis A representation of previous code analysis scores.
     * @param reviewResult The parsed review results from parseReviewResults.
     * @return A map of score deltas.
     */
    public Map<String, Integer> calculateScoreImprovement(Map<String, Integer> oldAnalysis, Map<String, Object> reviewResult) {
        log.info("Calculating score improvement based on review: {}", reviewResult);
        Map<String, Integer> scoreDeltas = new HashMap<>();

        int issuesResolved = (int) reviewResult.getOrDefault("issues_resolved", 0);
        int issuesFound = (int) reviewResult.getOrDefault("issues_found", 0);

        // Simple logic: Each resolved issue gives +5 points to security score.
        // Each new issue found gives -2 points.
        int securityImprovement = (issuesResolved * 5) - (issuesFound * 2);

        scoreDeltas.put("security", securityImprovement);
        scoreDeltas.put("logic", 0); // Assuming CodeRabbit focuses on security for this mission
        scoreDeltas.put("performance", 0);

        log.info("Calculated score deltas: {}", scoreDeltas);
        return scoreDeltas;
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(codeRabbitApiKey);
        return headers;
    }
}
