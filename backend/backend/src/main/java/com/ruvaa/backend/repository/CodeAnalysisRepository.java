package com.ruvaa.backend.repository;

import com.ruvaa.backend.entity.CodeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CodeAnalysisRepository extends JpaRepository<CodeAnalysis, Long> {
    Optional<CodeAnalysis> findTopByUserOrderByAnalyzedAtDesc(com.ruvaa.backend.entity.User user);
}
