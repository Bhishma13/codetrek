package com.example.demo.Controller;

import com.example.demo.Service.CodeforcesService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/codeforces")
public class CodeforcesController {
    @Autowired
    private CodeforcesService codeforcesService;

    @GetMapping("/performance/{username}")
    public ResponseEntity<Map<String, Object>> getUserPerformance(@PathVariable String username) {
        try {
            Map<String, Object> analysis = codeforcesService.analyzeUserPerformance(username);
            return new ResponseEntity<>(analysis, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/contestPerformance/{username}")
    public ResponseEntity<Map<String, Object>> getUserContestPerformance(@PathVariable String username) {
        try {
            Map<String, Object> analysis = codeforcesService.analyzeContestPerformance(username);
            return new ResponseEntity<>(analysis, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("Error", e.getMessage()));
        }
    }

    @GetMapping("/contestIdPerformance/{username}")
    public ResponseEntity<Map<String, Object>> getUserContestIdPerformance(@PathVariable String username) {
        try {
            Map<String, Object> analysis = codeforcesService.IndexPerformance(username);
            return new ResponseEntity<>(analysis, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("Error", e.getMessage()));
        }
    }

}
