package com.connect.start.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtTokenProvider {

	private static final String SECRET = "sdjfjksgdftdyuftuy786876378bsdf98908d0ffjljfdjfdsf8sf867jekwhrehkjhdydsf7dskhfdjf";

	private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

	public String generateToken(CustomUserDetails user) {
		return Jwts.builder().setSubject(user.getId().toString())
				.claim("email", user.getUsername())
				.claim("roles", user.getAuthorities().stream().map(a -> a.getAuthority()).toList())
				.setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000))
				.signWith(KEY).compact();
	}

	public String getUsername(String token) {
		if (token.startsWith("Bearer ")) {
			token = token.substring(7);
		}

		return Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8))).build()
				.parseClaimsJws(token).getBody().getSubject();
	}
	
	public String generateRefreshToken(CustomUserDetails userDetails) {
	    // Generate JWT with long expiration, e.g., 7 days
	    return Jwts.builder()
	            .setSubject(userDetails.getId().toString())
	            .setIssuedAt(new Date())
	            .setExpiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)) // 7 days
	            .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
	            .compact();
	}
	
	
	public UUID getUserId(String token) {
	    return UUID.fromString(
	        Jwts.parserBuilder()
	            .setSigningKey(KEY)
	            .build()
	            .parseClaimsJws(token)
	            .getBody()
	            .getSubject()
	    );
	}


	
	
	 public void addTokenToCookie(HttpServletResponse response, String token) {
	        Cookie cookie = new Cookie("access_token", token);
	        cookie.setHttpOnly(true);          // prevents JS access
	        cookie.setSecure(false);           // set true if using HTTPS
	        cookie.setPath("/");               // cookie valid for entire site
	        cookie.setMaxAge(60 * 60 * 24);    // 1 day in seconds
	        response.addCookie(cookie);
	    }

}
