import { Layout, Menu, Dropdown, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppstoreOutlined, PlusCircleOutlined, LogoutOutlined, CopyOutlined, UserOutlined } from '@ant-design/icons';
import { menuItems } from '../routes';
import { ConnectButton, useCurrentAccount, useDisconnectWallet,useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useState, useEffect,useCallback,createContext } from 'react';
import { queryUser,createProfile,queryObj ,queryDynamicData} from '../lib/common';
import { Profile,UserProfile,profileDefaultValue ,UserLikes,userLikesDefaultValue} from '../lib/constants';
const { Header, Content, Footer } = Layout;

const iconMap: Record<string, React.ReactNode> = {
  AppstoreOutlined: <AppstoreOutlined />,
  PlusCircleOutlined: <PlusCircleOutlined />,
};

export const Context = createContext<UserProfile>({
  userLikes:userLikesDefaultValue,
  profile: profileDefaultValue
});

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const location = useLocation();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const [profile, setProfile] = useState<Profile>(profileDefaultValue);
  const [userLikes, setUserLikes] = useState<UserLikes>(userLikesDefaultValue);

  const fetchProfile = useCallback(async () => {
    if (currentAccount) {
      console.log("currentAccount-----",currentAccount);
      let userState = await queryUser();
      console.log("userState =====", userState);
      console.log(
        "userState users.length =====",
        userState.users.length,
      );
      let profileId = userState.users.find(
        (user) => user.owner === currentAccount?.address,
      )?.profile;
      console.log("useCallback-- profileID---", profileId);
      if (!profileId) {
        createPro();
        let userState = await queryUser();
        profileId = userState.users.find(
          (user) => user.owner === currentAccount?.address,
        )?.profile;
      }
      if(profileId){
        console.log("profileId...........", profileId);
        let profile: Profile = await queryObj<Profile>(profileId);
        setProfile(profile);
        let ownerLikes = await queryDynamicData(profile.likes.fields.id.id);
        setUserLikes(ownerLikes);
      }
    }
  }, [currentAccount]);


  const createPro = async () => {
    const tx = await createProfile();
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          console.log("createProfile success");
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  useEffect(() => {
    fetchProfile();
  }, [currentAccount]);

  const menuConfig = menuItems.map(item => ({
    key: item.key,
    icon: iconMap[item.icon],
    label: <Link to={item.path}>{item.label}</Link>,
  }));

  const currentKey = menuItems.find(item => item.path === location.pathname)?.key || '1';

  // 复制地址到剪贴板
  const copyAddress = () => {
    if (currentAccount?.address) {
      navigator.clipboard.writeText(currentAccount.address);
      message.success('地址已复制到剪贴板');
    }
  };

  // 钱包下拉菜单
  const walletItems = [
    {
      key: 'address',
      label: (
        <div className="wallet-address" onClick={copyAddress}>
          <span>{currentAccount?.address?.slice(0, 6)}...{currentAccount?.address?.slice(-4)}</span>
          <CopyOutlined style={{ marginLeft: 8 }} />
        </div>
      ),
    },
    {
      key: 'divider',
      type: 'divider' as const,
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'disconnect',
      danger: true,
      icon: <LogoutOutlined />,
      label: '断开连接',
      onClick: () => disconnect(),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            ChiliSmile
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[currentKey]}
            items={menuConfig}
            className="nav-menu"
          />
          {currentAccount ? (
            <Dropdown
              menu={{ items: walletItems }}
              placement="bottomRight"
              trigger={['click']}
              overlayClassName="wallet-dropdown"
            >
              <div className="wallet-button">
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </div>
            </Dropdown>
          ) : (
            <ConnectButton />
          )}
        </div>
      </Header>
      
      <Content style={{ padding: '24px', background: '#fff' }}>
      <Context.Provider value={{userLikes,profile}} >
         {children}
       </Context.Provider>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        ChiliSmile ©{new Date().getFullYear()} - 快乐创作，分享欢乐
      </Footer>
    </Layout>
  );
};

export default MainLayout; 