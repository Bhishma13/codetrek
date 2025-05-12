package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String handle;
    private String SubmissionId;
    private String problemName;
    private int problemRating;
    private String verdict;
    private String programmingLanguage;
    private int timeConsumedMillis;
    private int memoryConsumedBytes;
    @ManyToOne
    @JoinColumn(name = "user_profile_id")
    @JsonManagedReference
    private UserProfile userProfile;
}
