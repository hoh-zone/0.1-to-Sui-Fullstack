import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import User from "./pages/User";
import NaviBar from "./components/navi-bar";

function App() {
  return (    
    <Router>
      <div className="bg-background">
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
