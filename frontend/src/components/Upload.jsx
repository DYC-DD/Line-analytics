import React, { useState, useRef } from "react";
import { uploadChatFile } from "../api/uploadApi";
import PixelCard from "./PixelCard";
import "../styles/Upload.css";
import pageIcon from "../assets/page.png";

export default function Upload({ onUploadSuccess, setLoading }) {
  const [showEffect, setShowEffect] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file.name.endsWith(".txt")) {
      setError("請選擇 .txt 聊天記錄檔案");
      setTimeout(() => setError(null), 1500);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await uploadChatFile(file);
      onUploadSuccess(result.analysis, file.name);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setShowEffect(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`upload-box ${showEffect ? "hover-effect" : ""}`}
      onClick={() => inputRef.current.click()}
      onMouseEnter={() => setShowEffect(true)}
      onMouseLeave={() => {
        if (!dragOver) setShowEffect(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
        setShowEffect(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOver(false);
        setShowEffect(false);
      }}
      onDrop={handleDrop}
    >
      {showEffect && (
        <div className="upload-background">
          <PixelCard variant="blue" className="upload-pixelcard" />
        </div>
      )}

      <div className="upload-overlay">
        <input
          type="file"
          accept=".txt"
          ref={inputRef}
          onChange={(e) => handleFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        <div className={`upload-content ${error ? "error" : ""}`}>
          <img src={pageIcon} alt="icon" className="upload-icon" />
          {error || "點擊或拖曳 .txt 聊天記錄檔案至此"}
        </div>
      </div>
    </div>
  );
}
