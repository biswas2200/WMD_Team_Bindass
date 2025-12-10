package com.ruvaa.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruvaa.backend.config.GeminiConfig;
import com.ruvaa.backend.entity.CodeAnalysis;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Google Gemini AI Service for Code Analysis (Kodra.ai)
 */
@Slf4j
@Service
public class GeminiAIService {

    private final WebClient geminiWebClient;
    private final GeminiConfig geminiConfig;
    private final ObjectMapper objectMapper;

    public GeminiAIService(@Autowired(required = false) @Qualifier("geminiWebClient") WebClient geminiWebClient,
                           GeminiConfig geminiConfig,
                           ObjectMapper objectMapper) {
        this.geminiWebClient = geminiWebClient;
        this.geminiConfig = geminiConfig;
        this.objectMapper = objectMapper;
    }

    public CompletableFuture<CodeAnalysis> analyzeCode(String repoName, String codeContent) {
        if (geminiWebClient == null) {
            log.warn("Gemini AI not configured, returning mock analysis");
            return CompletableFuture.completedFuture(mockAnalysis(repoName));
        }

        String prompt = buildCodeAnalysisPrompt(codeContent);

        return callGeminiAPI(prompt)
                .map(response -> parseAnalysisResponse(repoName, response))
                .onErrorReturn(mockAnalysis(repoName))
                .toFuture();
    }

    private String buildCodeAnalysisPrompt(String codeContent) {
        return String.format("""
            Analyze this code snippet/diff for Security, Performance, and Logic issues.
            Return a JSON object with scores (0-100) and specific findings.
            
            Code:
            %s
            
            Format:
            {
                "logicScore": <0-100>,
                "securityScore": <0-100>,
                "performanceScore": <0-100>,
                "bestPracticesScore": <0-100>,
                "details": "Summary of issues..."
            }
            """, codeContent.substring(0, Math.min(codeContent.length(), 2000))); // Truncate for safety
    }

    private CodeAnalysis parseAnalysisResponse(String repoName, String response) {
        CodeAnalysis analysis = new CodeAnalysis();
        analysis.setRepoName(repoName);
        try {
            String jsonText = extractJsonFromResponse(response);
            JsonNode root = objectMapper.readTree(jsonText);
            
            analysis.setLogicScore(root.path("logicScore").asInt(70));
            analysis.setSecurityScore(root.path("securityScore").asInt(70));
            analysis.setPerformanceScore(root.path("performanceScore").asInt(70));
            analysis.setBestPracticesScore(root.path("bestPracticesScore").asInt(70));
            analysis.setDetails_json(jsonText);
            
        } catch (Exception e) {
            log.error("Failed to parse Gemini response", e);
            analysis.setDetails_json("{\"error\": \"Parse failure\"}");
        }
        return analysis;
    }

    private Mono<String> callGeminiAPI(String prompt) {
        Map<String, Object> request = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of("temperature", 0.4, "maxOutputTokens", 1000)
        );

        return geminiWebClient.post()
                .uri("/models/{model}:generateContent", geminiConfig.getModel())
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .retryWhen(Retry.backoff(2, Duration.ofMillis(500)));
    }

    private String extractTextFromResponse(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.at("/candidates/0/content/parts/0/text").asText();
        } catch (Exception e) {
            return "";
        }
    }
    
    private String extractJsonFromResponse(String response) {
        String text = extractTextFromResponse(response);
        if (text.contains("```json")) {
             int start = text.indexOf("```json") + 7;
             int end = text.lastIndexOf("```");
             if (end > start) return text.substring(start, end).trim();
        }
        return text;
    }

    private CodeAnalysis mockAnalysis(String repoName) {
        CodeAnalysis analysis = new CodeAnalysis();
        analysis.setRepoName(repoName);
        analysis.setLogicScore(85);
        analysis.setSecurityScore(60); // Intentionally low for demo
        analysis.setPerformanceScore(90);
        analysis.setBestPracticesScore(80);
        analysis.setDetails_json("{\"summary\": \"Mock analysis result\"}");
        return analysis;
    }
}