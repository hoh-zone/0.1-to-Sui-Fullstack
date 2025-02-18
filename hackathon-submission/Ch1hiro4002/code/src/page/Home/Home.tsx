// src/page/Home/Home.tsx

import Logo from "../../assets/Logo/Logo";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* 背景装饰 */}
      <div className="background"></div>

      {/* 游戏 Logo */}
      <h1 className="logo"><Logo /></h1>

      {/* 主题介绍 */}
      <h2 className="theme">「Destined encounter, love witnessed by blockchain」</h2>

      {/* 背景故事 */}
      <p className="story">
      In the future world, everyone's fate is calculated by the stars. When two matching souls meet,<br/>
      the blockchain will record this wonderful journey. Are you ready to meet the person of your destiny?？
      </p>

      {/* 进入游戏按钮 */}
      <button className="start-button" onClick={() => navigate("/login")}>
      Enter the game
      </button>
    </div>
  );
};

export default Home;