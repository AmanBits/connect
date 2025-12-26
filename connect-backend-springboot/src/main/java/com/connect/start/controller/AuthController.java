package com.connect.start.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
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

import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private AuthenticationManager authenticationManager;

	private final UserRepository repo;
	private final JwtTokenProvider jwt;
	private final RedisSessionService redisSessionService;
	private final BCryptPasswordEncoder passwordEncoder;

	public AuthController(AuthenticationManager authenticationManager,UserRepository repo, JwtTokenProvider jwt, RedisSessionService redisSessionService,
			BCryptPasswordEncoder passwordEncoder) {
		this.repo = repo;
		this.jwt = jwt;
		this.redisSessionService = redisSessionService;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager=authenticationManager;
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
	public ResponseEntity<Map<String, String>> login(
	        @RequestBody LoginRequest req,
	        @RequestHeader(value = "Device-Id", required = false) String deviceId
	) {

	   
	    Authentication authentication = authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(
	                    req.getEmail(),
	                    req.getPassword()
	            )
	    );

	  
	    UserDetails user = (UserDetails) authentication.getPrincipal();

	  
	    String accessTokenValue = jwt.generateAccessToken(user.getUsername());

	    ResponseCookie accessToken = ResponseCookie.from("ACCESS_TOKEN", accessTokenValue)
	            .httpOnly(true)
	            .secure(false) 
	            .path("/")
	            .sameSite("Lax")
	            .maxAge(15 * 60) // 15 minutes
	            .build();

	    ResponseCookie refreshToken = ResponseCookie.from("REFRESH_TOKEN", accessTokenValue)
	            .httpOnly(true)
	            .secure(false)
	            .path("/")
	            .maxAge(7 * 24 * 60 * 60) // 7 days
	            .build();

	 
	    redisSessionService.save(
	            user.getUsername(),
	            deviceId,
	            refreshToken.getValue(),
	            7 * 24 * 60 * 60
	    );

	    return ResponseEntity.ok()
	            .header(HttpHeaders.SET_COOKIE, accessToken.toString())
	            .header(HttpHeaders.SET_COOKIE, refreshToken.toString())
	            .body(Map.of("message", "Login Successful"));
	}



	@PostMapping("/logout")
	public void logout(Authentication auth, @RequestHeader("Device-Id") String deviceId) {
		String userId = auth.getName();
		redisSessionService.remove(userId, deviceId);
	}

}
