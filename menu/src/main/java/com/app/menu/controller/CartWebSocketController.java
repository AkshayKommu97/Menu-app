package com.app.menu.controller;

import com.app.menu.model.CartItem;
import com.app.menu.service.CartService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class CartWebSocketController {

    private final CartService cartService;
    private final SimpMessagingTemplate messagingTemplate;

    public CartWebSocketController(CartService cartService, SimpMessagingTemplate messagingTemplate) {
        this.cartService = cartService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/cart/fetch")
    @SendTo("/topic/cart")
    public List<CartItem> fetchCartItem() {
        return cartService.fetchCartItem();
    }

    @MessageMapping("/cart/add")
    public void addCartItem(CartItem cartItem) {
        CartItem updatedItem = cartService.saveOrUpdateCartItem(cartItem);
        sendCartItemToWebSocket(updatedItem);
    }

    @MessageMapping("/cart/remove")
    public void removeCartItem(CartItem cartItem) {
        CartItem removedItem = cartService.removeCartItem(cartItem);
        if (removedItem == null) {
            // If the item was removed, notify the clients to delete the item
            messagingTemplate.convertAndSend("/topic/cart/remove", cartItem.getId());
        } else {
            sendCartItemToWebSocket(removedItem);
        }
    }

    private void sendCartItemToWebSocket(CartItem cartItem) {
        messagingTemplate.convertAndSend("/topic/cart", cartItem);
    }
}
