import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NaviBar from "./components/navi-bar";
import Main from "./pages/main";
import User from "./pages/User";


function App() {
  return (
    <Router>
      <div className="bg-background">
        <NaviBar />
      </div>
      <Routes>
        <Route path="/" element={<Main />} /> 
        <Route path="/user" element={<User />} />
      </Routes>
    </Router>
  );
}
export default App