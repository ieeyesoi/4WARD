package com.example.ws4wardback.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId;
    private String title;
    private String date;   // 형식: YYYY-MM-DD
    private String time;   // 형식: HH:mm
    private String description;
}
