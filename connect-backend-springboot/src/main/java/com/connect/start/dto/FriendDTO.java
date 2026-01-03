package com.connect.start.dto;

import java.util.UUID;

public class FriendDTO {

    private UUID friendshipId;
    private UUID userId;
    private String fullname;
    private String username;
    private boolean online;
    private String profileImageUrl;

    public FriendDTO(
        UUID friendshipId,
        UUID userId,
        String fullname,
        String username,
        String profileImageUrl
    ) {
        this.friendshipId = friendshipId;
        this.userId = userId;
        this.fullname = fullname;
        this.username = username;
        this.profileImageUrl = profileImageUrl;
        this.online = false; // default
    }

	public UUID getFriendshipId() {
		return friendshipId;
	}

	public void setFriendshipId(UUID friendshipId) {
		this.friendshipId = friendshipId;
	}

	public UUID getUserId() {
		return userId;
	}

	public void setUserId(UUID userId) {
		this.userId = userId;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public boolean isOnline() {
		return online;
	}

	public void setOnline(boolean online) {
		this.online = online;
	}

	public String getProfileImageUrl() {
		return profileImageUrl;
	}

	public void setProfileImageUrl(String profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}

    // getters & setters
    
    
    
}
