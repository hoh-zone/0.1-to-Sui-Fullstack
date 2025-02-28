import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Main from "./page/Main";
import NaviBar from "@/components/NaviBar";
import User from "./page/User";
// import Image from "next/image";

function App() {
  return (
    <Router>
      <div className="bg-backgroud">
        <NaviBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
