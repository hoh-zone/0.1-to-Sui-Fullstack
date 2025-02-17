import { Card, Row, Col, Typography, Space, Input, Spin, BackTop } from 'antd';
import { HeartOutlined, EyeOutlined, SearchOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Artwork } from '../lib/constants';
import { queryState,queryObjs } from '../lib/common';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Title } = Typography;

const PAGE_SIZE = 8; // 每页显示的数量

const getModelIcon = (model: string) => {
  switch (model) {
    case 'LITERATURE':
      return '📝';
    case 'VIDEO':
      return '🎥';
    case 'PAINTING':
      return '🎨';
    case 'EMOJI':
      return '😊';
    default:
      return '📄';
  }
};

const ArtworkList = () => {
  const [searchText, setSearchText] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]); // 所有作品的原始数据
  const [displayArtworks, setDisplayArtworks] = useState<Artwork[]>([]); // 当前显示的作品（分页后）
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // 提取过滤逻辑为独立函数
  const filterArtworks = (artworks: Artwork[], searchText: string) => {
    return artworks.filter(artwork =>
      artwork.name.toLowerCase().includes(searchText.toLowerCase()) ||
      artwork.desc.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // 更新显示作品的函数
  const updateDisplayArtworks = (filtered: Artwork[], currentPage: number = 1) => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    
    if (currentPage === 1) {
      setDisplayArtworks(filtered.slice(0, PAGE_SIZE));
    } else {
      setDisplayArtworks(prev => [...prev, ...filtered.slice(start, end)]);
    }
    
    setPage(currentPage);
    setHasMore(end < filtered.length);
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  // 当搜索文本改变时，过滤作品
  useEffect(() => {
    if (artworks.length > 0) {
      const filtered = filterArtworks(artworks, searchText);
      updateDisplayArtworks(filtered);
    }
  }, [searchText, artworks]);

  const fetchArtworks = async () => {
    const atAddress = await queryState();
    const fetchedArtworks = await queryObjs<Artwork>(atAddress);
    setArtworks(fetchedArtworks);
    updateDisplayArtworks(fetchedArtworks);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setTimeout(() => {
      const filtered = filterArtworks(artworks, searchText);
      updateDisplayArtworks(filtered, nextPage);
    }, 500);
  };

  return (
    <div className="artwork-container">
      <div className="artwork-header">
        <Title level={2}>创作广场</Title>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索作品..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <InfiniteScroll
        dataLength={displayArtworks.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin tip="加载中..." />
          </div>
        }
        endMessage={
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            {displayArtworks.length > 0 ? '已经到底啦 ~' : '暂无作品'}
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {displayArtworks.map(artwork => (
            <Col xs={24} sm={12} md={8} lg={6} key={artwork.id.id}>
              <Link to={`/artwork/${artwork.id.id}`}>
                <Card
                  hoverable
                  className="artwork-card"
                  cover={
                    <div className="artwork-cover">
                      <div className="artwork-type">
                        <span className="model-icon">{getModelIcon(artwork.model.variant)}</span>
                        <span className="model-text">{artwork.model.variant}</span>
                      </div>
                    </div>
                  }
                  actions={[
                    <Space>
                      <HeartOutlined className="action-icon" />
                      <span className="action-count">{artwork.likes}</span>
                    </Space>,
                    <EyeOutlined className="action-icon" />
                  ]}
                >
                  <Card.Meta
                    title={artwork.name}
                    description={
                      <div className="card-description">
                        <div>{artwork.desc}</div>
                        <div className="card-footer">
                          {artwork.create_time}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>

      <BackTop>
        <div className="back-top-btn">
          <VerticalAlignTopOutlined />
        </div>
      </BackTop>
    </div>
  );
};

export default ArtworkList; 