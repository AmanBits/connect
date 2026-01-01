package com.connect.start.controller;

import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.connect.start.dto.LoginRequest;
import com.connect.start.dto.SignupRequest;
import com.connect.start.entity.User;
import com.connect.start.repository.UserRepository;
import com.connect.start.security.CustomUserDetails;
import com.connect.start.security.JwtTokenProvider;
import com.connect.start.service.Auth;
import com.connect.start.service.RefreshTokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtProvider;
	private final PasswordEncoder passwordEncoder;
	private final UserRepository userRepository;
	private final RefreshTokenService refreshTokenService;
	private final Auth authService;

	public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtProvider,
			PasswordEncoder passwordEncoder, UserRepository userRepository, RefreshTokenService refreshTokenService,Auth authService) {
		this.authenticationManager = authenticationManager;
		this.jwtProvider = jwtProvider;
		this.passwordEncoder = passwordEncoder;
		this.userRepository = userRepository;
		this.refreshTokenService = refreshTokenService;
		this.authService=authService;
	}


	@PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> signup(
	        @RequestParam String email,
	        @RequestParam String password,
	        @RequestParam String fullname,
	        @RequestParam String username,
	        @RequestParam(required = false) String phone,
	        @RequestParam(required = false) String location,
	        @RequestPart(required = false) MultipartFile profileImage
	) {
	    authService.signup(
	        email, password, fullname, username, phone, location, profileImage
	    );
	    return ResponseEntity.ok().build();
	}


	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {

		System.out.println("This is : " + request.getEmail());
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

		String accessToken = jwtProvider.generateToken(user);

		String refreshToken = jwtProvider.generateRefreshToken(user);

		refreshTokenService.saveToken(refreshToken, user.getId().toString(), 7 * 24 * 3600);

		jwtProvider.addTokenToCookie(response, accessToken);

		Cookie rtCookie = new Cookie("REFRESH_TOKEN", refreshToken);
		rtCookie.setHttpOnly(true);
		rtCookie.setPath("/");
		rtCookie.setMaxAge(7 * 24 * 3600); // 7 days
		response.addCookie(rtCookie);

		return ResponseEntity.ok("Login successful");
	}

	private String extractRefreshToken(HttpServletRequest request) {

		if (request.getCookies() == null) {
			return null;
		}

		for (Cookie cookie : request.getCookies()) {
			if ("refresh_token".equals(cookie.getName())) {
				return cookie.getValue();
			}
		}

		return null;
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {

		Cookie[] cookies = request.getCookies();
		if (cookies == null)
			return ResponseEntity.status(401).body("No refresh token");

		String refreshToken = null;
		for (Cookie c : cookies) {
			if (c.getName().equals("REFRESH_TOKEN")) {

				refreshToken = c.getValue();
				break;
			}
		}

		if (refreshToken == null)
			return ResponseEntity.status(401).body("No refresh token");

		String userId = refreshTokenService.getUserId(refreshToken);

		if (userId == null)
			return ResponseEntity.status(401).body("Invalid refresh token");

		User user = userRepository.findById(UUID.fromString(userId)).orElseThrow();
		String newAccessToken = jwtProvider.generateToken(new CustomUserDetails(user));

		String newRefreshToken = jwtProvider.generateRefreshToken(new CustomUserDetails(user));
		refreshTokenService.saveToken(newRefreshToken, userId.toString(), 7 * 24 * 3600); // 7 days

		jwtProvider.addTokenToCookie(response, newAccessToken); // JWT cookie
		Cookie rtCookie = new Cookie("REFRESH_TOKEN", newRefreshToken);
		rtCookie.setHttpOnly(true);
		rtCookie.setPath("/");
		rtCookie.setMaxAge(7 * 24 * 3600);
		response.addCookie(rtCookie);

		return ResponseEntity.ok("Token refreshed");
	}

	@GetMapping("/me")
	public ResponseEntity<?> me(HttpServletRequest request) {

		String token = null;
		if (request.getCookies() != null) {
			for (Cookie c : request.getCookies()) {
				if ("access_token".equals(c.getName())) {
					token = c.getValue();
					break;
				}
			}
		}

		if (token == null) {
			return ResponseEntity.status(401).build();
		}

		String userId = jwtProvider.getUsername(token);
		User user = userRepository.findById(UUID.fromString(userId)).orElseThrow();

		return ResponseEntity.ok(user);
	}

	@PostMapping("/auth/logout")
	public ResponseEntity<?> logout(HttpServletResponse response) {
		// Clear the JWT cookie
		Cookie cookie = new Cookie("access_token", null);
		cookie.setHttpOnly(true);
		cookie.setSecure(false); // true if using HTTPS
		cookie.setPath("/");
		cookie.setMaxAge(0); // expire immediately
		response.addCookie(cookie);

		return ResponseEntity.ok("Logged out successfully");
	}
}
