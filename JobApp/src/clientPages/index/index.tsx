import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabbar } from 'react-vant'
import { FriendsO, HomeO, Search, ChatO } from '@react-vant/icons'
import { Outlet } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate()
  const [name,setName] = useState('home')
  const path = location.pathname.split('/')[2]

  useEffect(() => {
    if(path === 'home' || path === 'xiaoxi' || path === 'fuwu' || path === 'main'){
      setName(path)
    }
  },[path])
  
  const changePage = (v: string) => { 
    navigate(`/clientIndex/${v}`)
    setName(v)
  }

  return (
    <div>
      <Outlet />
      <div className='demo-tabbar' style={{marginTop: '50px'}}>
        <Tabbar value={name} onChange={v => changePage(v.toString())}>
          <Tabbar.Item name='home' icon={<HomeO />}>
            首页
          </Tabbar.Item>
          <Tabbar.Item name='fuwu' icon={<Search />}>
            服务
          </Tabbar.Item>
          <Tabbar.Item name='xiaoxi' icon={<ChatO />}>
            消息
          </Tabbar.Item>
          <Tabbar.Item name='main' icon={<FriendsO />}>
            我的
          </Tabbar.Item>
        </Tabbar>
      </div>
    </div>
  );
};

export default App;