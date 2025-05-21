import React, { useState } from "react";
import Upload from "../components/Upload";
import Loader from "../components/Loader";
import phoneIcon from "../assets/mobile-phone.png";
import ChartPanel from "./ChartPanel";
import "../styles/Home.css";

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = (data) => {
    setAnalysis(data);
    setLoading(false);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">
        <img src={phoneIcon} alt="Phone Icon" className="title-icon" />
        LINE 聊天分析
      </h1>

      <div className="upload-wrapper">
        <Upload onUploadSuccess={handleUploadSuccess} setLoading={setLoading} />
      </div>

      {loading && (
        <div className="loader-section">
          <Loader />
        </div>
      )}

      {analysis && !loading && (
        <>
          <ChartPanel analysis={analysis} />
          <pre style={{ marginTop: "2rem", textAlign: "left" }}>
            {/* <code>{JSON.stringify(analysis, null, 2)}</code> */}
          </pre>
        </>
      )}
    </div>
  );
}
