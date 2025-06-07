package com.example.ws4wardback.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> category;


    private String title;

    private String author;

    private String language;

    private String date;

    private String github;

    private String tags;

    @Lob
    private String description;

    @Column(nullable = true)
    private String imageUrl;

    @Column(nullable = false)
    private String studentId;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }



}
