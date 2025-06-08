package com.example.ws4wardback.repository;

import com.example.ws4wardback.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Post findTopByOrderByCreatedAtDesc();

}
