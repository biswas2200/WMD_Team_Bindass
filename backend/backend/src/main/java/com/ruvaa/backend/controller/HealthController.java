package com.ruvaa.backend.controller;

import com.ruvaa.backend.config.GeminiConfig;
import com.ruvaa.backend.model.dto.ApiResponse;
import com.ruvaa.backend.service.PythonAIIntegrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Health Check Controller for Kodra.ai
 *
 * Provides system health status and API information
 */
@RestController
@RequestMapping("/")
@RequiredArgsConstructor
@Tag(name = "Health Check", description = "System health and status endpoints")
public class HealthController {

    private final PythonAIIntegrationService pythonAIIntegrationService;
    private final GeminiConfig geminiConfig;

    /**
     * Root endpoint with API information
     */
    @GetMapping
    @Operation(
            summary = "Get API information",
            description = "Returns basic API information and available endpoints for Kodra.ai",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "API information retrieved successfully")
            }
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApiInfo() {
        Map<String, Object> apiInfo = Map.of(
                "name", "Kodra.ai API",
                "description", "Autonomous Career Agent for Developers",
                "version", "1.0.0",
                "status", "running",
                "timestamp", LocalDateTime.now(),
                "documentation", "/swagger-ui.html",
                "endpoints", Map.of(
                        "missions", "/missions/* - Mission management",
                        "github", "/api/github/* - GitHub integration",
                        "chat", "/chat/* - AI-powered technical chat",
                        "health", "/health - System health checks"
                ),
                "features", Map.of(
                        "codeAnalysis", "Analyzes GitHub repos for logic, security, and performance.",
                        "missionGeneration", "Creates personalized learning missions from code.",
                        "aiMentorship", "Provides AI-powered assistance for missions."
                )
        );

        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                "Kodra.ai API is running successfully",
                apiInfo
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Detailed health check
     */
    @GetMapping("/health")
    @Operation(
            summary = "System health check",
            description = "Returns detailed system health status including external services",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Health check completed"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "503", description = "System unhealthy")
            }
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        boolean pythonServiceHealthy = pythonAIIntegrationService.isServiceAvailable();
        boolean geminiHealthy = geminiConfig.isGeminiConfigured();
        boolean overallHealthy = pythonServiceHealthy && geminiHealthy;

        Map<String, Object> healthStatus = Map.of(
                "status", overallHealthy ? "UP" : "DOWN",
                "timestamp", LocalDateTime.now(),
                "services", Map.of(
                        "python-ai-service", Map.of(
                                "status", pythonServiceHealthy ? "UP" : "DOWN",
                                "description", "Python AI Service for code analysis and chat."
                        ),
                        "gemini", Map.of(
                                "status", geminiHealthy ? "CONFIGURED" : "NOT_CONFIGURED",
                                "description", "Google Gemini AI service configuration"
                        ),
                        "application", Map.of(
                                "status", "UP",
                                "description", "Main application services"
                        )
                ),
                "system", Map.of(
                        "memory", Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory(),
                        "totalMemory", Runtime.getRuntime().totalMemory(),
                        "maxMemory", Runtime.getRuntime().maxMemory(),
                        "processors", Runtime.getRuntime().availableProcessors()
                )
        );

        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                overallHealthy ? "System is healthy" : "System has issues",
                healthStatus
        );

        return ResponseEntity.status(overallHealthy ? 200 : 503).body(response);
    }

    /**
     * API readiness check
     */
    @GetMapping("/ready")
    @Operation(
            summary = "Readiness check",
            description = "Checks if the API is ready to serve requests",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "API is ready"),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "503", description = "API is not ready")
            }
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> readinessCheck() {
        boolean ready = true; // Simplified for now

        Map<String, Object> readinessStatus = Map.of(
                "ready", ready,
                "timestamp", LocalDateTime.now(),
                "message", ready ? "API is ready to serve requests" : "API is not ready"
        );

        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                ready ? "API is ready" : "API is not ready",
                readinessStatus
        );

        return ResponseEntity.status(ready ? 200 : 503).body(response);
    }

    /**
     * API liveness check
     */
    @GetMapping("/live")
    @Operation(
            summary = "Liveness check",
            description = "Simple liveness probe for the application",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Application is alive")
            }
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> livenessCheck() {
        Map<String, Object> livenessStatus = Map.of(
                "alive", true,
                "timestamp", LocalDateTime.now(),
                "uptime", System.currentTimeMillis()
        );

        ApiResponse<Map<String, Object>> response = ApiResponse.success(
                "Application is alive",
                livenessStatus
        );

        return ResponseEntity.ok(response);
    }
}