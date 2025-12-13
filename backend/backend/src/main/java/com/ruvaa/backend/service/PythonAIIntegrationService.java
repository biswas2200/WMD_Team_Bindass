package com.ruvaa.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruvaa.backend.dto.AssistRequest;
import com.ruvaa.backend.dto.AssistResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for integrating with the Python AI service.
 * Provides communication between Spring Boot backend and Python Flask AI service for Kodra.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PythonAIIntegrationService {

    @Value("${python.ai.service.url:http://localhost:5000}")
    private String pythonAIServiceUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Gets AI-powered assistance from the Python service.
     * @param request The assistance request details.
     * @return The response from the AI service.
     */
    public AssistResponse getAIAssistance(AssistRequest request) {
        log.debug("Forwarding assistance request to Python AI service: {}", request.getQuestion());
        String url = pythonAIServiceUrl + "/api/v1/assist";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<AssistRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<AssistResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                AssistResponse.class
        );

        if (response.getBody() == null) {
            throw new IllegalStateException("Received empty response from Python AI service for assistance");
        }
        return response.getBody();
    }

    /**
     * Sends a chat message to the Python AI service.
     * @param message The user's message.
     * @param profileData Relevant user profile data for context.
     * @return The AI's response message.
     */
    public String sendChatMessage(String message, Object profileData) {
        log.debug("Sending chat message to Python AI service: {}", message);
        String url = pythonAIServiceUrl + "/api/v1/chat";

        Map<String, Object> request = new HashMap<>();
        request.put("message", message);
        if (profileData != null) {
            request.put("profile", profileData);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );

        Map<String, Object> responseBody = response.getBody();
        if (responseBody == null || !responseBody.containsKey("response")) {
            throw new IllegalStateException("Invalid response from Python AI chat service");
        }
        return (String) responseBody.get("response");
    }

    /**
     * Asks the Python AI service (LLM-as-a-Judge) to evaluate a code fix.
     * @param originalCode The original code with the issue.
     * @param fixedCode The user's submitted fixed code.
     * @param issueDescription A description of the original issue.
     * @return A map containing the grade and explanation from the AI judge.
     */
    public Map<String, Object> evaluateCodeFix(String originalCode, String fixedCode, String issueDescription) {
        log.debug("Sending code fix evaluation request to Python AI Judge");
        String url = pythonAIServiceUrl + "/api/v1/judge";

        Map<String, Object> request = new HashMap<>();
        request.put("original_code", originalCode);
        request.put("fixed_code", fixedCode);
        request.put("issue_description", issueDescription);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                Map.class
        );

        if (response.getBody() == null) {
            throw new IllegalStateException("Received empty response from Python AI judge service");
        }
        return response.getBody();
    }

    /**
     * Checks if the Python AI service is available and healthy.
     * @return true if the service is available, false otherwise.
     */
    public boolean isServiceAvailable() {
        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                pythonAIServiceUrl + "/health",
                HttpMethod.GET,
                null,
                Map.class
            );
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.warn("Python AI service is not available at {}: {}", pythonAIServiceUrl, e.getMessage());
            return false;
        }
    }
}
