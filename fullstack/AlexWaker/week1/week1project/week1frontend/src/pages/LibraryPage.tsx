import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './Header';
import { Box } from '@radix-ui/themes';
// import { ImageNFT } from './CommonPage';
import { objectList } from './MainPage';

const LibraryContent: React.FC = () => {
  const { image_id } = useParams();  //从url中取出一个叫 id 的参数
  // const { issue_id } = useParams();
  const images = objectList;

  const image = images.find((img) => img.id === image_id) || {
    name: 'Unknown',
    description: 'No information available.',
    url: '',
  };

  return (
    <Box className="allLibraryPage">
      <Header />
      <Box style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
        {/* A 部分：大图片 */}
        <Box style={{ flex: 1, marginRight: '20px' }}>
          <img 
            src={image.url} 
            alt="Large Display" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
          />
        </Box>

        {/* B 和 C 部分 */}
        <Box style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* B 部分：展示一段话 */}
          <Box style={{ flex: 1, backgroundColor: '#000000', padding: '20px', borderRadius: '10px', overflow: 'auto' }}>
            <h2>{image.name}</h2>
            <p>
              {image.description}
            </p>
          </Box>

          {/* C 部分：可滚动的小窗口 */}
          <Box style={{ flex: 1.5, backgroundColor: '#000000', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', overflowY: 'scroll' }}>
            <h3>相关内容</h3>
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              {Array.from({ length: 20 }).map((_, index) => (
                <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <Link to={`/${image_id}/${index + 1}`}>相关条目 {index + 1}</Link>
                </li>
              ))}
            </ul>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LibraryContent;

