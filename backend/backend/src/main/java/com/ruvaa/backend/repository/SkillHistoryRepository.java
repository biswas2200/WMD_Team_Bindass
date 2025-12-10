package com.ruvaa.backend.repository;

import com.ruvaa.backend.entity.SkillHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillHistoryRepository extends JpaRepository<SkillHistory, Long> {
    List<SkillHistory> findByUserIdOrderByRecordedAtAsc(Long userId);
}
