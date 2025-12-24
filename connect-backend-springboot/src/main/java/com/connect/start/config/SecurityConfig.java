package com.connect.start.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.connect.start.repository.UserRepository;
import com.connect.start.security.CustomOAuth2UserService;
import com.connect.start.security.JwtAuthenticationFilter;
import com.connect.start.security.JwtTokenProvider;
import com.connect.start.security.OAuth2SuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtTokenProvider jwtProvider;
	private final UserRepository userRepo;
	private final CustomOAuth2UserService oauthService;
	private final OAuth2SuccessHandler successHandler;
	
	  @Bean
	    public BCryptPasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }

	public SecurityConfig(JwtTokenProvider jwtProvider, UserRepository userRepo, CustomOAuth2UserService oauthService,
			OAuth2SuccessHandler successHandler) {
		this.jwtProvider = jwtProvider;
		this.userRepo = userRepo;
		this.oauthService = oauthService;
		this.successHandler = successHandler;
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.addAllowedOriginPattern("*");
		configuration.addAllowedMethod("*");
		configuration.addAllowedHeader("*");
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors();
		http.authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**", "/oauth2/**", "/ws/**").permitAll()
				.anyRequest().authenticated())
				.oauth2Login(oauth -> oauth.userInfoEndpoint(u -> u.oidcUserService(this.oauthService))
						.successHandler(successHandler));

		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
	


}
