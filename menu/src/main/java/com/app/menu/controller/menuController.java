package com.app.menu.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.menu.model.User;
import com.app.menu.repositories.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1")
public class menuController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/get-user/{id}")
    @CrossOrigin(origins = "http://localhost:5174")
    public ResponseEntity<?> getUser(@PathVariable String id) {
        Optional<User> byId = userRepository.findById(id);
        if (byId.isPresent()) {
            return ResponseEntity.ok(byId.get());
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PostMapping("/add-user")
    public User addUser(@RequestBody User user) {
        // Implementation logic to add user
        User saved = userRepository.save(user);
        return saved;
    }

}
