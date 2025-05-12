package com.example.demo.Repository;

import com.example.demo.Model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission,Long> {
    List<Submission> findByHandle(String username);
}
