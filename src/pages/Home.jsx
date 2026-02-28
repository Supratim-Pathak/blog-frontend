import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/postSlice";
import { Link } from "react-router-dom";

const LIMIT = 5;

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, totalPages, currentPage, totalDocs } = useSelector(
    (s) => s.posts,
  );

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // committed search term
  const [page, setPage] = useState(1);

  // Fetch whenever page or committed query changes
  useEffect(() => {
    dispatch(fetchPosts({ page, limit: LIMIT, search: query }));
  }, [dispatch, page, query]);

  // Reset to page 1 when user commits a new search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  const handleClearSearch = () => {
    setSearch("");
    setQuery("");
    setPage(1);
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 8, marginBottom: 40 }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts…"
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: 4,
            padding: "8px 12px",
            fontSize: 14,
            outline: "none",
            color: "#111",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Search
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClearSearch}
            style={{
              background: "none",
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: "8px 12px",
              fontSize: 13,
              cursor: "pointer",
              color: "#555",
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Results label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: "#aaa",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
          }}
        >
          {query ? `Results for "${query}"` : "Latest Posts"}
        </p>
        {!loading && (
          <p style={{ fontSize: 12, color: "#bbb" }}>
            {totalDocs} {totalDocs === 1 ? "post" : "posts"}
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "60px 0",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              border: "2px solid #eee",
              borderTopColor: "#111",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty state */}
      {!loading && posts?.length === 0 && (
        <p style={{ color: "#aaa", fontSize: 15, paddingTop: 40 }}>
          {query ? (
            <>
              No posts matched <strong>"{query}"</strong>.
            </>
          ) : (
            <>
              No posts yet.{" "}
              <Link
                to="/create-post"
                style={{ color: "#111", textDecoration: "underline" }}
              >
                Write the first one.
              </Link>
            </>
          )}
        </p>
      )}

      {/* Post list */}
      {!loading &&
        posts?.map((post) => (
          <article
            key={post._id}
            style={{
              borderBottom: "1px solid #efefef",
              paddingBottom: 28,
              marginBottom: 28,
            }}
          >
            <p style={{ fontSize: 12, color: "#bbb", marginBottom: 8 }}>
              {post.authorName} ·{" "}
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                lineHeight: 1.35,
                marginBottom: 8,
                color: "#111",
              }}
            >
              <Link to={`/post/${post._id}`} style={{ color: "inherit" }}>
                {post.title}
              </Link>
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#666",
                lineHeight: 1.75,
                marginBottom: 12,
              }}
            >
              {post.content.length > 160
                ? post.content.slice(0, 160) + "…"
                : post.content}
            </p>
            <Link
              to={`/post/${post._id}`}
              style={{
                fontSize: 13,
                color: "#111",
                textDecoration: "underline",
              }}
            >
              Read more
            </Link>
          </article>
        ))}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            marginTop: 16,
          }}
        >
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            style={btnStyle(page === 1)}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              style={{
                ...btnStyle(false),
                background: p === page ? "#111" : "transparent",
                color: p === page ? "#fff" : "#333",
                border: p === page ? "1px solid #111" : "1px solid #ddd",
                fontWeight: p === page ? 600 : 400,
                minWidth: 36,
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            style={btnStyle(page === totalPages)}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

const btnStyle = (disabled) => ({
  background: "transparent",
  border: "1px solid #ddd",
  borderRadius: 4,
  padding: "6px 10px",
  fontSize: 13,
  cursor: disabled ? "not-allowed" : "pointer",
  color: disabled ? "#ccc" : "#333",
  minWidth: 36,
});

export default Home;
