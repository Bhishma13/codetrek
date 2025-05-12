package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Data
public class UserProfile {
    // Getters and Setters
    @Id
    @NotBlank(message = "Handle can not be empty")
    private String handle;  // Unique username on Codeforces
    @NotBlank(message = "Name can not be empty")
    private String firstName;
    private String lastName;
    @NotBlank(message = "Country can not be empty")
    private String country;
    private String city;
    @Min(value = 0,message = "Rating should not be empty")
    private int rating;
    @Min(value = 0,message = "Max rating should not be empty")
    private int maxRating;
    @NotBlank(message = "Rank can not be empty")
    private String rank;
    @NotBlank(message = "Max rank can not be empty")
    private String maxRank;
    private int contribution;
    @NotBlank(message = "Organization cannot be empty")
    private String organization;
    private String avatar;
    private String titlePhoto;
    @OneToMany(mappedBy = "userProfile",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonBackReference
    private List<Submission>listOfSubmission = new ArrayList<>();
}


