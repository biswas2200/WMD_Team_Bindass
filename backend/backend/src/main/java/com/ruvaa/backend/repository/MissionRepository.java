package com.ruvaa.backend.repository;

import com.ruvaa.backend.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
    List<Mission> findByUserId(Long userId);
    List<Mission> findByUserIdAndStatus(Long userId, String status);
}
