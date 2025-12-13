package com.ruvaa.backend.service;

import com.ruvaa.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Try finding by email first (login scenario)
        var userOptional = userRepository.findByEmail(identifier);
        
        // If not found, try finding by username (token auth scenario)
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByUsername(identifier);
        }
        
        return userOptional
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + identifier));
    }
}