import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/register';
import UserProfilePage from './pages/user';
import Manage from './pages/manage';

function App() {
  return (
    <Router>
         <div className="bg-background min-h-screen">
        <Routes>
          {/* 首页 */}
          <Route path="/" element={<Register />} />
          {/* 用户页面 */}
          <Route path="/user" element={<UserProfilePage />} />

          <Route path="/manage" element={<Manage />} />
        </Routes>
      </div>
      <Register/>
    </Router>
  )
}

export default App;