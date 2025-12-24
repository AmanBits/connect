package com.connect.start.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.connect.start.entity.Message;


@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

}
