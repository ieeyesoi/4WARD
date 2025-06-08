package com.example.ws4wardback.service;

import com.example.ws4wardback.entity.Schedule;
import com.example.ws4wardback.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public Schedule saveSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public List<Schedule> getSchedulesByStudentId(String studentId) {
        return scheduleRepository.findByStudentId(studentId);
    }

    public void deleteById(Long id, String requesterId) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다."));

        if (!schedule.getStudentId().equals(requesterId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        scheduleRepository.delete(schedule);
    }

    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("일정을 찾을 수 없습니다. ID: " + id));
    }
}
