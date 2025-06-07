package com.example.ws4wardback.controller;

import com.example.ws4wardback.entity.Comment;
import com.example.ws4wardback.repository.CommentRepository;
import com.example.ws4wardback.service.CommentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/portfolios/{portfolioId}/comments")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class PortfolioCommentController {

    private final CommentService commentService;
    private final CommentRepository commentRepository;

    // ✅ 댓글 작성
    @PostMapping
    public Comment addComment(@PathVariable Long portfolioId, @RequestBody CommentRequest request) {
        return commentService.addComment(request.getStudentId(), request.getText(), portfolioId, request.isAnonymous());
    }

    // ✅ 댓글 목록 조회
    @GetMapping
    public List<Comment> getComments(@PathVariable Long portfolioId) {
        return commentService.getCommentsByPostId(portfolioId);
    }

    // ✅ 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestParam String studentId,
            @RequestBody String newText) {

        if (newText != null && newText.startsWith("\"") && newText.endsWith("\"")) {
            newText = newText.substring(1, newText.length() - 1);
        }

        commentService.updateComment(id, studentId, newText);
        return ResponseEntity.ok().build();
    }

    // ✅ 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @RequestParam String studentId) {
        commentService.deleteComment(id, studentId);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class CommentRequest {
        private String studentId;
        private String text;
        private boolean anonymous;
    }
}
