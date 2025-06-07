package com.example.ws4wardback.repository;

import com.example.ws4wardback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);

}
