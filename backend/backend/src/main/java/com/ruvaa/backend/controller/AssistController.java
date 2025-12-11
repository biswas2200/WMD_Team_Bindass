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
@RequestMapping("/api/kodra/assist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AssistController {

    private final PythonAIIntegrationService pythonAIIntegrationService;

    @PostMapping
    public ResponseEntity<AssistResponse> assist(@RequestBody AssistRequest request) {
        log.info("Received assist request for user: {}", request.getUserId());
        AssistResponse response = pythonAIIntegrationService.getAIAssistance(request);
        return ResponseEntity.ok(response);
    }
}
