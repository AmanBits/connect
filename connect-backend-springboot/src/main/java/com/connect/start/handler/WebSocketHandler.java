package com.connect.start.handler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.connect.start.dto.Location;
import com.connect.start.dto.UserConnection;
import com.connect.start.entity.User;
import com.connect.start.security.JwtTokenProvider;
import com.connect.start.utility.GeoUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

	private final Map<String, UserConnection> users = new ConcurrentHashMap<>();
	private final ObjectMapper mapper = new ObjectMapper();

	private final ConcurrentHashMap<WebSocketSession, String> sessionToUserId = new ConcurrentHashMap<>();

	private User user;

	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		
		

		String token = Arrays.stream(session.getHandshakeHeaders().get("cookie").toString().split(";"))
				.map(String::trim).filter(c -> c.startsWith("ACCESS_TOKEN="))
				.map(c -> c.substring("ACCESS_TOKEN=".length())).findFirst().orElse(null);
		
		System.out.println("TOKEN : " + token);

		if (jwtTokenProvider.getEmailFromToken(token) == null) {
			session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Invalid Token"));
			return;
		}
		
		


		String userId = jwtTokenProvider.getEmailFromToken(token);

		sessionToUserId.put(session, userId);
		redisTemplate.opsForValue().set("presence:" + userId, "ONLINE", 30, TimeUnit.SECONDS);

//		users.put(session.getId(), new UserConnection(session, null));
//		System.out.println("Connected: " + session.getId());
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

		JsonNode node = mapper.readTree(message.getPayload());
		String type = node.get("type").asText();

		// HEARTBEAT FROM CLIENT

		String userId = sessionToUserId.get(session);

		if (userId != null) {
			redisTemplate.expire("presence:" + userId, 30, TimeUnit.SECONDS);
		}

//		switch (type) {
//		case "LOCATION" -> handleLocation(session, node);
//		case "MESSAGE" -> handleNearbyMessage(session, node);
//		default -> System.out.println("Unknown type: " + type);
//		}
	}

	private void handleLocation(WebSocketSession session, JsonNode node) throws Exception {
		UserConnection user = users.get(session.getId());
		if (user == null)
			return;

		double lat = node.get("latitude").asDouble();
		double lng = node.get("longitude").asDouble();

		user.setLocation(new Location(lat, lng));
		System.out.println("Location updated for " + session.getId());

		// 📌 After location update, send nearby users list
		List<String> nearbyUserIds = new ArrayList<>();
		for (UserConnection u : users.values()) {
			if (u.getSession().getId().equals(session.getId()))
				continue;
			if (u.getLocation() == null)
				continue;

			double distance = GeoUtil.distanceKm(lat, lng, u.getLocation().getLat(), u.getLocation().getLng());
			System.out.println("Checking " + u.getSession().getId() + " distance: " + distance);
			// 3 meter
			if (distance <= (3.0 / 1000.0))
				nearbyUserIds.add(u.getSession().getId());
		}

		// Send nearby list
		ObjectNode nearby = mapper.createObjectNode();
		nearby.put("type", "NEARBY_USERS");
		nearby.putPOJO("users", nearbyUserIds);

		session.sendMessage(new TextMessage(nearby.toString()));
	}

	private void handleNearbyMessage(WebSocketSession session, JsonNode node) throws Exception {

		UserConnection sender = users.get(session.getId());
		if (sender == null || sender.getLocation() == null)
			return;

		Location senderLoc = sender.getLocation();
		String text = node.get("message").asText();

		List<String> nearbyUserIds = new ArrayList<>();

		for (UserConnection user : users.values()) {

			if (user.getSession().getId().equals(session.getId()))
				continue;
			if (user.getLocation() == null)
				continue;

			double distance = GeoUtil.distanceKm(senderLoc.getLat(), senderLoc.getLng(), user.getLocation().getLat(),
					user.getLocation().getLng());

			if (distance <= 50 && user.getSession().isOpen()) {

				nearbyUserIds.add(user.getSession().getId());

				// ✅ Send MESSAGE as JSON
				ObjectNode msg = mapper.createObjectNode();
				msg.put("type", "MESSAGE");
				msg.put("from", session.getId());
				msg.put("message", text);

				user.getSession().sendMessage(new TextMessage(msg.toString()));
			}
		}

		// ✅ Send nearby users list to sender
		ObjectNode nearby = mapper.createObjectNode();
		nearby.put("type", "NEARBY_USERS");
		nearby.putPOJO("users", nearbyUserIds);

		session.sendMessage(new TextMessage(nearby.toString()));
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
		String userId = sessionToUserId.get(session);
		if (userId != null) {
			redisTemplate.delete("presence:" + userId);
		}
		users.remove(session.getId());
		System.out.println("Disconnected: " + session.getId());
	}
}
