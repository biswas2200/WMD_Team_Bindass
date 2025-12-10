package com.ruvaa.backend.controller;

import com.ruvaa.backend.entity.GitHubProfile;
import com.ruvaa.backend.service.GitHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow frontend access
public class GitHubController {

    private final GitHubService gitHubService;
    private final com.ruvaa.backend.repository.UserRepository userRepository;

    @PostMapping("/link")
    public ResponseEntity<GitHubProfile> linkGitHubAccount(@RequestParam Long userId, @RequestParam String code) {
        // 1. Fetch User
        com.ruvaa.backend.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Exchange Code for Token
        String accessToken = gitHubService.exchangeCodeForToken(code);
        if (accessToken == null) {
            return ResponseEntity.badRequest().build();
        }

        // 3. Link Account
        GitHubProfile profile = gitHubService.linkGitHubAccount(user, accessToken);
        return ResponseEntity.ok(profile);
    }
}
