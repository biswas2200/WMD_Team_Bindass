package com.ruvaa.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class KestraIntegrationService {

    private final RestTemplate restTemplate;

    @Value("${kestra.api.url:http://localhost:8080}")
    private String kestraApiUrl;

    @Value("${kestra.api.token:#{null}}")
    private String kestraApiToken;

    /**
     * Triggers the Kestra workflow for mission prioritization.
     * Assumes the flow is named 'kodra-mission-prioritizer' in the 'dev' namespace.
     *
     * @param userId The ID of the user.
     * @param issues The list of issues found during code analysis.
     * @return The execution ID from Kestra.
     */
    public String triggerMissionPrioritizer(Long userId, List<Object> issues) {
        log.info("Triggering Kestra mission prioritization workflow for user: {}", userId);

        String flowNamespace = "dev";
        String flowId = "kodra-mission-prioritizer";
        String url = String.format("%s/api/v1/executions/%s/%s", kestraApiUrl, flowNamespace, flowId);

        HttpHeaders headers = createHeaders();
        Map<String, Object> body = Map.of(
                "userId", userId,
                "issues", issues
        );
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            if (response != null && response.containsKey("id")) {
                String executionId = (String) response.get("id");
                log.info("Kestra workflow started with execution ID: {}", executionId);
                return executionId;
            } else {
                log.error("Failed to trigger Kestra workflow or parse execution ID. Response: {}", response);
                return null;
            }
        } catch (Exception e) {
            log.error("Error calling Kestra API to trigger workflow", e);
            return null;
        }
    }

    /**
     * Gets the result of a Kestra workflow execution.
     *
     * @param executionId The ID of the workflow execution.
     * @return The full state of the Kestra execution.
     */
    public Map<String, Object> getWorkflowResult(String executionId) {
        log.info("Fetching result for Kestra workflow execution: {}", executionId);
        String url = String.format("%s/api/v1/executions/%s", kestraApiUrl, executionId);
        HttpHeaders headers = createHeaders();
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            return restTemplate.exchange(url, HttpMethod.GET, entity, Map.class).getBody();
        } catch (Exception e) {
            log.error("Error fetching Kestra workflow result for execution ID: {}", executionId, e);
            return Map.of("status", "ERROR", "message", e.getMessage());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (kestraApiToken != null && !kestraApiToken.isEmpty()) {
            headers.setBearerAuth(kestraApiToken);
        }
        return headers;
    }
}
