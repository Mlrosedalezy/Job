import React, { useState } from 'react';
import { ConfigProvider,Checkbox } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './PropertyAPPLogin.less';
import {loginApi} from "../untils/api.tsx" // 导入封装后的 Axios 实例
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';

interface PropertyAPPLoginProps {
  onReturnUserClick: (phoneNumber: string) => void;
}

const PropertyAPPLogin: React.FC<PropertyAPPLoginProps> = ({ onReturnUserClick }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checked, setChecked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  let navigate = useNavigate();
  const handleGetVerificationCode = async () => {
    if (!phoneNumber) {
      Toast.show({
        content: '请输入手机号',
        icon: 'fail',
      });
      return;
    }
    if (!checked) {
      Toast.show({
        content: "请先阅读并同意《隐私政策》",
        icon: 'fail',
      });
      return;
    }

    try {
      const response = await loginApi.post('request-verification-code', { phoneNumber });
      console.log('获取验证码成功', response);
      Toast.show({
        content: '验证码已发送',
        icon: 'success',
      });
      setCountdown(60); // 启动倒计时
      navigate("/verificationCodeAuthentication", { state: { phoneNumber } });
    } catch (error) {
      console.error('获取验证码失败', error);
      Toast.show({
        content: "发送验证码失败，请稍后再试",
        icon: 'fail',
      });
    }
  };


  const handleGo = ()=>{
    onReturnUserClick("accept")
  }
  const handleReturnUserClick = () => {
    onReturnUserClick("send");
  };

  return (
    <div className='login-content'>
      <ConfigProvider>
        <div className="login-container">
          <header>
            <div className='Property-btn'><CloseOutlined onClick={handleGo} /></div>
            <h1 className='Property-h1'>你好，物业人员</h1>
            <p className='Property-p'>手机验证后快速登录</p>
          </header>
          <div className='login-form'>
            <input type="text" className='MobilePhoneNumberInputBox' placeholder="请输入手机号" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <Checkbox onChange={(e) => setChecked(e.target.checked)}>
              我已阅读并同意《隐私政策》
            </Checkbox>
            <button
              className="GetTheVerificationCodeButton"
              onClick={handleGetVerificationCode}
              disabled={countdown > 0} // 倒计时中禁用按钮
            >
              {countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码'} {/* 根据倒计时更新按钮文本 */}
            </button>
            <div className='return-user-entry-container'>
              <a href="#" className="return-user-entry" onClick={handleReturnUserClick}>
                返回用户入口
              </a>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default PropertyAPPLogin;