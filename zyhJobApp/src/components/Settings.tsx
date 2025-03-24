import React,{useState} from 'react'
import { NavBar, Toast,Modal  } from 'antd-mobile'
import './Setting.less'
import {useAuth} from "../context/AuthContext"
export default function ServicePage() {
  const [visible, setVisible] = useState(false);
  const {logout} = useAuth();
  const back = () =>{
    window.history.back()
  }


  const handleConfirm = () => {
    // 这里可以添加退出登录的逻辑，例如清除token等
    Toast.show({ content: '已退出登录', duration: 1000 });
    setVisible(false);
    logout();
    window.location.href = '/login';
  };

  const showSubmitConfirm = () => {
    Modal.confirm({
      content: '是否提交申请',
      onConfirm: async () => {
        handleConfirm()
        Toast.show({
          icon: 'success',
          content: '提交成功',
          position: 'bottom',
        });
      },
    });
  };

  return (
    <div className="settings-container">
      <div className="settings-nav">
        <NavBar onBack={back}>设置</NavBar>
      </div>
      <div className="settings-content">
        <span className="section-title">应用设置</span>
        <div className="option">常用服务配置</div>
      </div>
      <div className="logout-btn" onClick={showSubmitConfirm}>退出登录</div>
    </div>
  )
}
