package com.app.menu.controller;

import com.app.menu.model.CartItem;
import com.app.menu.model.Item;
import com.app.menu.repositories.CartItemRepository;
import com.app.menu.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class itemController {

    @Autowired
    private ItemService itemService;
    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping("/items")
    public ResponseEntity<List<Item>> getItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartItem>> getCartItems() {
        return ResponseEntity.ok(cartItemRepository.findAll());
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<?> getItemById(@PathVariable String id) {
        Optional<Item> item = itemService.getItemById(id);
        if (item.isPresent()) {
            return ResponseEntity.ok(item.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item not found");
        }
    }

    @PostMapping("/items")
    public ResponseEntity<Item> addItem(@RequestBody Item item) {
        CartItem cartItem = new CartItem();
        cartItem.setName(item.getDescription());
        cartItemRepository.save(cartItem);
        return ResponseEntity.ok(itemService.addItem(item));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
