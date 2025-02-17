import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./page/Home/Home";
import Login from "./page/Login/Login";
import Game from "./page/Game/Game";
import { UserProvider } from "./context/UserContext";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <BodyClassManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

// 组件：监听路由变化，动态修改 body class
const BodyClassManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.className = ""; // 先清除之前的 class
    if (location.pathname === "/") {
      document.body.classList.add("home-page");
    } else if (location.pathname === "/login") {
      document.body.classList.add("login-page");
    } else if (location.pathname === "/game") {
      document.body.classList.add("game-page");
    }
  }, [location.pathname]);

  return null;
};

export default App;
