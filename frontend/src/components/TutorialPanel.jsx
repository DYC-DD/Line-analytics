import React from "react";
import "../styles/TutorialPanel.css";
import tutorial1 from "../assets/tutorial-1.jpeg";
import tutorial2 from "../assets/tutorial-2.jpeg";
import tutorial3 from "../assets/tutorial-3.jpeg";
import tutorial4 from "../assets/tutorial-4.jpeg";

export default function TutorialPanel() {
  return (
    <div className="container">
      <h3 className="tutorial-title">📘 使用說明</h3>

      <div className="tutorial-grid">
        <figure className="tutorial-item">
          <img src={tutorial1} alt="上傳 LINE 記錄" className="tutorial-icon" />
          <figcaption>步驟一：點擊想分析的聊天室</figcaption>
        </figure>

        <figure className="tutorial-item">
          <img src={tutorial2} alt="分析中" className="tutorial-icon" />
          <figcaption>步驟二：點擊『設定』</figcaption>
        </figure>

        <figure className="tutorial-item">
          <img src={tutorial3} alt="瀏覽結果" className="tutorial-icon" />
          <figcaption>步驟三：點擊『傳送聊天記錄』</figcaption>
        </figure>

        <figure className="tutorial-item">
          <img src={tutorial4} alt="完整分析報告" className="tutorial-icon" />
          <figcaption>步驟四：點擊『儲存到檔案』</figcaption>
        </figure>
      </div>
    </div>
  );
}
