/* eslint-disable react/prop-types */
// src/Cart.jsx

import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import Modal from "react-modal";

let stompClient = null;

const Cart = ({ isOpen, onRequestClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (stompClient !== null && isConnected) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, [isConnected]);

  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log("Connected to WebSocket");
    setIsConnected(true);
    stompClient.subscribe("/topic/cart", onMessageReceived);
    stompClient.send("/app/cart/fetch", {}, JSON.stringify({}));
  };

  const onError = (error) => {
    console.error("Error connecting to WebSocket:", error);
  };

  const onMessageReceived = (payload) => {
    const messageData = JSON.parse(payload.body);

    if (Array.isArray(messageData)) {
      setCartItems(messageData);
    } else {
      setCartItems((prevItems) => {
        const itemIndex = prevItems.findIndex(
          (item) => item.id === messageData.id
        );
        if (itemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[itemIndex] = messageData;
          return updatedItems;
        } else {
          return [...prevItems, messageData];
        }
      });
    }
  };

  const sendUpdate = (item, endpoint) => {
    if (isConnected) {
      stompClient.send(endpoint, {}, JSON.stringify(item));
    } else {
      console.error("WebSocket connection is not established yet");
    }
  };

  const handleAddQuantity = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    sendUpdate(updatedItem, "/app/cart/add");
  };

  const handleRemoveQuantity = (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      sendUpdate(updatedItem, "/app/cart/add");
    } else {
      sendUpdate(item, "/app/cart/remove");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Shopping Cart"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
        },
      }}
    >
      <h2>Shopping Cart</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                margin: "8px 0",
                width: "100%",
              }}
            >
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <button onClick={() => handleAddQuantity(item)}>
                Add Quantity
              </button>
              <button onClick={() => handleRemoveQuantity(item)}>
                Remove Quantity
              </button>
            </div>
          ))
        ) : (
          <p>No items in the cart</p>
        )}
      </div>
      <button onClick={onRequestClose}>Close Cart</button>
    </Modal>
  );
};

export default Cart;
