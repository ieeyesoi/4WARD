package com.example.ws4wardback.controller;

import com.example.ws4wardback.entity.Post;
import com.example.ws4wardback.repository.PostRepository;
import com.example.ws4wardback.repository.UserRepository;
import com.example.ws4wardback.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://127.0.0.1:5500") // 프론트 포트랑 맞추기
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;
    // 필드 추가
    private final UserRepository userRepository;


    @PostMapping
    public Post createPost(@RequestBody Post post) {
        if ("anonymous".equals(post.getStudentId())) {
            post.setAuthorName("익명");
        } else {
            userRepository.findByStudentId(post.getStudentId()).ifPresent(user -> {
                String yearTwoDigit = post.getStudentId().substring(2, 4);
                post.setAuthorName(yearTwoDigit + " " + user.getName());
            });
        }

        return postService.save(post);
    }


    @GetMapping
    public List<Post> getAllPosts() {
        List<Post> posts = postService.findAll();

        for (Post post : posts) {
            userRepository.findByStudentId(post.getStudentId()).ifPresent(user -> {
                String yearTwoDigit = post.getStudentId().substring(2, 4);  // 예: "2023041010" → "23"
                post.setAuthorName(yearTwoDigit + " " + user.getName());
            });
        }

        return posts;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Optional<Post> optionalPost = postService.findById(id);

        if (optionalPost.isEmpty()) return ResponseEntity.notFound().build();

        Post post = optionalPost.get();

        // 🔽 익명 여부 판단
        if ("anonymous".equals(post.getStudentId())) {
            post.setAuthorName("익명");
        } else {
            userRepository.findByStudentId(post.getStudentId()).ifPresent(user -> {
                String yearTwoDigit = post.getStudentId().substring(2, 4);
                post.setAuthorName(yearTwoDigit + " " + user.getName());
            });
        }

        return ResponseEntity.ok(post);
    }


    // 🔥 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            @RequestParam String studentId) {

        postService.delete(id, studentId);
        return ResponseEntity.ok().build();
    }

    // 🔥 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestParam String studentId,
            @RequestBody Post updatedPost) {

        postService.update(id, studentId, updatedPost);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/views")
    public ResponseEntity<Void> incrementViews(@PathVariable Long id) {
        postService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/latest")
    public ResponseEntity<Post> getLatestPost() {
        Post latest = postService.getLatestPost();
        if (latest == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(latest);
    }


}
