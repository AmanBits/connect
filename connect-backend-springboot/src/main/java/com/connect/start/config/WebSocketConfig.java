package com.connect.start.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.connect.start.handler.WebSocketHandler;
import com.connect.start.security.JwtHandshakeInterceptor;


@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final JwtHandshakeInterceptor jwtInterceptor;
    private final WebSocketHandler handler;

    public WebSocketConfig(
            JwtHandshakeInterceptor jwtInterceptor,
            WebSocketHandler handler
    ) {
        this.jwtInterceptor = jwtInterceptor;
        this.handler = handler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(handler, "/ws")
                .addInterceptors(jwtInterceptor)
                .setAllowedOriginPatterns("*");
    }
}

