package com.connect.start.dto;

import org.springframework.web.socket.WebSocketSession;

public class UserConnection {
    private WebSocketSession session;
    private String fullName;
    private Location location;
    private String picture;
	public UserConnection(WebSocketSession session, Location location) {
		super();
		this.session = session;
		
		this.location = location;
		
	}
	public WebSocketSession getSession() {
		return session;
	}
	public void setSession(WebSocketSession session) {
		this.session = session;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
	}
   
   

}
