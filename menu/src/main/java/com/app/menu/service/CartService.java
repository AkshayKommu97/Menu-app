package com.app.menu.service;

import com.app.menu.model.Cart;
import com.app.menu.model.CartItem;
import com.app.menu.model.ShareCode;
import com.app.menu.repositories.CartRepository;
import com.app.menu.repositories.ShareCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ShareCodeRepository shareCodeRepository;

    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart updateCart(String userId, List<CartItem> items) {
        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
        }
        cart.setItems(items);
        return cartRepository.save(cart);
    }

    public String generateShareCode(String cartId) {
        String code = String.format("%04d", new Random().nextInt(10000));
        ShareCode shareCode = new ShareCode();
        shareCode.setCode(code); // Assuming you have a 'code' field in ShareCode
        shareCode.setCartId(cartId);
        shareCode.setExpirationTime(LocalDateTime.now().plusMinutes(30)); // Code expires in 30 minutes
        shareCodeRepository.save(shareCode);
        return code;
    }

    public Cart getCartByShareCode(String code) {
        ShareCode shareCode = shareCodeRepository.findByCode(code);
        if (shareCode != null && shareCode.getExpirationTime().isAfter(LocalDateTime.now())) {
            Optional<Cart> cart = cartRepository.findById(shareCode.getCartId());
            return cart.orElse(null);
        }
        return null;
    }
}
