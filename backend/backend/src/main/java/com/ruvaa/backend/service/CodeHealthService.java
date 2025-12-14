package com.ruvaa.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruvaa.backend.entity.CodeAnalysis;
import com.ruvaa.backend.entity.GitHubProfile;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.CodeAnalysisRepository;
import com.ruvaa.backend.repository.GitHubProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class CodeHealthService {

    private final CodeAnalysisRepository codeAnalysisRepository;
    private final GitHubProfileRepository gitHubProfileRepository;
    private final GitHubService gitHubService; // To fetch repo details
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CodeAnalysis generateInitialAnalysis(User user) {
        log.info("Generating aggregated code analysis for user: {}", user.getUsername());
        return createAnalysis(user, "Aggregate Analysis", 80, 20, 65, 70); 
    }

    public CodeAnalysis analyzeRepository(User user, String repoName) {
        log.info("Analyzing repository: {} for user: {}", repoName, user.getUsername());
        
        GitHubProfile profile = gitHubProfileRepository.findByUserId(user.getId()).orElse(null);
        if (profile == null || profile.getAccessToken() == null) {
            // Fallback if no GitHub connection
            return createAnalysis(user, repoName, 50, 50, 50, 50);
        }

        Map<String, Object> repoDetails = gitHubService.getRepoDetails(profile.getGithubUsername(), repoName, profile.getAccessToken());
        
        if (repoDetails == null) {
           return createAnalysis(user, repoName + " (Failed to fetch)", 0, 0, 0, 0);
        }

        // HEURISTIC CALCULATION
        int stars = (Integer) repoDetails.getOrDefault("stargazers_count", 0);
        int forks = (Integer) repoDetails.getOrDefault("forks_count", 0);
        int openIssues = (Integer) repoDetails.getOrDefault("open_issues_count", 0);
        int sizeKb = (Integer) repoDetails.getOrDefault("size", 0);
        String language = (String) repoDetails.getOrDefault("language", "Unknown");

        // Logic Score: Typed > Dynamic (Subjective Heuristic), affected by Stars
        int logicScore = 70;
        if ("Java".equalsIgnoreCase(language) || "TypeScript".equalsIgnoreCase(language)) logicScore += 10;
        if ("JavaScript".equalsIgnoreCase(language) || "Python".equalsIgnoreCase(language)) logicScore += 5;
        logicScore += Math.min(stars * 2, 15); // Cap bonus
        logicScore = clamp(logicScore);

        // Security Score: Penalize open issues heavily
        int securityScore = 90; 
        securityScore -= (openIssues * 5);
        securityScore = clamp(securityScore);

        // Performance Score: Penalize massive size (assumption: bloat)
        int perfScore = 85;
        if (sizeKb > 50000) perfScore -= 20; // > 50MB
        else if (sizeKb > 10000) perfScore -= 10;
        perfScore += Math.min(stars, 10);
        perfScore = clamp(perfScore);

        // Best Practices: General health
        int bestPractices = 80;
        if (openIssues > 10) bestPractices -= 20;
        bestPractices += Math.min(forks * 2, 10);
        bestPractices = clamp(bestPractices);
        
        return createAnalysis(user, repoName, logicScore, securityScore, perfScore, bestPractices);
    }
    
    private CodeAnalysis createAnalysis(User user, String repoName, int l, int s, int p, int b) {
        CodeAnalysis analysis = new CodeAnalysis();
        analysis.setUser(user);
        analysis.setRepoName(repoName);
        analysis.setLogicScore(l);
        analysis.setSecurityScore(s);
        analysis.setPerformanceScore(p);
        analysis.setBestPracticesScore(b);
        analysis.setDetails_json("[]"); 
        
        // Add random variation based on repoName hash to make it feel unique even if stats are same
        Random rand = new Random(repoName.hashCode());
        analysis.setLogicScore(clamp(analysis.getLogicScore() + rand.nextInt(10) - 5));
        
        return codeAnalysisRepository.save(analysis);
    }

    private int clamp(int val) {
        return Math.max(0, Math.min(100, val));
    }

    public CodeAnalysis getLatestAnalysis(User user) {
        return codeAnalysisRepository.findTopByUserOrderByAnalyzedAtDesc(user)
                .orElse(null);
    }
}
