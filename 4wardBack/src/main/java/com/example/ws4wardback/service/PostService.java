package com.example.ws4wardback.service;

import com.example.ws4wardback.entity.Post;
import com.example.ws4wardback.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Post save(Post post) {
        return postRepository.save(post);
    }

    public List<Post> findAll() {
        return postRepository.findAll();
    }

    public Optional<Post> findById(Long id) {
        return postRepository.findById(id);
    }

    // 🔥 게시글 삭제
    public void delete(Long id, String requesterId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 글이 없습니다."));

        if (!post.getStudentId().equals(requesterId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        postRepository.delete(post);
    }

    // 🔥 게시글 수정
    public void update(Long id, String requesterId, Post updatedPostData) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 글이 없습니다."));

        if (!post.getStudentId().equals(requesterId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        post.setTitle(updatedPostData.getTitle());
        post.setContent(updatedPostData.getContent());
        post.setCategory(updatedPostData.getCategory());

        postRepository.save(post);
    }
    @Transactional
    public void incrementViewCount(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글 없음"));
        post.setViews(post.getViews() + 1);
        postRepository.save(post);
    }

    public Post getLatestPost() {
        return postRepository.findTopByOrderByCreatedAtDesc();
    }
}
