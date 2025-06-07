package com.example.ws4wardback.controller;

import com.example.ws4wardback.entity.Schedule;
import com.example.ws4wardback.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return scheduleService.saveSchedule(schedule);
    }

    // ✅ studentId가 있을 때만 동작
    @GetMapping(params = "studentId")
    public List<Schedule> getSchedulesByStudentId(@RequestParam String studentId) {
        return scheduleService.getSchedulesByStudentId(studentId);
    }

    // ✅ studentId가 없을 때만 동작
    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id, @RequestParam String studentId) {
        scheduleService.deleteById(id, studentId);
    }

    @GetMapping("/{id}")
    public Schedule getScheduleById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id);
    }
}
