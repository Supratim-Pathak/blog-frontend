import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const inputStyle = {
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: 4,
  padding: "10px 12px",
  fontSize: 14,
  outline: "none",
  background: "#fff",
  color: "#111",
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate("/");
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
        Sign in
      </h1>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 28 }}>
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{ color: "#111", textDecoration: "underline" }}
        >
          Sign up
        </Link>
      </p>

      {error && (
        <div
          style={{
            background: "#fff5f5",
            border: "1px solid #fcc",
            color: "#c00",
            padding: "10px 12px",
            borderRadius: 4,
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            style={inputStyle}
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            style={inputStyle}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          style={{
            marginTop: 4,
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "10px",
            fontSize: 14,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
