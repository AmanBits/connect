package com.connect.start.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.connect.start.entity.User;
import com.connect.start.repository.UserRepository;
import com.connect.start.service.RefreshTokenService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;


@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    public OAuth2SuccessHandler(JwtTokenProvider jwtTokenProvider, UserRepository userRepository,RefreshTokenService refreshTokenService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.refreshTokenService=refreshTokenService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Example: get email from OAuth2 provider
        String email = oAuth2User.getAttribute("email");

        // Fetch or create local user
        User user = userRepository.findByEmail(email)
                      .orElseGet(() -> {
                          User newUser = new User();
                          newUser.setEmail(email);
                          newUser.setRole("USER");
                          newUser.setEnabled(true);
                          return userRepository.save(newUser);
                      });

        // Generate JWT using your CustomUserDetails wrapper
        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        
        
     // 1️⃣ Generate access token
        String accessToken = jwtTokenProvider.generateAccessToken(customUserDetails);
        jwtTokenProvider.addAccessTokenCookie(response, accessToken);

        // 2️⃣ Generate refresh token
        String refreshToken = jwtTokenProvider.generateRefreshToken(customUserDetails);

        // 3️⃣ Save refresh token in Redis (7 days)
        refreshTokenService.saveToken(refreshToken, user.getId().toString(), 7 * 24 * 3600);

        // 4️⃣ Send refresh token as HttpOnly cookie
        Cookie rtCookie = new Cookie("REFRESH_TOKEN", refreshToken);
        rtCookie.setHttpOnly(true);
        rtCookie.setPath("/");
        rtCookie.setMaxAge(7 * 24 * 3600);
        response.addCookie(rtCookie);

        // 5️⃣ Redirect to frontend
        response.sendRedirect("http://localhost:5173/dashboard");
       
    }
}
