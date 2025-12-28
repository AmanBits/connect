package com.connect.start.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private JwtTokenProvider jwt;

	public OAuth2SuccessHandler(JwtTokenProvider jwt) {
		super();
		this.jwt = jwt;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		OAuth2User user = (OAuth2User) authentication.getPrincipal();
		String email = user.getAttribute("email");
		
//		String token = jwt.generateAccessToken(13hsadgj-213123bnvn-123123,email,"USER");
		response.sendRedirect("http://localhost:5173/oauth-success?token=" + "sadjksdgj786876");

	}

}
