// src/components/MyPage.tsx
import React,{useEffect,useState} from 'react';
import './MyPage.less'; // 引入自定义样式文件
import { UserOutlined,RightOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import {loginApi} from "../untils/api"
import { useNavigate } from 'react-router-dom';


const MyPage: React.FC = () => {
  const [user, setUser] = useState<{
    id?: string;
    username?: string;
    phone?: string;
    avatar?: string;
    userName?:string;
  }>({});
  const navigate = useNavigate();

  const formatPhoneNumber = (phoneNumber: string): string => {
    if (phoneNumber.length !== 11) {
      return phoneNumber; // 如果不是11位号码，直接返回原号码
    }
    return phoneNumber.slice(0, 3) + '****' + phoneNumber.slice(7);
  };

  const formattedPhoneNumber = formatPhoneNumber(user.phone || '');



  useEffect(() => {
    const authDataStr = localStorage.getItem('authData');
    if (!authDataStr) {
      console.warn('No authData found in localStorage.');
      return;
    }
    
    let authData;
    try {
      authData = JSON.parse(authDataStr); // 解析 authData
    } catch (error) {
      console.error('Failed to parse authData:', error);
      return;
    }
    const fetchUserStatus = async () => {
      try {
        const response = await loginApi.post('/get-user-status', {
          accessToken: authData.accessToken,
        });
  
        if (response.data.isAuthenticated) {
          setUser({
            id: response.data.user.id,
            username: response.data.user.username,
            phone: response.data.user.phoneNumber,
            avatar: response.data.user.avatar,
            userName:response.data.user.userName
          });
        }
      } catch (error) {
        console.error('Failed to fetch user status:', error);
      }
    };
  
    fetchUserStatus();
  }, []);

  const handlePersonal = () => {
    
    navigate('/personalinformation',{state:{avatar:user.avatar,id:user.id,userName:user.userName,phone:user.phone}});
  };

  return (
    <div className="container">
      {/* Profile Section */}
      <div className="card profile-card">
        <div className="profile-info">
          <div className="avatar"><Avatar src={user.avatar} size={64} icon={<UserOutlined />} /></div>
          <div className="user-details">
              <p className="username">{user.userName || '未命名用户'}</p>
              <p className="phone">{formattedPhoneNumber}</p>
          </div>
          <div className="arrow" onClick={handlePersonal}><RightOutlined /></div>
        </div>
      </div>

      {/* Community Section */}
      <div className="card community-card">
        <div className="community-info">
          <div className="icon"></div>
          <p className="text">我的社区</p>
        </div>
        <p className="count">6</p>
      </div>

      {/* My Coupons Section */}
      <div className="card coupon-card">
        <div className="coupon-info">
          <div className="icon">🎟</div>
          <p className="text">我的卡券</p>
        </div>
        <div className="notification"></div>
      </div>

      {/* Settings & About */}
      <div className="card settings-card">
        <div className="settings-item">
          <p className="text">设置</p>
          <div className="arrow" onClick={() => navigate('/settings')}><RightOutlined /></div>
        </div>
        <div className="settings-item">
          <p className="text">关于</p>
          <p className="version">2.0.3</p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;