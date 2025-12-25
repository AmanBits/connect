package com.connect.start.service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisSessionService {

	private static final String PREFIX = "refresh:";

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	public void save(String userId, String deviceId, String refreshToken, long ttlMs) {

		String key = PREFIX + userId + ":" + deviceId;
		
		redisTemplate.opsForValue().set(key, refreshToken, ttlMs, TimeUnit.MINUTES);
		
	}

	public boolean isValid(String userId, String deviceId, String refreshToken) {

		String key = PREFIX + userId + ":" + deviceId;
		String stored = (String) redisTemplate.opsForValue().get(key);
		return refreshToken.equals(stored);
	}

	public void remove(String userId, String deviceId) {
		redisTemplate.delete(PREFIX + userId + ":" + deviceId);
	}

	public void removeAll(String userId) {
		Set<String> keys = redisTemplate.keys(PREFIX + userId + ":*");
		if (keys != null) {
			redisTemplate.delete(keys);
		}

	}

}
