// src/App.jsx

import { useState } from "react";
import Cart from "./Cart";
import ItemList from "./ItemList";

const HeroSection = () => (
  <div
    style={{
      backgroundColor: "#f5f5f5",
      padding: "50px 20px",
      textAlign: "center",
    }}
  >
    <h1>Welcome to Our Online Store</h1>
    <p>Discover the best products at unbeatable prices.</p>
    <button style={{ padding: "10px 20px", fontSize: "16px" }}>Shop Now</button>
  </div>
);

const Footer = () => (
  <div
    style={{
      backgroundColor: "#333",
      color: "#fff",
      padding: "20px",
      textAlign: "center",
    }}
  >
    <p>© 2024 Your Store. All rights reserved.</p>
    <p>Contact us: info@yourstore.com</p>
  </div>
);

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div>
      <HeroSection />
      <div style={{ padding: "20px", textAlign: "center" }}>
        <button
          onClick={() => setIsCartOpen(true)}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Open Cart
        </button>
      </div>
      <div>
        <ItemList />
      </div>
      <Footer />
      <Cart isOpen={isCartOpen} onRequestClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default App;
