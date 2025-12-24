package com.connect.start.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connect.start.dto.MessageDTO;
import com.connect.start.entity.Message;
import com.connect.start.entity.User;
import com.connect.start.repository.MessageRepository;
import com.connect.start.repository.UserRepository;
import com.connect.start.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/v1")
public class MessageController {
	
	
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	
	@Autowired
	private UserRepository repo;
	
	
	@Autowired
	private MessageRepository msgRepo;
	
	@PostMapping("/sendMessage")
	public ResponseEntity<String> sendMessage(@RequestHeader("Authorization") String authHeader,@RequestBody MessageDTO message) {
		
		String token = authHeader.replace("Bearer ", "");
		UUID recieved = message.getRecieverId();
		String type=message.getType();
		String status=message.getStatus();
		String timestamp=message.getTimestamp();
		String content = message.getContent();
		
		String email = jwtTokenProvider.getEmailFromToken(token);
		
		User user = repo.findByEmail(email).orElse(null);
		
		UUID uid = user.getId();
		
		Message msg = new Message(uid,recieved,type,content,status,timestamp);
		
		msgRepo.save(msg);
		
		
		return ResponseEntity.ok("Success");
	}

}
