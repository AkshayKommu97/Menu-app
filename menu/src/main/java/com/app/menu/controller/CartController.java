// src/main/java/com/app/menu/controller/CartController.java
package com.app.menu.controller;

import com.app.menu.model.CartItem;
import com.app.menu.repositories.CartItemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @MessageMapping("/cart")
    @SendTo("/topic/cart/{room}")
    public CartItem handleCartAction(String payload) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        CartAction cartAction = objectMapper.readValue(payload, CartAction.class);
        CartItem cartItem = cartAction.getCartItem();

        // Save or update the cart item in MongoDB
        cartItemRepository.save(cartItem);

        // Return the cart item to broadcast the update
        return cartItem;
    }

    private static class CartAction {
        private String room;
        private CartItem cartItem;

        // Getters and setters
        public String getRoom() {
            return room;
        }

        public void setRoom(String room) {
            this.room = room;
        }

        public CartItem getCartItem() {
            return cartItem;
        }

        public void setCartItem(CartItem cartItem) {
            this.cartItem = cartItem;
        }
    }
}
