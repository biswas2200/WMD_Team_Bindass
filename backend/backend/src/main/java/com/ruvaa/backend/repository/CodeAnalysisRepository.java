package com.ruvaa.backend.repository;

import com.ruvaa.backend.entity.CodeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeAnalysisRepository extends JpaRepository<CodeAnalysis, Long> {
    List<CodeAnalysis> findByUserId(Long userId);
    List<CodeAnalysis> findByUserIdOrderByAnalyzedAtDesc(Long userId);
}
