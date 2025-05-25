import React, { useState } from "react";
import Upload from "../components/Upload";
import Loader from "../components/Loader";
import phoneIcon from "../assets/mobile-phone.png";
import ChartPanel from "./ChartPanel";
import TutorialPanel from "../components/TutorialPanel";
import "../styles/Home.css";

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = (data, uploadedFileName) => {
    setAnalysis(data);
    setFileName(uploadedFileName);
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

      {!loading && !analysis && (
        <div className="tutorial-container">
          <TutorialPanel />
        </div>
      )}

      {analysis && !loading && (
        <>
          <ChartPanel analysis={analysis} fileName={fileName} />
        </>
      )}
    </div>
  );
}
