package com.connect.start.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.connect.start.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {
   Optional<User> findByEmail(String email);
   boolean existsByEmail(String email);
}
