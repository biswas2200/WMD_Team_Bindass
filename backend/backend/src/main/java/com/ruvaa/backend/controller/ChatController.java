package com.ruvaa.backend.controller;

import com.ruvaa.backend.dto.ChatRequest;
import com.ruvaa.backend.dto.ChatResponse;
import com.ruvaa.backend.dto.SimpleChatResponse;
import com.ruvaa.backend.entity.ChatMessage;
import com.ruvaa.backend.entity.User;
import com.ruvaa.backend.repository.ChatMessageRepository;
import com.ruvaa.backend.repository.UserRepository;
import com.ruvaa.backend.service.PythonAIIntegrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final PythonAIIntegrationService pythonAIIntegrationService;
    private final com.ruvaa.backend.service.GeminiAIService geminiAIService;

    @PostMapping("/message")
    public ResponseEntity<SimpleChatResponse> sendMessage(@Valid @RequestBody ChatRequest request,
                                                           Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "anonymous";
            User user = userRepository.findByUsername(username).orElse(null);

            String aiResponse;
            try {
                // Legacy: pythonAIIntegrationService.sendChatMessage(request.getMessage(), user);
                // New: Use Gemini AI directly with Context
                String userContext = user != null ? "User: " + user.getName() + ", Interests: " + user.getInterests() : "Anonymous User";
                
                // Build Chat History (Last 10 messages)
                String chatHistory = "";
                if (user != null) {
                    List<ChatMessage> history = chatMessageRepository.findByUserIdOrderByCreatedAtAsc(user.getId());
                    // Keep only last 10 to avoid token limits
                    if (history.size() > 10) {
                        history = history.subList(history.size() - 10, history.size());
                    }
                    chatHistory = history.stream()
                        .map(msg -> (Boolean.TRUE.equals(msg.getIsFromUser()) ? "User: " : "Kodra: ") + msg.getMessage())
                        .collect(Collectors.joining("\n"));
                }

                aiResponse = geminiAIService.chat(request.getMessage(), userContext, chatHistory).join();
            } catch (Exception e) {
                log.error("AI Service failed: {}", e.getMessage());
                aiResponse = "I'm having trouble connecting to my brain right now. Please try again later.";
            }

            if (user != null) {
                try {
                    ChatMessage userMessage = new ChatMessage();
                    userMessage.setUser(user);
                    userMessage.setMessage(request.getMessage());
                    userMessage.setIsFromUser(true);
                    chatMessageRepository.save(userMessage);

                    ChatMessage botMessage = new ChatMessage();
                    botMessage.setUser(user);
                    botMessage.setMessage(aiResponse);
                    botMessage.setIsFromUser(false);
                    botMessage.setResponse(aiResponse);
                    chatMessageRepository.save(botMessage);
                } catch (Exception e) {
                    log.warn("Failed to save chat to local DB: {}", e.getMessage());
                }
            }

            return ResponseEntity.ok(new SimpleChatResponse(aiResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatResponse>> getChatHistory(Authentication authentication,
                                                           @RequestParam(defaultValue = "20") int limit) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<ChatMessage> messages = chatMessageRepository.findByUserIdOrderByCreatedAtAsc(user.getId());

            List<ChatResponse> responses = messages.stream()
                    .map(msg -> new ChatResponse(
                            msg.getMessage(),
                            msg.getResponse(),
                            msg.getIsFromUser(),
                            msg.getCreatedAt()
                    ))
                    .collect(Collectors.toList());

            log.debug("Retrieved {} chat messages from local DB for user: {}", responses.size(), username);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Chat history request failed: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("ai_service", pythonAIIntegrationService.isServiceAvailable());
        return ResponseEntity.ok(health);
    }
}