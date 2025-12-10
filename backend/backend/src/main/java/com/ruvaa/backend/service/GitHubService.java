package com.ruvaa.backend.service;

import com.ruvaa.backend.entity.GitHubProfile;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.GitHubProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class GitHubService {

    private final GitHubProfileRepository gitHubProfileRepository;
    private final RestTemplate restTemplate = new RestTemplate();

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
    
    // Future: Method to list public Repositories
}
