package com.ruvaa.backend.controller;

import com.ruvaa.backend.dto.AssistRequest;
import com.ruvaa.backend.dto.AssistResponse;
import com.ruvaa.backend.service.PythonAIIntegrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/kodra/assist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AssistController {

    private final PythonAIIntegrationService pythonAIIntegrationService;

    @PostMapping
    public ResponseEntity<AssistResponse> assist(@RequestBody AssistRequest request) {
        log.info("Received assist request for user: {}", request.getUserId());
        try {
            AssistResponse response = pythonAIIntegrationService.getAIAssistance(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.warn("AI Service unavailable for assistance: {}", e.getMessage());
            AssistResponse fallback = AssistResponse.builder()
                .explanation("I'm sorry, I cannot assist you right now as the AI service is unavailable. Please try again later.")
                .codeExample("")
                .practiceExercise("")
                .estimatedReadTime(0)
                .relatedResources(java.util.Collections.emptyList())
                .build();
            return ResponseEntity.ok(fallback);
        }
    }
}
