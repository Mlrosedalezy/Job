import React, { useState } from 'react';
import { ConfigProvider, Input, Button, Checkbox, message } from 'antd';
import './UserAPPLogin.less';

interface UserAPPLoginProps {
  onPropertyManagementClick: (phoneNumber: string) => void;
}
const UserAPPLogin: React.FC<UserAPPLoginProps> = ({ onPropertyManagementClick }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checked, setChecked] = useState(false);
  const handleGetVerificationCode = () => {
    if (!phoneNumber) {
      message.error('请输入手机号');
      return;
    }
    if (!checked) {
      message.error('请阅读并同意《隐私政策》');
      return;
    }
    // 这里可以添加获取验证码的逻辑
    console.log('获取验证码', phoneNumber);
  };

  const handlePropertyManagementClick = () => {
    onPropertyManagementClick("accept");
  };

  return (
    <div className='UserApp-content'>
       <ConfigProvider>
      <div className="UserApp-container">
        <header>
          <button type="button" className="User-btn">×</button>
          <h1 className='UserApp-h1'>LOGO</h1>
          <p className='UserApp-p'>免注册，手机验证后快速登录</p>
        </header>
        <main>
          <Input
            placeholder="请输入手机号"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Checkbox checked={checked} onChange={(e) => setChecked(e)}>
            我已阅读并同意《隐私政策》
          </Checkbox>
          <Button block type="primary" onClick={handleGetVerificationCode}>
            获取验证码
          </Button>
          <div className="other-login-methods">
            <span>其他登陆方式</span>
            <Button block type="default">
              微信登录
            </Button>
          </div>
          <a href="#" onClick={handlePropertyManagementClick} className="property-management-entry">
            物业管理入口
          </a>
        </main>
      </div>
    </ConfigProvider>
    </div>
   
  );
};

export default UserAPPLogin;