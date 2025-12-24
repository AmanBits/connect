package com.connect.start.dto;

public class Profile {
	
	
	private String name;
	
	private String picture;

	public Profile(String name, String picture) {
		super();
		this.name = name;
		this.picture = picture;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}
	
	
	

}
