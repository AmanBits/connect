package com.connect.start.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwt;
	private final CustomUserDetailsService service;

	JwtAuthenticationFilter(JwtTokenProvider jwt, CustomUserDetailsService service) {
		this.jwt = jwt;
		this.service = service;
	}

	private String extractFromCookie(HttpServletRequest request) {

		if (request.getCookies() == null) {
			return null;
		}

		for (Cookie cookie : request.getCookies()) {
			if ("access_token".equals(cookie.getName())) {
				return cookie.getValue();
			}
		}

		return null;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		String token = extractFromCookie(req);

		if (token != null) {
			String email = jwt.getUsername(token);
			UserDetails user = service.loadUserByUsername(email);

			UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null,
					user.getAuthorities());

			SecurityContextHolder.getContext().setAuthentication(auth);
		}

		chain.doFilter(req, res);
	}

}
