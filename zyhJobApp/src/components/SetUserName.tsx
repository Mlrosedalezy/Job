import React,{useState} from 'react'
import { NavBar, Toast,Input,Form,Button } from 'antd-mobile'
import './SetUserName.less'
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../untils/api';
export default function SetUserName() {
  const [newUsername, setNewUsername] = useState('');
  const navigate = useNavigate();
  const back = () =>{
    window.history.back()
  }
  const handleSubmit = async () => {
      try {
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
  
        const response = await loginApi.post('/update-username', {
          accessToken: authData.accessToken,
          newUsername,
        });
  
        if (response.data.message === '用户名更新成功') {
          Toast.show({ content: '用户名更新成功', duration: 1000 });
          navigate("/home/mypage")
        } else {
          Toast.show({ content: response.data.message, duration: 1000 });
        }
      } catch (error) {
        console.error(error);
        Toast.show({ content: '用户名更新失败', duration: 1000 });
      }
    };

  return (
    <div className='setUser-container'>
      <div className='setUser-NavBar'><NavBar onBack={back}></NavBar></div>
      <div className='setUser-content'>
        <div className='setUser-title'>
          <Form>
            <Form.Item>
              <Input placeholder='请设置名称' clearable value={newUsername} onChange={(value) => setNewUsername(value)}  />
            </Form.Item>
          </Form>
        </div>
        <div className='setUser-btn'>
        <Button block color='primary' size='large' onClick={handleSubmit}>
            保存
          </Button>
        </div>
      </div>
    </div>
  )
}
