package com.example.ws4wardback.controller;

import com.example.ws4wardback.entity.User;
import com.example.ws4wardback.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody User user) {
        String result = userService.registerUser(user);
        if ("EXISTS".equals(result)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 가입된 학번입니다.");
        }

        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginUser) {
        User user = userService.findByStudentId(loginUser.getStudentId());

        if (user != null && passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
            return ResponseEntity.ok("로그인 성공");
        } else {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }

    @GetMapping("/user/{studentId}")
    public ResponseEntity<User> getUserInfo(@PathVariable String studentId) {
        User user = userService.findByStudentId(studentId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/user/{studentId}")
    public ResponseEntity<String> updateUser(
            @PathVariable String studentId,
            @RequestBody User updatedUser) {

        User user = userService.findByStudentId(studentId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setYear(updatedUser.getYear());
        user.setSemester(updatedUser.getSemester());
        user.setMajor(updatedUser.getMajor());
        user.setTechStack(updatedUser.getTechStack());
        user.setGithub(updatedUser.getGithub());

        userService.saveUser(user); // 이 메서드도 UserService에 만들어야 함
        return ResponseEntity.ok("업데이트 완료");
    }



}
