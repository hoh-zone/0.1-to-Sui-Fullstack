
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageDetail from './pages/LibraryPage';
import NotFound from './pages/NotFound';
import MainPage from './pages/MainPage'; // 将主页面逻辑拆分到单独的组件
import IssuaDetail from './pages/IssuaDetail';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 主页面 */}
        <Route path="/" element={<MainPage />} />
        {/* 图片详情页面 */}
        <Route path="/:image_id" element={<ImageDetail />} />
        {/* 404 页面 */}
        <Route path="/:image_id/:blob_id" element={<IssuaDetail />} />
      </Routes>
    </Router>
  );
};

export default App;

//app.tsx文件只需要写路由逻辑，其他的都写到其他页面的文件中即可
