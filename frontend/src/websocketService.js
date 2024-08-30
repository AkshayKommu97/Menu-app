// src/websocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "https://menu-app-8zql.onrender.com/ws";

const client = new Client({
  brokerURL: WEBSOCKET_URL,
  webSocketFactory: () => new SockJS(WEBSOCKET_URL),
  reconnectDelay: 5000,
  debug: (str) => {
    console.log(str);
  },
});

const subscriptions = [];
let isConnected = false;
let isConnecting = false;

client.onConnect = (frame) => {
  console.log("Connected: " + frame);
  isConnected = true;
  isConnecting = false;
  subscriptions.forEach((sub) => sub());
  subscriptions.length = 0; // Clear subscriptions after handling them
};

client.onStompError = (frame) => {
  console.log("Broker reported error: " + frame.headers["message"]);
  console.log("Additional details: " + frame.body);
};

client.onDisconnect = () => {
  console.log("Disconnected");
  isConnected = false;
  isConnecting = false;
  ensureConnected();
};

const ensureConnected = () => {
  if (!isConnected && !isConnecting) {
    isConnecting = true;
    client.activate();
  }
};

export const subscribeToCart = (room, callback) => {
  const subscribeFunction = () => {
    client.subscribe(`/topic/cart/${room}`, (message) => {
      try {
        callback(JSON.parse(message.body));
      } catch (e) {
        console.error("Error parsing message body as JSON", e);
      }
    });
  };

  if (isConnected) {
    subscribeFunction();
  } else {
    subscriptions.push(subscribeFunction);
    ensureConnected();
  }
};

export const sendCartAction = (room, itemId, name, quantity) => {
  const action = () => {
    client.publish({
      destination: "/app/cart",
      body: JSON.stringify({
        room,
        cartItem: { id: null, itemId, name, quantity },
      }),
    });
  };

  if (isConnected) {
    action();
  } else {
    console.error("STOMP client is not connected. Queuing action.");
    subscriptions.push(action);
    ensureConnected();
  }
};

// Ensure the client is activated
ensureConnected();
