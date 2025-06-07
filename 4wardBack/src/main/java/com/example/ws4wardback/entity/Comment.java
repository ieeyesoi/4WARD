package com.example.ws4wardback.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId;

    @Column(length = 1000)
    private String text;

    private LocalDateTime createdAt;

    private Long postId;

    @Transient
    private String authorName;  // 이름 (DB 저장 X)

    private boolean anonymous;
}
