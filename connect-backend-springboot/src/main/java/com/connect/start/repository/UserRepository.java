package com.connect.start.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.connect.start.entity.User;
import java.util.List;



@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
   Optional<User> findByEmail(String email);
   Optional<User> findById(UUID userId);
}
