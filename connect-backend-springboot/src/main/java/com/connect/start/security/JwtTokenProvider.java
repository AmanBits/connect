package com.connect.start.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtTokenProvider {

    // ✅ 64+ bytes secret (OK for HS512)
    private static final String SECRET =
        "sdjfjksgdftdyuftuy786876378bsdf98908d0ffjljfdjfdsf76273672367263968128sf867jekwhrehkjhdydsf7dskhfdjf";

    // ✅ SINGLE KEY used everywhere
    private static final SecretKey KEY =
        Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    // ===================== ACCESS TOKEN =====================
    public String generateAccessToken(CustomUserDetails user) {
        return Jwts.builder()
            .setSubject(user.getId().toString()) // USER ID ONLY
            .claim("email", user.getUsername())
            .claim("roles",
                user.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .toList()
            )
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 min
            .signWith(KEY, SignatureAlgorithm.HS512)
            .compact();
    }

    // ===================== REFRESH TOKEN =====================
    public String generateRefreshToken(CustomUserDetails user) {
        return Jwts.builder()
            .setSubject(user.getId().toString())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000)) // 7 days
            .signWith(KEY, SignatureAlgorithm.HS512)
            .compact();
    }

    // ===================== VALIDATION =====================
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ===================== EXTRACT USER ID =====================
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

    // ===================== COOKIE HELPERS =====================
    public void addAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(false);      // ✅ MUST be true
        cookie.setSecure(false);       // true in HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(15 * 60);     // 15 minutes
        response.addCookie(cookie);
    }


}
