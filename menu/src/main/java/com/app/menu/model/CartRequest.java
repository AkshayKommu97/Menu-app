package com.app.menu.model;

import java.util.List;

public class CartRequest {
    private String userId;
    private List<CartItem> items;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    // Getters and Setters
}
