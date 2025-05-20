import React from "react";
import "../styles/Loader.css";

export default function Loader() {
  return (
    <div className="hourglassBackground">
      <div className="hourglassContainer">
        <div className="hourglassCurves" />
        <div className="hourglassCapTop" />
        <div className="hourglassGlassTop" />
        <div className="hourglassSand" />
        <div className="hourglassSandStream" />
        <div className="hourglassCapBottom" />
        <div className="hourglassGlass" />
      </div>
    </div>
  );
}
