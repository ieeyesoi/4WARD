package com.example.ws4wardback.service;
import com.example.ws4wardback.repository.UserRepository;

import com.example.ws4wardback.entity.Comment;
import com.example.ws4wardback.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public Comment addComment(String studentId, String text, Long postId, boolean anonymous) {
        Comment comment = Comment.builder()
                .studentId(studentId)
                .text(text)
                .postId(postId)
                .anonymous(anonymous)
                .createdAt(LocalDateTime.now())
                .build();

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);

        for (Comment comment : comments) {
            if (comment.isAnonymous()) {
                comment.setAuthorName("익명");
            } else {
                userRepository.findByStudentId(comment.getStudentId())
                        .ifPresent(user -> comment.setAuthorName(
                                comment.getStudentId().substring(2, 4) + " " + user.getName()));
            }
        }

        return comments;
    }



    public void updateComment(Long id, String studentId, String newText) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        if (!comment.getStudentId().equals(studentId)) {
            throw new RuntimeException("작성자만 수정 가능");
        }

        comment.setText(newText);
        commentRepository.save(comment);
    }

    public void deleteComment(Long id, String studentId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글 없음"));

        if (!comment.getStudentId().equals(studentId)) {
            throw new RuntimeException("작성자만 삭제 가능");
        }

        commentRepository.delete(comment);
    }
}
