package com.connect.start.dto;

public class UserSessionDTO {

	private Long userId;
	private String email;

	public UserSessionDTO(Long userId, String email) {
		super();
		this.userId = userId;
		this.email = email;
	}

	public Long getUserId() {
		return userId;
	}

	public UserSessionDTO() {
		super();
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
