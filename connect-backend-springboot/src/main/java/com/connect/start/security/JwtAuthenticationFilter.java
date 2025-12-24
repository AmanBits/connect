package com.connect.start.security;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.connect.start.entity.User;
import com.connect.start.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private JwtTokenProvider jwtProvider;
	private UserRepository userRepo;
	
	
	

	public JwtAuthenticationFilter(JwtTokenProvider jwtProvider, UserRepository userRepo) {
		super();
		this.jwtProvider = jwtProvider;
		this.userRepo = userRepo;
	}




	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
	
		String header = request.getHeader("Authorization");
		
		
		
		if(header !=null && header.startsWith("Bearer ")) {
			
			    String token = header.substring(7);
			    String userId = jwtProvider.getEmailFromToken(token);
			    UUID uid = UUID.fromString(userId);
			    User user = userRepo.findById(uid).orElse(null);
			    
			    if(user!=null) {
			    	UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null,List.of());
			    	SecurityContextHolder.getContext().setAuthentication(auth);
			    }
			    
		}
		
		
		
		filterChain.doFilter(request, response);

	}
	
	

}
