import { Form, Input, Select, Button, Typography, message, Card, Space } from 'antd';
import { useState ,useContext} from 'react';
import { Context} from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modelMap,SaveArtwork } from '../lib/constants';
import { createArtworkTx } from '../lib/artworks';
import { SendOutlined, LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCurrentAccount,useSignAndExecuteTransaction } from '@mysten/dapp-kit';


const { Title } = Typography;
const { TextArea } = Input;

const CreateArtwork = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const {profile} = useContext(Context);
   
  const onFinish = async (artwork: SaveArtwork) => {
    console.log('profile.id.id-----',profile.id.id)
    if(currentAccount && profile.id.id){
      setLoading(true);
      const tx = await createArtworkTx(artwork.name, artwork.desc, artwork.content, artwork.model, profile.id.id);
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            setLoading(false);
            navigate('/');
            console.log("Artwork created");
          },
          onError: (error) => {
            console.log(error);
          },
        },
      );
    }
  };

  return (
    <motion.div 
      className="create-artwork-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        icon={<ArrowLeftOutlined />} 
        className="back-button"
        onClick={() => navigate(-1)}
      >
        返回
      </Button>

      <Card className="create-form-card">
        <Title level={2} className="page-title">创作新作品</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="create-form"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Form.Item
              name="name"
              label="作品标题"
              rules={[{ required: true, message: '请输入作品标题' }]}
            >
              <Input size="large" placeholder="给你的作品起个名字" />
            </Form.Item>

            <Form.Item
              name="desc"
              label="作品简介"
              rules={[{ required: true, message: '请输入作品简介' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="简单介绍一下你的作品"
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              name="content"
              label="作品内容"
              rules={[{ required: true, message: '请输入作品内容' }]}
            >
              <TextArea 
                rows={8} 
                placeholder="在这里创作你的内容"
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item
              name="model"
              label="作品类型"
              rules={[{ required: true, message: '请选择作品类型' }]}
            >
              <Select size="large">
                <Select.Option value={modelMap.get("LITERATURE")} >文学</Select.Option>
                <Select.Option value={modelMap.get( "VIDEO")}>视频</Select.Option>
                <Select.Option value={modelMap.get("PAINTING")}>绘画</Select.Option>
                <Select.Option value={modelMap.get("EMOJI")}>表情包</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space size="middle">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={loading ? <LoadingOutlined /> : <SendOutlined />}
                  size="large"
                  className="submit-button"
                >
                  发布作品
                </Button>
                <Button 
                  size="large" 
                  onClick={() => navigate(-1)}
                  className="cancel-button"
                >
                  取消
                </Button>
              </Space>
            </Form.Item>
          </motion.div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default CreateArtwork; 