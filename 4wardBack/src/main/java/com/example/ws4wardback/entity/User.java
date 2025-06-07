package com.example.ws4wardback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String studentId;

    @Column(nullable = false)
    private String password;

    @Column
    private String name;

    @Column(nullable = false)
    private String major;

    @Column
    private String year;

    @Column
    private String semester;

    @Column
    private String techStack;

    @Column
    private String github;

}
