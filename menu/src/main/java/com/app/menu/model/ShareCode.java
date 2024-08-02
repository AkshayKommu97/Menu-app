package com.app.menu.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "shareCodes")
public class ShareCode {

    @Id
    private String id;
    private String cartId;
    private LocalDateTime expirationTime;
    private String code; // Add this field if querying by code is required

    // Constructors, getters, and setters
    public ShareCode() {
    }

    public ShareCode(String id, String cartId, LocalDateTime expirationTime, String code) {
        this.id = id;
        this.cartId = cartId;
        this.expirationTime = expirationTime;
        this.code = code;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCartId() {
        return cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
    }

    public LocalDateTime getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(LocalDateTime expirationTime) {
        this.expirationTime = expirationTime;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
