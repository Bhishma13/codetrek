package com.example.demo.Repository;

import com.example.demo.Model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile,String> {

    Optional<UserProfile>findByHandle(String username);
}
