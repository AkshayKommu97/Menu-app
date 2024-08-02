package com.app.menu.repositories;

import com.app.menu.model.ShareCode;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShareCodeRepository extends MongoRepository<ShareCode, String> {
    ShareCode findByCode(String code);
}
