import { Image, Cell } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import './main.css'

function App() {
    const navigate = useNavigate()
    const user = localStorage.getItem("user")
    let image = ''
    let name = ''
    if(user){
        image = JSON.parse(user).img
        name = JSON.parse(user).username
    }
    return ( 
        <div className='main'>
            <div className="top">
                <div className="top_left">
                    <Image round fit='cover' width={70} height={70} src={image} />
                    <p>{name}</p>                    
                </div>
                <div className="top_right">
                    <div onClick={()=>navigate('/clientji')}>签到</div>
                </div>
            </div>
            <div className="center">
                <div className='center_item'>
                    <div></div>
                    <small>我的房屋</small>
                </div>
                <div className='center_item'>
                    <div></div>
                    <small>我的家庭</small>
                </div>
                <div className='center_item'>
                    <div></div>
                    <small>我的车辆</small>
                </div>
            </div>
            <div className="bottom">
                <Cell title='我的卡卷' isLink onClick={()=>{navigate('/clientVoucher')}} />
                <Cell title='设置' isLink onClick={()=>{navigate('/clientSetting')}} />
                <Cell title='其他服务' isLink />
                <Cell title='关于' isLink value='2.03' />
            </div>
        </div>
    );
}

export default App;
