

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from '@/pages/Main';
import User from '@/pages/User';
import NavBar from './components/NavBar';

function App() {

  return (
    <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/user" element={<User />} />
        </Routes>
    </Router>
  );
}

export default App;
