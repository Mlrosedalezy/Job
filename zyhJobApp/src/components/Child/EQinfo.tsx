// EQinfo.tsx
import React, { useEffect,useState } from 'react';
import { Card, Typography, Button, QRCode } from 'antd';
import { NavBar } from 'antd-mobile';
import { useLocation,useNavigate } from 'react-router-dom';
import './EQinfo.less';
import { EpassApi } from '../../untils/api';
import  {formatDate}   from "../../untils/dateUtils.ts"
const { Title, Text } = Typography;


const EQInfo: React.FC = () => {
  const location = useLocation();
  const { state } = location;
  const [qrcodes, setQrcodes] = useState<{ [key: number]: string | null }>({});
  const navigate = useNavigate();
  const generateQRCode = async () => {
    try {
      const response = await EpassApi.post('/generate-qrcode', {
        name: state.name,
        location: state.location,
        type: state.type
      });
      setQrcodes(response.data.qrCodeUrl );
      return response.data.qrCodeUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };
  const handleSaveImage = () => {
    if (!qrcodes) {
      console.warn('二维码尚未生成或加载失败');
      return;
    }

    const link = document.createElement('a');
    link.href = qrcodes;
    link.download = `${state.userlist.username}${state.location}(${state.type})`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  console.log(qrcodes,"qr")
  useEffect(() => {
    generateQRCode()
  }, []);

  return (
    <div className="eq-info-container">
      <div onClick={() => navigate(-1)}><NavBar></NavBar></div>
      <Title level={4}>通行二维码详情</Title>
      <Card className="eq-info-card">
        <div className="qr-code-section">
          
          <Title level={3} style={{ color: '#fff' }}>通行二维码</Title>
            <img
                src={qrcodes || "https://placehold.co/48x48"}
                alt="二维码"
                className="door-qrcode"
              />
          <Text style={{ color: '#fff' }}>使用“中移和社区”扫一扫</Text>
          <Text style={{ color: '#fff', textAlign: 'center' }}>{state.name}</Text>
          <Text style={{ color: '#fff', textAlign: 'center' }}>{state.location}</Text>
          <Button type="primary" style={{ backgroundColor: '#ff9c00', borderColor: '#ff9c00' }}>进</Button>
        </div>
        <div className="details-section">
          <div className='info-btn'>
            <Button type="link" onClick={handleSaveImage} style={{ color: '#1890ff' }}>保存图片</Button>
          </div>
          <div className="info-list">
            <div className="info-item">
              <Text strong>名称</Text>
              <Text>{state.name}</Text>
            </div>
            <div className="info-item">
              <Text strong>位置</Text>
              <Text>{state.location}</Text>
            </div>
            <div className="info-item">
              <Text strong>出入类型</Text>
              <Text>{state.type}</Text>
            </div>
            <div className="info-item">
              <Text strong>最后处理人</Text>
              <Text>{state.userTenement.userName+`（${state.userTenement.phoneNumber}）`}</Text>
            </div>
            <div className="info-item">
              <Text strong>提交时间</Text>
              <Text>{formatDate(state.startDate)}</Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EQInfo;