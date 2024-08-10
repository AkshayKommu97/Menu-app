package com.app.menu.controller;

import com.app.menu.model.CartItem;
import com.app.menu.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CartWebSocketController {

    @Autowired
    private CartService cartService;

    // Method to handle adding or updating a cart item
    @MessageMapping("/cart")
    @SendTo("/topic/cart")
    public CartItem handleCartAction(CartItem cartItem) {
        // Save or update the cart item
        CartItem updatedCartItem = cartService.saveOrUpdateCartItem(cartItem);
        return updatedCartItem; // Broadcast to all subscribers of /topic/cart
    }

    // Method to handle removing a cart item
    @MessageMapping("/cart/remove")
    @SendTo("/topic/cart")
    public CartItem handleCartRemoval(CartItem cartItem) {
        // Remove the cart item from the database
        cartService.deleteCartItem(cartItem.getId());
        return cartItem; // Broadcast the removed item to all subscribers of /topic/cart
    }
}
