package com.app.menu.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.IndexOptions;
import com.mongodb.client.model.Indexes;
import org.bson.Document;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @SuppressWarnings("null")
    @Override
    protected String getDatabaseName() {
        return "yourdatabase";
    }

    @SuppressWarnings("null")
    @Bean
    @Override
    public MongoClient mongoClient() {
        ConnectionString connectionString = new ConnectionString(
                "mongodb://admin:admin@ac-wsihoo7-shard-00-00.8vvqztu.mongodb.net:27017,ac-wsihoo7-shard-00-01.8vvqztu.mongodb.net:27017,ac-wsihoo7-shard-00-02.8vvqztu.mongodb.net:27017/?ssl=true&replicaSet=atlas-vtxvkb-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Menus");
        MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                .applyConnectionString(connectionString)
                .build();
        return MongoClients.create(mongoClientSettings);
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), getDatabaseName());
    }

    @EventListener(ContextRefreshedEvent.class)
    public void initIndexes() {
        MongoDatabase database = mongoClient().getDatabase(getDatabaseName());
        MongoCollection<Document> collection = database.getCollection("shareCodes");
        IndexOptions options = new IndexOptions().expireAfter(3600L, java.util.concurrent.TimeUnit.SECONDS); // 1 hour
                                                                                                             // TTL
        collection.createIndex(Indexes.ascending("expirationTime"), options);
    }
}
