package com.example.ws4wardback.service;

import com.example.ws4wardback.entity.User;
import com.example.ws4wardback.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입 처리
    public String registerUser(User user) {
        if (userRepository.findByStudentId(user.getStudentId()).isPresent()) {
            return "EXISTS"; // 중복 학번이면 "EXISTS" 반환
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수입니다.");
        }

        System.out.println("받은 유저 정보:");
        System.out.println("studentId = " + user.getStudentId());
        System.out.println("password = " + user.getPassword());
        System.out.println("name = " + user.getName());         // ✅ 추가
        System.out.println("major = " + user.getMajor());
        System.out.println("year = " + user.getYear());
        System.out.println("semester = " + user.getSemester());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // ✅ name, year, semester, major 등은 이미 들어가 있으므로 따로 setXxx 안 해도 됨
        userRepository.save(user);

        return "SUCCESS";
    }


    // 학번으로 사용자 조회
    public User findByStudentId(String studentId) {
        return userRepository.findByStudentId(studentId).orElse(null);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }


}
