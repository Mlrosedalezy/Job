// src/Login/VerificationCodeAuthentication.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ConfigProvider, Typography, Row, Col } from 'antd';
import { Toast } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import OtpInput from 'react-otp-input';
import './VerificationCodeAuthentication.less';
import {loginApi} from "../untils/api";

const { Title, Paragraph } = Typography;

interface VerificationCodeAuthenticationProps {
  onReturnUserClick: (phoneNumber: string) => void;
}

const formatPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.length !== 11) {
    return phoneNumber; // 如果不是11位号码，直接返回原号码
  }
  return phoneNumber.slice(0, 3) + '****' + phoneNumber.slice(7);
};

const VerificationCodeAuthentication: React.FC<VerificationCodeAuthenticationProps> = ({ onReturnUserClick }) => {
  const { login } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const phoneNumber = location.state?.phoneNumber || '';
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 格式化手机号码
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  const handleTop = (value: string) => {
    setOtp(value);
  };

  useEffect(() => {
    if (otp.length === 6) {
      console.log("验证码：", otp);
      verifyCode();
    }
  }, [otp]);

  const verifyCode = async () => {
    console.log("正在执行验证码验证");
    setLoading(true);
    try {
      const response = await loginApi.post('verify-verification-code', {
        phoneNumber: phoneNumber,
        code: otp,
      });

      const data = response.data;
      console.log(response);
      if (response.status === 200) {
        Toast.show({
          content: '验证码验证成功',
          icon: 'success',
        });

        login(data.accessToken, data.refreshToken,data.expiresAt); // 设置登录状态和 token
        navigate('/home/homepage');
      } 
    } catch (error:any) {
      console.error("验证码验证失败", error);
      if (error.response.status === 400) {
        Toast.show({
          content:  error.response.data.message,
          icon: 'fail',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGo = () => {
    navigate(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const handleResendCode = () => {
    if (timerRef.current) clearInterval(timerRef.current); // 清除之前的定时器
    setCountdown(60); // 重置倒计时
    startCountdown(); // 重新启动倒计时
    setOtp("");
    handleGetVerificationCode();
  };

  const handleGetVerificationCode = async () => {
    try {
      const response = await loginApi.post('request-verification-code', { phoneNumber });
      if (response) {
        console.log('获取验证码成功', response);
        setMessage('验证码已发送');
        Toast.show({
          content: '验证码已发送',
          icon: 'success',
        });
      } else {
        console.error('获取验证码失败，响应为空');
        setMessage('发送验证码失败，请稍后再试');
        Toast.show({
          content: '发送验证码失败，请稍后再试',
          icon: 'fail',
        });
      }
    } catch (error) {
      console.error('获取验证码失败', error);
      setMessage('发送验证码失败，请稍后再试');
      Toast.show({
        content: '发送验证码失败，请稍后再试',
        icon: 'fail',
      });
    }
  };

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current); // 确保只有一个定时器运行
    timerRef.current = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    // 启动倒计时
    startCountdown();

    // 清理定时器
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className='verification-content'>
      <ConfigProvider>
        <div className="verification-container">
          <Row justify="start" align="middle">
            <Col span={24} xs={24} sm={20} md={18} lg={16} xl={14} xxl={12}>
              <header>
                <LeftOutlined style={{ marginBottom: '30px' }} className='verification-icon' onClick={handleGo} />
                <Title className='verification-title' level={1}>输入短信验证码</Title>
                <Paragraph className='verification-paragraph'>
                  验证码已发送至 {formattedPhoneNumber}，请在下方输入6位验证码
                </Paragraph>
              </header>
              <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className='verification-OtpInput'>
                  <OtpInput
                    inputType="number"
                    inputStyle={{ width: '40px', height: '50px', margin: '0 5px', fontSize: '20px', borderRadius: "2px", border: "none", color: "#888888" }}
                    value={otp}
                    onChange={handleTop}
                    numInputs={6}
                    shouldAutoFocus={true}
                    renderInput={(props) => <input {...props} />}
                  />
                </div>
                <p style={{ marginTop: '20px', marginLeft: '10px' }} className='verification-code'>
                  {countdown > 0 ? (
                    `${countdown}s 后重发验证码`
                  ) : (
                    <a onClick={handleResendCode} style={{ cursor: 'pointer', color: '#1890ff' }}>重发验证码</a>
                  )}
                </p>
              </main>
            </Col>
          </Row>
        </div>
      </ConfigProvider>
    </div>
  );
};

export default VerificationCodeAuthentication;