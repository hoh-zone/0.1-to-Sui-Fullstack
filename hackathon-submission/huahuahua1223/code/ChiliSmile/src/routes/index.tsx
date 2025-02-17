import { RouteObject } from 'react-router-dom';
import ArtworkList from '../components/ArtworkList';
import CreateArtwork from '../components/CreateArtwork';
import ArtworkDetail from '../components/ArtworkDetail';
import UserProfile from '../components/UserProfile';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ArtworkList />,
  },
  {
    path: '/create',
    element: <CreateArtwork />,
  },
  {
    path: '/artwork/:id',
    element: <ArtworkDetail />,
  },
  {
    path: '/profile',
    element: <UserProfile />,
  },
];

// 导航菜单配置
export const menuItems = [
  {
    key: '1',
    path: '/',
    label: '作品广场',
    icon: 'AppstoreOutlined',
  },
  {
    key: '2',
    path: '/create',
    label: '发布作品',
    icon: 'PlusCircleOutlined',
  },
]; 