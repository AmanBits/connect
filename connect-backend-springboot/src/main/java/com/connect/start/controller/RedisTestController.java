package com.connect.start.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connect.start.dto.UserSessionDTO;
import com.connect.start.service.RedisService;

@RestController
@RequestMapping("/redis")
public class RedisTestController {
	
	
	@Autowired
	private RedisService redisService;
	
	@GetMapping("/set")
	public String set() {
		redisService.saveSession("session:2", new UserSessionDTO(2L,"mark@gmail.com"));
		return "saved";
		
	}
	
	

}
