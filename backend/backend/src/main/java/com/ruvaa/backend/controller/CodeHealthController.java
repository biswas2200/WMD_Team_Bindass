package com.ruvaa.backend.controller;

import com.ruvaa.backend.entity.CodeAnalysis;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.UserRepository;
import com.ruvaa.backend.service.CodeHealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analysis")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Ensure frontend can access
public class CodeHealthController {

    private final CodeHealthService codeHealthService;
    private final UserRepository userRepository;

    @GetMapping("/latest")
    public ResponseEntity<CodeAnalysis> getLatestAnalysis(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        CodeAnalysis analysis = codeHealthService.getLatestAnalysis(user);
        
        if (analysis == null) {
            // Auto-generate if missing (Demo fallback)
            analysis = codeHealthService.generateInitialAnalysis(user);
        }
        
        return ResponseEntity.ok(analysis);
    }
    
    // Explicit trigger endpoint
    @PostMapping("/trigger")
    public ResponseEntity<CodeAnalysis> triggerAnalysis(@RequestParam Long userId) {
         User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(codeHealthService.generateInitialAnalysis(user));
    }
    
    @PostMapping("/analyze-repo")
    public ResponseEntity<CodeAnalysis> analyzeRepository(@RequestParam Long userId, @RequestParam String repoName) {
         User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(codeHealthService.analyzeRepository(user, repoName));
    }
}
