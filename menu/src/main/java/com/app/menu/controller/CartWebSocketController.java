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
        // Remove the cart item from the service layer (and thus from the cart
        // collection)
        boolean isRemoved = cartService.removeCartItem(cartItem);

        // If the item was successfully removed, send an update to all subscribed
        // clients
        if (isRemoved) {
            messagingTemplate.convertAndSend("/topic/cart", cartItem);
        }
    }

    private void sendCartItemToWebSocket(CartItem cartItem) {
        messagingTemplate.convertAndSend("/topic/cart", cartItem);
    }
}
