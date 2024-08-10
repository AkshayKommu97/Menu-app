import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import axios from "axios";

let stompClient = null;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Fetch initial cart items from the database
    fetchCartItems();

    // Connect to WebSocket
    connectWebSocket();

    return () => {
      if (stompClient !== null && isConnected) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/cart");
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log("Connected to WebSocket");
    setIsConnected(true);

    setTimeout(() => {
      stompClient.subscribe("/topic/cart", onMessageReceived);
    }, 100);
  };

  const onError = (error) => {
    console.error("Error connecting to WebSocket:", error);
  };

  const onMessageReceived = (payload) => {
    const item = JSON.parse(payload.body);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id ? item : cartItem
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const updateCartItem = (item) => {
    if (isConnected) {
      stompClient.send("/app/cart", {}, JSON.stringify(item));
    } else {
      console.error("WebSocket connection is not established yet");
    }
  };

  const handleAddQuantity = (item) => {
    item.quantity += 1;
    updateCartItem(item);
  };

  const handleRemoveQuantity = (item) => {
    if (item.quantity > 0) {
      item.quantity -= 1;
      updateCartItem(item);
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                margin: "8px",
                width: "200px",
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
    </div>
  );
};

export default Cart;
