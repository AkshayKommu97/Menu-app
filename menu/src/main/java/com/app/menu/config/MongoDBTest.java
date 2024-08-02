// package com.app.menu.config;

// import com.mongodb.client.MongoClients;
// import com.mongodb.client.MongoClient;
// import com.mongodb.client.MongoDatabase;

// public class MongoDBTest {

// public static void main(String[] args) {
// String uri =
// "mongodb://admin:admin@ac-wsihoo7-shard-00-00.8vvqztu.mongodb.net:27017,ac-wsihoo7-shard-00-01.8vvqztu.mongodb.net:27017,ac-wsihoo7-shard-00-02.8vvqztu.mongodb.net:27017/?ssl=true&replicaSet=atlas-vtxvkb-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Menus";

// try (MongoClient mongoClient = MongoClients.create(uri)) {
// @SuppressWarnings("unused")
// MongoDatabase database = mongoClient.getDatabase("yourdatabase");
// System.out.println("Successfully connected to MongoDB Atlas!");
// } catch (Exception e) {
// e.printStackTrace();
// System.out.println("Failed to connect to MongoDB Atlas.");
// }
// }
// }
