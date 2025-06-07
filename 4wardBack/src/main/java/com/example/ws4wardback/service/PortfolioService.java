package com.example.ws4wardback.service;

import com.example.ws4wardback.entity.Portfolio;
import com.example.ws4wardback.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;

    public Portfolio save(Portfolio portfolio) {
        return portfolioRepository.save(portfolio);
    }

    public List<Portfolio> findAll() {
        return portfolioRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Portfolio findById(Long id) {
        return portfolioRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        portfolioRepository.deleteById(id);
    }

    public Portfolio getLatestPortfolio() {
        return portfolioRepository.findTopByOrderByCreatedAtDesc();
    }

}
