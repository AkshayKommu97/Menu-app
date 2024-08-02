// src/main/java/com/app/menu/handler/MyWebSocketHandler.java
package com.app.menu.handler;

import com.app.menu.model.CartItem;
import com.app.menu.repositories.CartItemRepository;

// src/main/java/com/example/demo/handler/MyWebSocketHandler.java

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MyWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
        System.out.println("New WebSocket connection: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        try {
            // Attempt to parse as JSON
            Map<String, Object> messageMap = objectMapper.readValue(payload, Map.class);
            String room = (String) messageMap.get("room");
            CartItem cartItem = parseCartItem((String) messageMap.get("cartItem"));

            if (cartItem != null) {
                CartItem existingItem = cartItemRepository.findByItemId(cartItem.getItemId());
                if (existingItem != null) {
                    existingItem.setQuantity(cartItem.getQuantity());
                    cartItemRepository.save(existingItem);
                } else {
                    cartItemRepository.save(cartItem);
                }

                // Broadcast the cart update to all users in the same room
                broadcastToRoom(room, message);
            }
        } catch (IOException e) {
            System.out.println("Non-JSON message received: " + payload);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    private void broadcastToRoom(String room, TextMessage message) throws IOException {
        for (WebSocketSession wsSession : sessions.values()) {
            if (wsSession.isOpen()) {
                wsSession.sendMessage(message);
            }
        }
    }

    private CartItem parseCartItem(String payload) {
        try {
            return objectMapper.readValue(payload, CartItem.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}