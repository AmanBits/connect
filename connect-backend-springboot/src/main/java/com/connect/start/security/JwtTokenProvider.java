package com.connect.start.security;

import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    private final String SECRET = "jkdsfuiefverfuyeufijfudsgfudsfuiy767868e83erjkfjkgds78f687f68rjkbj";

    private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 15; // 15 min
    private final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7; // 7 days

    // -------------------- GENERATE TOKENS --------------------

    public String generateAccessToken(UUID userId,String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .setId(UUID.randomUUID().toString()) // jti
                .claim("userId", userId.toString())
                .claim("type", "ACCESS")
                .claim("role", role)                // optional, for auth
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }

    public String generateRefreshToken(UUID userId, String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .setId(UUID.randomUUID().toString()) // jti
                .claim("userId", userId)
                .claim("type", "REFRESH")
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .compact();
    }

    // -------------------- VALIDATE TOKEN --------------------

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token expired: " + e.getMessage());
            return false;
        } catch (JwtException e) {
            System.out.println("Invalid token: " + e.getMessage());
            return false;
        }
    }

    // -------------------- PARSE TOKEN --------------------

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getEmailFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    public String getTokenType(String token) {
        return parseClaims(token).get("type", String.class);
    }

    public String getJti(String token) {
        return parseClaims(token).getId();
    }

}
