package com.connect.start.handler;


import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.security.core.userdetails.UserDetails;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final ConcurrentHashMap<String, WebSocketSession> sessions =
            new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {

        UserDetails user =
                (UserDetails) session.getAttributes().get("USER");

        if (user == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE);
            return;
        }

        sessions.put(session.getId(), session);

        System.out.println("WS CONNECTED: " + user.getUsername());
    }

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message) throws IOException {

        UserDetails user =
                (UserDetails) session.getAttributes().get("USER");

        System.out.println(
            "Message from " + user.getUsername() + ": " + message.getPayload()
        );

        session.sendMessage(
            new TextMessage("Hello " + user.getUsername())
        );
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status) {

        sessions.remove(session.getId());
        System.out.println("WS CLOSED: " + session.getId());
    }
}
