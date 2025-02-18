import { Card, Tabs, List, Tag, Typography, Statistic, Row, Col } from 'antd';
import { HeartOutlined, PictureOutlined, DollarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState ,useContext,useEffect,useCallback} from 'react';
import { Context} from '../layouts/MainLayout';
import { Artwork } from '../lib/constants';
import { queryState,queryObjs} from '../lib/common';
import { useCurrentAccount,useSignAndExecuteTransaction } from '@mysten/dapp-kit';

const { Title, Text } = Typography;

const UserProfile = () => {
  const {userLikes, profile} = useContext(Context);
  const currentAccount = useCurrentAccount();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);
  const [likesArtworks, setLikesArtworks] = useState<Artwork[]>([]);
  
  console.log('userArtworks-----',userArtworks);


  const fetchProfile = useCallback(async () => {
    if (currentAccount) {
      
    }
  }, [currentAccount]);

  const fetchArtworks = async () => {
      const atAddress = await queryState();
      const artworks  =  await  queryObjs<Artwork>(atAddress);
      console.log('artworks list-----> :Promise<T[]>',artworks);
      setArtworks(artworks);
      setUserArtworks(artworks.filter(art => art.owner === currentAccount?.address));
      setLikesArtworks(artworks.filter(art =>userLikes.likeBalance.has(art.id.id)));
    };

  useEffect(() => {
    fetchArtworks();
  }, []);
    
   
  useEffect(() => {
    fetchArtworks();
    fetchProfile();
  }, [currentAccount]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="user-profile-container"
    >
      <Card className="profile-card">
        <Row gutter={24} className="profile-header">
          <Col span={8}>
            <Statistic 
              title="创建的作品" 
              value={profile.artworks.length} 
              prefix={<PictureOutlined />} 
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="获得的点赞" 
              value={userArtworks.reduce((sum, art) => sum + parseInt(art.likes)  , 0)} 
              prefix={<HeartOutlined />} 
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="获得的收入" 
              value={userArtworks.reduce((sum, art) => sum + parseInt(art.likes)  * 0.1, 0)} 
              prefix={<DollarOutlined />}
              precision={2}
              suffix="SUI"
            />
          </Col>
        </Row>

        <Tabs
          items={[
            {
              key: '1',
              label: '我的作品',
              children: (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
                  dataSource={userArtworks}
                  renderItem={item => (
                    <List.Item>
                      <Link to={`/artwork/${item.id.id}`}>
                        <Card
                          hoverable
                          cover={<div className="artwork-cover" />}
                          className="artwork-card"
                        >
                          <Card.Meta
                            title={item.name}
                            description={
                              <>
                                <Tag color="blue">{item.model.variant}</Tag>
                                <div className="artwork-stats">
                                  <span><HeartOutlined /> {item.likes}</span>
                                  <span><DollarOutlined /> {( parseInt(item.likes)  * 0.1).toFixed(2)} SUI</span>
                                </div>
                              </>
                            }
                          />
                        </Card>
                      </Link>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: '2',
              label: '点赞的作品',
              children: (
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
                  dataSource={likesArtworks}
                  renderItem={item => (
                    <List.Item>
                      <Link to={`/artwork/${item.id.id}`}>
                        <Card
                          hoverable
                          cover={<div className="artwork-cover" />}
                          className="artwork-card"
                        >
                          <Card.Meta
                            title={item.name}
                            description={
                              <>
                                <Tag color="blue">{item.model.variant}</Tag>
                                <Text type="secondary">支付了 {0.1} SUI</Text>
                              </>
                            }
                          />
                        </Card>
                      </Link>
                    </List.Item>
                  )}
                />
              ),
            },
          ]}
        />
      </Card>
    </motion.div>
  );
};

export default UserProfile; 