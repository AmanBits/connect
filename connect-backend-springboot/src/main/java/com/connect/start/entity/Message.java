package com.connect.start.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Message {

	@Id
	@GeneratedValue
	private UUID messageId;
	
	private UUID senderId;
	
	private UUID recieverId;
	
	private String type;
	
	private String content;
	
	
	private String status;
	
	private String timestamp;
	
	
	public Message() {

	}

	public Message( UUID senderId, UUID recieverId, String type, String content, String status,
			String timestamp) {
		super();
		
		this.senderId = senderId;
		this.recieverId = recieverId;
		this.type = type;
		this.content = content;
		this.status = status;
		this.timestamp = timestamp;
	}

	public UUID getMessageId() {
		return messageId;
	}

	public void setMessageId(UUID messageId) {
		this.messageId = messageId;
	}

	public UUID getSenderId() {
		return senderId;
	}

	public void setSenderId(UUID senderId) {
		this.senderId = senderId;
	}

	public UUID getRecieverId() {
		return recieverId;
	}

	public void setRecieverId(UUID recieverId) {
		this.recieverId = recieverId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	
	

	
	
}
