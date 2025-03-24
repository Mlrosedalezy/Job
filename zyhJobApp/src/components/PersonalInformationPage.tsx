import React from 'react'
import { NavBar,Form, Input } from 'antd-mobile'
import { useLocation,useNavigate } from 'react-router-dom'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { RightOutline } from 'antd-mobile-icons'
import './PersonalInformationPage.less'

interface UserState {
    avatar?: string;
    id?: string;
    userName?: string;
    phone?: string;
  }
export default function PersonalInformationPage() {
    const location = useLocation()
    const {state} = location
    const userData = state && typeof state === 'object' ? (state as UserState) : {};
    const navigate = useNavigate();
    const back = () => {
        window.history.back()
    }

    const setUserName = ()=>{
      navigate('/SetUserName',{state:{userName:userData.userName,id:userData.id}})
    }
  return (
    <div className='PersonalInformationPage'>
        <div className='navbar'>
        <NavBar onBack={back}>个人信息</NavBar>
        </div>
        <div className='PersonalInformationPage-avatar'>
        <Avatar className='avatar' size={90} icon={<UserOutlined />} src={userData.avatar} />
        </div>
        <div className='personalInformationPage-form'>
        <Form layout='horizontal'>
          <Form.Item
            label='昵称'
            extra={
              <div onClick={setUserName}>
                <RightOutline  />
              </div>
            }
          >
            <Input placeholder={userData.userName} readOnly={true} clearable />
          </Form.Item>
          <Form.Item label='手机号' name='password'>
            <Input placeholder={userData.phone} clearable readOnly={true}  />
          </Form.Item>
        </Form>
        </div>
    </div>
  )
}
