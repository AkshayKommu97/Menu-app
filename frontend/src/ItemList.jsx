import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Define the base URL for the API
const BASE_URL = "http://localhost:8080/api/v1";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ description: "", price: "" });
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/items`);
      setItems(response.data);
    } catch (err) {
      setError("Failed to fetch items");
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/items`, newItem);
      setItems([...items, response.data]);
      setNewItem({ description: "", price: "" });
    } catch (err) {
      setError("Failed to add item");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/items/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const handleSelectItem = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/items/${id}`);
      setSelectedItem(response.data);
    } catch (err) {
      setError("Failed to fetch item details");
    }
  };

  return (
    <Container style={{ padding: "20px" }}>
      <h2 className="text-center">Item List</h2>
      {error && <p className="text-danger">{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
          placeholder="Item Description"
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <input
          type="text"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          placeholder="Item Price"
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <Button variant="primary" onClick={handleAddItem}>
          Add Item
        </Button>
      </div>

      <Row>
        {items.map((item) => (
          <Col key={item.id} sm={12} md={6} lg={4} xl={3}>
            <Card style={{ margin: "10px" }}>
              <Card.Img
                variant="top"
                src="https://via.placeholder.com/150"
                alt="Item Image"
              />
              <Card.Body>
                <Card.Title>{item.description}</Card.Title>
                <Card.Text>Price: ${item.price}</Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteItem(item.id)}
                  style={{ marginRight: "10px" }}
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSelectItem(item.id)}
                >
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedItem && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            marginTop: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>Item Details</h3>
          <p>
            <strong>ID:</strong> {selectedItem.id}
          </p>
          <p>
            <strong>Description:</strong> {selectedItem.description}
          </p>
          <p>
            <strong>Price:</strong> ${selectedItem.price}
          </p>
        </div>
      )}
    </Container>
  );
};

export default ItemList;
