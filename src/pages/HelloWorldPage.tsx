import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHelloWorld } from "../api/auth";

export default function HelloWorldPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getHelloWorld()
      .then((data) => setMessage(data.message))
      .catch(() => setError("Failed to fetch message"));
  }, []);

  return (
    <div className="container">
      {error ? (
        <p className="error" role="alert">{error}</p>
      ) : (
        <h1>{message || "Loading..."}</h1>
      )}
      <button onClick={() => void navigate("/login")}>Logout</button>
    </div>
  );
}
