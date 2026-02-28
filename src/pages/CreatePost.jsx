import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  updatePost,
  fetchPostById,
  clearCurrentPost,
} from "../store/postSlice";
import { useNavigate, useParams } from "react-router-dom";

const inputStyle = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #e5e5e5",
  padding: "10px 0",
  fontSize: 14,
  outline: "none",
  background: "transparent",
  color: "#111",
};

const CreatePost = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState({ title: "", content: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost, loading } = useSelector((s) => s.posts);

  useEffect(() => {
    if (isEdit) dispatch(fetchPostById(id));
    return () => dispatch(clearCurrentPost());
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (isEdit && currentPost) {
      setFormData({ title: currentPost.title, content: currentPost.content });
    }
  }, [isEdit, currentPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(updatePost({ id, postData: formData })).then(() =>
        navigate(`/post/${id}`),
      );
    } else {
      dispatch(createPost(formData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") navigate("/");
      });
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600 }}>
          {isEdit ? "Edit post" : "New post"}
        </h1>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "1px solid #ddd",
            padding: "5px 12px",
            borderRadius: 4,
            fontSize: 13,
            color: "#555",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "#aaa",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Title
          </label>
          <input
            type="text"
            required
            style={{
              ...inputStyle,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.3px",
            }}
            placeholder="Post title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "#aaa",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Content
          </label>
          <textarea
            required
            style={{
              width: "100%",
              border: "1px solid #e5e5e5",
              borderRadius: 4,
              padding: "12px",
              fontSize: 15,
              outline: "none",
              background: "#fafafa",
              color: "#111",
              lineHeight: 1.8,
              minHeight: 400,
              resize: "vertical",
              fontFamily: "inherit",
            }}
            placeholder="Write your post here…"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
        </div>

        <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#111",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "9px 20px",
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Saving…" : isEdit ? "Save changes" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
