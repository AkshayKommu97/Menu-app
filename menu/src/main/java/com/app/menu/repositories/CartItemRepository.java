// src/main/java/com/app/menu/repository/CartItemRepository.java
package com.app.menu.repositories;

import com.app.menu.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CartItemRepository extends MongoRepository<CartItem, String> {
    CartItem findByItemId(String itemId);
}
