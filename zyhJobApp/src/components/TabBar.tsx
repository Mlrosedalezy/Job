// src/components/TabBar.tsx
import React, { useState } from 'react';
import './TabBar.less'; // 引入自定义样式文件
import { useNavigate,useLocation } from 'react-router-dom';

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    navigate(tab);
  };

  return (
    <div className="tab-bar">
      <div 
        className={`tab-item ${activeTab === '/home/homepage' ? 'active' : ''}`}
        onClick={() => handleTabClick('/home/homepage')}
      >
        首页
      </div>
      <div
        className={`tab-item ${activeTab === '/home/servicepage' ? 'active' : ''}`}
        onClick={() => handleTabClick('/home/servicepage')}
      >
        服务
      </div>
      <div
        className={`tab-item ${activeTab === '/home/mypage' ? 'active' : ''}`}
        onClick={() => handleTabClick('/home/mypage')}
      >
        我的
      </div>
    </div>
  );
};

export default TabBar;