import { useState, useEffect } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const UserCard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/get-user/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        setError(
          error.response ? error.response.data : "Error fetching user data"
        );
      }
    };

    fetchUser();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-card">
      <h2>User Information</h2>
      <div className="user-card-content">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
