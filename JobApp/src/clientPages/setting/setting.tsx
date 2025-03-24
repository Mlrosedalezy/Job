import { NavBar, Cell, Toast } from 'react-vant';
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    return ( 
        <div style={{backgroundColor: '#f5f5f5',height: '100vh'}}>
            <NavBar title="设置" leftText={''} onClickLeft={() => { navigate(-1) }} />
            <Cell.Group title='账号安全' inset>
                <Cell title="更换手机号" isLink onClick={()=>{
                    navigate('/clientchange' )
                }} />
                <Cell onClick={()=>{
                    navigate('/clientdel')
                }}>
                    <span style={{color: 'red'}}>注销账号</span>
                </Cell>
                <Cell onClick={()=>{
                    localStorage.removeItem('AccessToken');
                    localStorage.removeItem('RefreshToken');
                    localStorage.removeItem('user');
                    navigate('/clientLogin', {replace: true});
                    Toast.success('退出成功')
                }}>
                    <span style={{color: 'red'}}>退出登录</span>
                </Cell>
            </Cell.Group>
        </div>
     );
}

export default App;