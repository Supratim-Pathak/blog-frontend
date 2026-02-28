import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Footer() {
  const { user } = useSelector((state) => state.auth);
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: "1px solid #e5e5e5",
        marginTop: 80,
        padding: "24px",
        textAlign: "center",
        fontSize: 13,
        color: "#aaa",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>© {year} Blog</span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link to="/" style={{ color: "#aaa" }}>
            Home
          </Link>
          {!user && (
            <Link to="/signup" style={{ color: "#aaa" }}>
              Sign up
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
