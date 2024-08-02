// src/Cart.jsx
import { useState, useEffect } from "react";
import { subscribeToCart, sendCartAction } from "./websocketService";

// eslint-disable-next-line react/prop-types
const Cart = ({ room }) => {
  const [cart, setCart] = useState({});

  useEffect(() => {
    subscribeToCart(room, (updatedCart) => {
      setCart((prevCart) => {
        const newCart = { ...prevCart };
        newCart[updatedCart.itemId] = updatedCart;
        return newCart;
      });
    });

    return () => {
      // Cleanup (if necessary)
    };
  }, [room]);

  const addItem = (itemId, name) => {
    const quantity = cart[itemId] ? cart[itemId].quantity + 1 : 1;
    sendCartAction(room, itemId, name, quantity);
  };

  const removeItem = (itemId) => {
    const quantity = cart[itemId] ? cart[itemId].quantity - 1 : 0;
    if (quantity > 0) {
      sendCartAction(room, itemId, cart[itemId].name, quantity);
    } else {
      // Optional: handle removing the item from the cart entirely
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {Object.values(cart).map((item) => (
          <li key={item.itemId}>
            {item.name} (Quantity: {item.quantity})
            <button onClick={() => addItem(item.itemId, item.name)}>+</button>
            <button onClick={() => removeItem(item.itemId)}>-</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addItem("1", "Item 1")}>Add Item 1</button>
      <button onClick={() => addItem("2", "Item 2")}>Add Item 2</button>
    </div>
  );
};

export default Cart;
