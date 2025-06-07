package com.example.ws4wardback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 5000)
    private String content;

    @Column(name = "student_id")
    private String studentId;  // 사용자 이름 또는 studentId

    @Transient
    private String authorName;


    private String category;

    @Column(nullable = false)
    private int views = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
}
