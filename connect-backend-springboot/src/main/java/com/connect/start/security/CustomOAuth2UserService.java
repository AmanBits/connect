package com.connect.start.security;

import java.util.Map;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.connect.start.dto.Profile;
import com.connect.start.entity.User;
import com.connect.start.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CustomOAuth2UserService extends OidcUserService {

	private UserRepository repo;

	public CustomOAuth2UserService(UserRepository repo) {
		super();
		this.repo = repo;
	}

	@Override
	public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
		 System.out.println("🔥🔥🔥 OIDC USER SERVICE CALLED 🔥🔥🔥");

	        OidcUser oidcUser = super.loadUser(userRequest);

	        String email = oidcUser.getEmail(); // user's email
	        String fullName = oidcUser.getFullName(); // full name from profile
	        String pictureUrl = oidcUser.getPicture(); // profile picture
	        
//	        Map<String, Object> claims = oidcUser.getClaims(); // all info Google sent
	        
	    
	        

	        repo.findByEmail(email).orElseGet(() -> {
	            User user = new User();
	            user.setEmail(email);
	            user.setName(fullName);
	            user.setPicture(pictureUrl);
	            user.setProvider("google");
	            return repo.save(user);
	        });

	        return oidcUser;
	}
	
	

//	@Override
//	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//		
//	    System.out.println("OAuth2User");
//	    
//		OAuth2User oauthUser = super.loadUser(userRequest);
//        
//		String email = oauthUser.getAttribute("email");
//
//		repo.findByEmail(email).orElseGet(() -> {
//			User user = new User();
//			user.setEmail(email);
//			user.setName(oauthUser.getAttribute("name"));
//			user.setProvider(userRequest.getClientRegistration().getRegistrationId());
//			return repo.save(user);
//		});
//
//		return oauthUser;
//	}

}
