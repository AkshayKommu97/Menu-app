import { useState, useEffect, useCallback } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import axios from "axios";

let stompClient = null;
const BASE_URL = "http://localhost:8080/api/v1";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (stompClient !== null && isConnected) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    setTimeout(() => {
      if (isConnected) {
        stompClient.send("/app/cart/fetch", {}, JSON.stringify({}));
        stompClient.subscribe("/topic/cart/remove", onRemoveMessageReceived);
      }
    }, 100);
  };

  const onError = (error) => {
    console.error("Error connecting to WebSocket:", error);
    setError("Error connecting to WebSocket");
  };

  const onMessageReceived = (payload) => {
    const messageData = JSON.parse(payload.body);
    console.log("Message received:", messageData);

    if (Array.isArray(messageData)) {
      setCartItems(messageData);
    } else if (messageData.removed) {
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== messageData.id)
      );
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

  const onRemoveMessageReceived = (payload) => {
    const removedItemId = JSON.parse(payload.body);
    console.log("Item removed:", removedItemId);

    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== removedItemId)
    );
  };

  const sendUpdate = useCallback(
    async (item, endpoint) => {
      if (isConnected) {
        try {
          await stompClient.send(endpoint, {}, JSON.stringify(item));
        } catch (err) {
          console.error("Failed to send WebSocket message:", err);
          setError("Failed to send WebSocket message");
        }
      } else {
        console.error("WebSocket connection is not established yet");
        setError("WebSocket connection is not established yet");
      }
    },
    [isConnected]
  );

  const handleAddQuantity = async (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    await sendUpdate(updatedItem, "/app/cart/add");
  };

  const handleRemoveQuantity = async (item) => {
    if (item.quantity > 1) {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      await sendUpdate(updatedItem, "/app/cart/add");
    } else {
      try {
        // Delete item from backend
        await axios.delete(`${BASE_URL}/cart/${item.id}`);

        // Notify WebSocket server to ensure consistency
        await sendUpdate({ id: item.id, removed: true }, "/app/cart/remove");

        // Remove item from UI after successful deletion
        setCartItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
      } catch (err) {
        console.error("Failed to delete item from cart:", err);
        setError("Failed to delete item from cart");
      }
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {error && <p className="text-danger">{error}</p>}
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
