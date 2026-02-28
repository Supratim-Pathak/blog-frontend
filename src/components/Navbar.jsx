import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header style={{ borderBottom: "1px solid #e5e5e5", padding: "0 24px" }}>
      <nav
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
        }}
      >
        <Link
          to="/"
          style={{ fontWeight: 600, fontSize: 18, letterSpacing: "-0.3px" }}
        >
          Blog
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 14,
          }}
        >
          {user ? (
            <>
              <span style={{ color: "#888" }}>{user.name}</span>
              <Link
                to="/create-post"
                style={{
                  background: "#111",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Write
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "1px solid #e5e5e5",
                  padding: "5px 12px",
                  borderRadius: 4,
                  fontSize: 13,
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: "#555" }}>
                Sign in
              </Link>
              <Link
                to="/signup"
                style={{
                  background: "#111",
                  color: "#fff",
                  padding: "6px 14px",
                  borderRadius: 4,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
