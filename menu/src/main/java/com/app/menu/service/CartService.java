package com.app.menu.service;

import com.app.menu.model.CartItem;
import com.app.menu.repositories.CartItemRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public CartItem saveOrUpdateCartItem(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public void deleteCartItem(String id) {
        cartItemRepository.deleteById(id);
    }

    public boolean removeCartItem(CartItem cartItem) {
        Optional<CartItem> existingItem = cartItemRepository.findById(cartItem.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();

            if (item.getQuantity() > 1) {
                item.setQuantity(item.getQuantity() - 1);
                cartItemRepository.save(item); // Save the updated item
                return false; // Indicate that the item was not removed, only updated
            } else {
                cartItemRepository.delete(item);
                return true; // Indicate that the item was removed
            }
        } else {
            throw new RuntimeException("Cart item not found.");
        }
    }

    public List<CartItem> fetchCartItem() {
        return cartItemRepository.findAll();
    }
}
