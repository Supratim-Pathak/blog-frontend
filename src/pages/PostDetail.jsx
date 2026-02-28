import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  deletePost,
  addComment,
  clearCurrentPost,
} from "../store/postSlice";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost, loading } = useSelector((s) => s.posts);
  const { user } = useSelector((s) => s.auth);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => dispatch(clearCurrentPost());
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm("Delete this post?")) {
      dispatch(deletePost(id)).then(() => navigate("/"));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setSubmitting(true);
    await dispatch(
      addComment({ id, commentData: { name: user.name, content: comment } }),
    );
    setComment("");
    setSubmitting(false);
  };

  if (loading || !currentPost) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: "2px solid #ddd",
            borderTopColor: "#111",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isAuthor = user && user._id === currentPost.author?.toString();

  return (
    <article style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          fontSize: 13,
          color: "#888",
          cursor: "pointer",
          marginBottom: 32,
          padding: 0,
        }}
      >
        ← Back
      </button>

      {/* Meta */}
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 12 }}>
        {currentPost.authorName} ·{" "}
        {new Date(currentPost.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>

      {/* Title */}
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: "-0.5px",
          marginBottom: 32,
        }}
      >
        {currentPost.title}
      </h1>

      {/* Owner actions */}
      {isAuthor && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 36,
            paddingBottom: 24,
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <button
            onClick={() => navigate(`/edit-post/${id}`)}
            style={{
              background: "none",
              border: "1px solid #ddd",
              padding: "5px 14px",
              borderRadius: 4,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{
              background: "none",
              border: "1px solid #fcc",
              color: "#c00",
              padding: "5px 14px",
              borderRadius: 4,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          fontSize: 17,
          lineHeight: 1.85,
          color: "#222",
          whiteSpace: "pre-wrap",
          marginBottom: 64,
        }}
      >
        {currentPost.content}
      </div>

      {/* Divider */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e5e5e5",
          marginBottom: 48,
        }}
      />

      {/* Comments */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 28 }}>
          Comments ({currentPost.comments?.length || 0})
        </h2>

        {/* Comment form */}
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: 40 }}>
          <textarea
            required
            disabled={!user}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={user ? "Leave a comment…" : "Sign in to comment"}
            style={{
              width: "100%",
              border: "1px solid #e5e5e5",
              borderRadius: 4,
              padding: "10px 12px",
              fontSize: 14,
              outline: "none",
              resize: "vertical",
              minHeight: 90,
              fontFamily: "inherit",
              color: "#111",
              background: "#fafafa",
              marginBottom: 10,
            }}
          />
          {user && (
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              style={{
                background: "#111",
                color: "#fff",
                border: "none",
                padding: "7px 16px",
                borderRadius: 4,
                fontSize: 13,
                cursor: "pointer",
                opacity: submitting || !comment.trim() ? 0.5 : 1,
              }}
            >
              {submitting ? "Posting…" : "Post comment"}
            </button>
          )}
        </form>

        {/* Comments list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {currentPost.comments?.map((c, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#aaa",
                  marginBottom: 6,
                }}
              >
                <span style={{ fontWeight: 500, color: "#333" }}>{c.name}</span>
                <span>
                  {new Date(c.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7 }}>
                {c.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};

export default PostDetail;
