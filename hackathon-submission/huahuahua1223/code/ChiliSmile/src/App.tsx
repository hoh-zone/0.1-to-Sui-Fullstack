import { BrowserRouter, useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { routes } from './routes';
import './App.css';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return <MainLayout>{element}</MainLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
