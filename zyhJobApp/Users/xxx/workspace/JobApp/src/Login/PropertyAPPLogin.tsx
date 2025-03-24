// src/Login/PropertyAPPLogin.tsx

import React, { useState } from 'react';
import { Modal, Button, Input, Checkbox, ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';

interface PropertyAPPLoginProps {
    onClose: () => void;
}

const PropertyAPPLogin: React.FC<PropertyAPPLoginProps> = ({ onClose }) => {
    const [visible, setVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [checked, setChecked] = useState(false);

    const handleOpenModal = () => {
        setVisible(true);
    };

    const handleCloseModal = () => {
        setVisible(false);
        onClose();
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
    };

    return (
        <ConfigProvider locale={zhCN}>
            <Modal visible={visible} onClose={handleCloseModal}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h3>你好，物业人员</h3>
                    <p>手机验证后快速登录</p>
                </div>
                <Input
                    placeholder="请输入手机号"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    style={{
                        marginBottom: '10px',
                        borderRadius: '20px',
                        padding: '10px',
                        border: 'none',
                        boxShadow: '0 0 5px rgba(0,0,0,0.1)'
                    }}
                />
                <Checkbox checked={checked} onChange={handleCheckboxChange} style={{ marginBottom: '20px' }}>
                    我已阅读并同意《隐私政策》
                </Checkbox>
                <Button
                    type="primary"
                    block
                    disabled={!checked || !phoneNumber}
                    onClick={() => console.log('获取验证码')}
                    style={{
                        marginTop: '20px',
                        borderRadius: '20px',
                        padding: '10px',
                        boxShadow: '0 0 5px rgba(0,0,0,0.1)'
                    }}
                >
                    获取验证码
                </Button>
            </Modal>

        </ConfigProvider>
    );
};

export default PropertyAPPLogin;