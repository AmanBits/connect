package com.connect.start.service;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.connect.start.dto.UserSessionDTO;


@Service
public class RedisService {
	
	 private final RedisTemplate<String, Object> redisTemplate;
	 
	 public RedisService(RedisTemplate<String, Object> redisTemplate) {
	        this.redisTemplate = redisTemplate;
	    }
	 
	 public void saveSession(String key,UserSessionDTO session) {
		 redisTemplate.opsForValue().set(key,session,10,TimeUnit.MINUTES);
		 
	 }
	 
	  public UserSessionDTO getSession(String key) {
	        return (UserSessionDTO) redisTemplate.opsForValue().get(key);
	    }

	    public void deleteSession(String key) {
	        redisTemplate.delete(key);
	    }


}
