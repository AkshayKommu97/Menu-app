package com.app.menu.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.app.menu.model.Item;

public interface ItemRepository extends MongoRepository<Item, String> {
}
