package com.example.ws4wardback.controller;

import com.example.ws4wardback.entity.Portfolio;
import com.example.ws4wardback.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @PostMapping
    public ResponseEntity<String> save(@RequestBody Portfolio portfolio) {
        if (portfolio.getStudentId() == null || portfolio.getStudentId().isEmpty()) {
            return ResponseEntity.badRequest().body("studentId는 필수입니다.");
        }
        portfolioService.save(portfolio);
        return ResponseEntity.ok("포트폴리오 저장 완료");
    }

    @GetMapping
    public ResponseEntity<List<Portfolio>> getAll() {
        return ResponseEntity.ok(portfolioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Portfolio> getOne(@PathVariable Long id) {
        Portfolio portfolio = portfolioService.findById(id);
        if (portfolio == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(portfolio);
    }

    @PutMapping("/{id}")  // 🔧 수정: 경로에서 /portfolios 제거
    public ResponseEntity<?> updatePortfolio(@PathVariable Long id,
                                             @RequestParam String studentId,
                                             @RequestBody Portfolio updatedPortfolio) {
        Portfolio existing = portfolioService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        if (!existing.getStudentId().equals(studentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("작성자만 수정할 수 있습니다.");
        }

        existing.setTitle(updatedPortfolio.getTitle());
        existing.setCategory(updatedPortfolio.getCategory());
        existing.setLanguage(updatedPortfolio.getLanguage());
        existing.setDate(updatedPortfolio.getDate());
        existing.setGithub(updatedPortfolio.getGithub());
        existing.setTags(updatedPortfolio.getTags());
        existing.setDescription(updatedPortfolio.getDescription());
        existing.setImageUrl(updatedPortfolio.getImageUrl());

        return ResponseEntity.ok(portfolioService.save(existing));
    }

    @DeleteMapping("/{id}") // 🔧 수정: 경로에서 /portfolios 제거
    public ResponseEntity<?> deletePortfolio(@PathVariable Long id,
                                             @RequestParam String studentId) {
        Portfolio existing = portfolioService.findById(id);
        if (existing == null) return ResponseEntity.notFound().build();

        if (!existing.getStudentId().equals(studentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("작성자만 삭제할 수 있습니다.");
        }

        portfolioService.deleteById(id);
        return ResponseEntity.ok("삭제 완료");
    }

    @GetMapping("/latest")
    public ResponseEntity<Portfolio> getLatest() {
        Portfolio latest = portfolioService.getLatestPortfolio();
        if (latest == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(latest);
    }

}
