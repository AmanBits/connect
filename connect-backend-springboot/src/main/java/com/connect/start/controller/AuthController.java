package com.connect.start.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connect.start.dto.LoginRequest;
import com.connect.start.dto.SignupDTO;
import com.connect.start.entity.User;
import com.connect.start.repository.UserRepository;
import com.connect.start.security.JwtTokenProvider;
import com.connect.start.service.RedisSessionService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final UserRepository repo;
	private final JwtTokenProvider jwt;
	private final RedisSessionService redisSessionService;
	private final BCryptPasswordEncoder passwordEncoder;

	public AuthController(UserRepository repo, JwtTokenProvider jwt, RedisSessionService redisSessionService,
			BCryptPasswordEncoder passwordEncoder) {
		this.repo = repo;
		this.jwt = jwt;
		this.redisSessionService = redisSessionService;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/signup")
	public ResponseEntity<String> signup(@RequestBody SignupDTO req) {
		
		if (repo.findByEmail(req.getEmail()).isPresent()) {
			return ResponseEntity.ok("user already exist");
		}

		User us = new User();
		us.setEmail(req.getEmail());
		us.setPasswrod(passwordEncoder.encode(req.getPassword()));
		us.setName(req.getName());

		repo.save(us);

		return ResponseEntity.ok("Signup Success");

	}

	@PostMapping("/login")
	public Map<String, String> login(@RequestBody LoginRequest req,
			@RequestHeader(value = "Device-Id", required = false) String deviceId) {

		System.out.println("***** LOGIN CONTROLLER START *********");

		User user = repo.findByEmail(req.getEmail()).orElseThrow();

		if (!new BCryptPasswordEncoder().matches(req.getPassword(), user.getPasswrod())) {
			throw new RuntimeException("Invalid credentials");
		}
		

		System.out.println("***** LOGIN CONTROLLER END *********");

		String accessToken = jwt.generateAccessToken(user.getId().toString());
		String refreshToken = jwt.generateRefreshToken(user.getId().toString());

		// Set Refresh Token in Redis

		redisSessionService.save(user.getId().toString(), deviceId, refreshToken, 200);

		return Map.of("accessToken", accessToken, "refreshToken", refreshToken);

	}

}
