package com.connect.start.security;

import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
	
	private final String SECRET="jkdsfuiefverfuyeufijfudsgfudsfuiy767868e83erjkfjkgds78f687f68rjkbj";
	
	// For short time
	private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15;
	
	// For long time
	private final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60;
	
	
	public String generateAccessToken(String userId) {
		return Jwts.builder()
				.setSubject(userId)
				.claim("type", "ACCESS")
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis()+ACCESS_TOKEN_EXPIRATION))
				.signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
				.compact();
		
	}
	
	public String generateRefreshToken(String userId) {
		return Jwts.builder()
				.setSubject(userId)
				.claim("type", "REFRESH")
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis()+REFRESH_TOKEN_EXPIRATION))
				.signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
				.compact();
	}
	
	public String getEmailFromToken(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(SECRET.getBytes())
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
	}

}
