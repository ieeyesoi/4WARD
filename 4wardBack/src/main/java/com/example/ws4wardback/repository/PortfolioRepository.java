package com.example.ws4wardback.repository;

import com.example.ws4wardback.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    Portfolio findTopByOrderByCreatedAtDesc();
}



