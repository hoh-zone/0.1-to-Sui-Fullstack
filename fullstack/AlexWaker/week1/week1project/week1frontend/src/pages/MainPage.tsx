import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@mysten/dapp-kit';
import { Box } from '@radix-ui/themes';
import './MainPage.css';
import { useState } from 'react';
import { useCurrentWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { ImageNFT, TestClient } from './CommonPage';
import { SuiObjectResponse } from '@mysten/sui/client';

interface ObjectItem {
  id: string;
  name: string;
  description: string;
  url: string;
} //这就类似于struct结构体，json格式

export let objectList: ObjectItem[] = [];

const MainPage: React.FC = () => {
  // const [object, setObject] = React.useState<SuiObjectResponse | null>(null);
  // const navigate = useNavigate();
  
  // for(let i = 0; i < ImageNFT.length; i++) {
  //   React.useEffect(() => {
  //     const fetchObject = async () => {
  //       const result = await TestClient.getObject({id: ImageNFT[i].onjectid, options: { showContent: true } });
  //       console.log(result);
  //       setObject(result);
  //     };
  //     fetchObject();
  //   }, []);
  //   if (object) {
  //     newObjectList.push(
  //       {
  //         id: ImageNFT[i].id, 
  //         name: object?.data?.content?.fields?.name,
  //         description: object?.data?.content?.fields?.description,
  //         url: object?.data?.content?.fields?.image 
  //       }
  //     );
  //   }
  // }

  const [newObjectList, setNewObjectList] = useState<ObjectItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // 使用 Promise.all 并行获取所有对象
      const results = await Promise.all(
        ImageNFT.map(async (nft) => {
          const result = await TestClient.getObject({
            id: nft.onjectid,
            options: { showContent: true },
          });
          return {
            id: nft.id,
            name: result?.data?.content?.fields?.name || 'Unknown',
            description: result?.data?.content?.fields?.description || 'No description available',
            url: result?.data?.content?.fields?.image || '',
          };
        })
      );
      setNewObjectList(results); // 更新状态
    };

    fetchData();
  }, []);

  objectList = newObjectList;
  const handleImageClick = (id: string) => {
    navigate(`/${id}`);
  };
  const images = ImageNFT;


  return (
    <Box className="allMainPage">

      <Header />
      <Box className="main">
        <Box className="main-title" style={{ marginTop: '0' }}>
          <h1>Welcome to the Library of Human Freedom Academy</h1>
        </Box>
        <Box className="main-description" style={{ maxWidth: '800px', margin: '0 auto', marginTop: '0px' }}>
          <h2>
            This is a free academic website built on the Walrus, where you can publish your papers or explore anyone
            else's ideas.
          </h2>
        </Box>
        <Box className="search-box" style={{ width: '70%', marginTop: '30px' }}>
          <input
            type="text"
            placeholder="Search..."
            style={{
              borderRadius: '50px',
              width: '100%',
              padding: '20px',
              border: '1px solid #ccc',
            }}
          />
        </Box>
        <Box className="image-gallery" style={{ width: '80%', display: 'flex', flexWrap: 'wrap', marginTop: '30px' }}>
          {newObjectList.map((item) => (
            <Box key={item.id} style={{ flex: '1 0 21%', margin: '10px' }}>
              <img
                src={item.url}
                alt="Image 1"
                style={{ width: '100%', borderRadius: '10px' }}
                onClick={() => handleImageClick(item.id)}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="footer">
        <footer className="footer">
          <p>&copy; 2024 My Website. All rights reserved.</p>
        </footer>
      </Box>
      {/* 弹窗 */}


    </Box>
  );
};

export default MainPage;
