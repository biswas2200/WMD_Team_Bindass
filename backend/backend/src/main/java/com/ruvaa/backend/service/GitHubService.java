package com.ruvaa.backend.service;

import com.ruvaa.backend.dto.RepositoryDto;
import com.ruvaa.backend.entity.GitHubProfile;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.GitHubProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class GitHubService {

    private final GitHubProfileRepository gitHubProfileRepository;
    private final RestTemplate restTemplate;

    @Value("${github.client.id}")
    private String clientId;

    @Value("${github.client.secret}")
    private String clientSecret;

    public String exchangeCodeForToken(String code) {
        String url = "https://github.com/login/oauth/access_token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(java.util.Collections.singletonList(MediaType.APPLICATION_JSON));
        
        Map<String, String> body = Map.of(
            "client_id", clientId,
            "client_secret", clientSecret,
            "code", code
        );
        
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            if (response.getBody() != null && response.getBody().containsKey("access_token")) {
                return (String) response.getBody().get("access_token");
            }
        } catch (Exception e) {
            log.error("Failed to exchange code for token", e);
        }
        return null;
    }

    public GitHubProfile linkGitHubAccount(User user, String accessToken) {
        // Fetch User Info from GitHub
        String url = "https://api.github.com/user";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> userData = response.getBody();

            if (userData == null) throw new RuntimeException("Failed to fetch GitHub user data");

            String login = (String) userData.get("login");
            String avatarUrl = (String) userData.get("avatar_url");

            Optional<GitHubProfile> existing = gitHubProfileRepository.findByUserId(user.getId());
            GitHubProfile profile = existing.orElse(new GitHubProfile());

            profile.setUser(user);
            profile.setGithubUsername(login);
            profile.setAccessToken(accessToken);
            profile.setAvatarUrl(avatarUrl);
            
            return gitHubProfileRepository.save(profile);

        } catch (Exception e) {
            log.error("Error linking GitHub account", e);
            throw new RuntimeException("GitHub Link Failed");
        }
    }

    public List<RepositoryDto> getUserRepositories(String accessToken) {
        String url = "https://api.github.com/user/repos";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );

            if (response.getBody() == null) {
                return List.of();
            }

            return response.getBody().stream()
                    .map(repoData -> {
                        RepositoryDto dto = new RepositoryDto();
                        dto.setName((String) repoData.get("name"));
                        dto.setFullName((String) repoData.get("full_name"));
                        dto.setUrl((String) repoData.get("html_url"));
                        dto.setLanguage((String) repoData.get("language"));
                        return dto;
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch user repositories", e);
            return List.of();
        }
    }

    public Map<String, String> getRepositoryContents(String repoFullName, String accessToken) {
        // Placeholder implementation
        log.info("Fetching contents for repo: {}", repoFullName);
        // TODO: Implement logic to clone repo or use GitHub contents API recursively
        return Map.of();
    }

    public void createWebhook(String repoFullName, String accessToken) {
        // Placeholder implementation
        log.info("Creating webhook for repo: {}", repoFullName);
        // TODO: Implement logic to call GitHub API to create a webhook
    }

    public Map<String, String> getPullRequestDiff(String owner, String repo, int prNumber, String accessToken) {
        // Placeholder implementation
        log.info("Fetching diff for PR #{} in {}/{}", prNumber, owner, repo);
        // TODO: Implement logic to get PR diff. This might require getting the PR details
        // first to find the base and head SHAs, then comparing them.
        return Map.of();
    }

    public String getFileContent(String owner, String repo, String filePath, String sha, String accessToken) {
        // Placeholder implementation
        log.info("Fetching content for file {} at commit {}", filePath, sha);
        // TODO: Implement logic to get file content at a specific commit SHA.
        return "";
    }
}
