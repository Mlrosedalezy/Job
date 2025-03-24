import { NavBar,Cell } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import './gao.css'

function App() {
    const navigate = useNavigate();
    return ( 
        <div>
            <NavBar
                leftText="返回"
                onClickLeft={() => navigate(-1)}
                className='nav'
             />

            <Cell style={{marginTop:'10px'}}>
                <p>1号电梯维护中，大家不要使用</p>
                <p>2021年3月29日09：22:22</p>
            </Cell>
            <Cell style={{marginTop:'10px'}}>
                <p>1号电梯水管改造，停供水12小时</p>
                <p>2021年3月29日09：22:22</p>
            </Cell>
            <Cell style={{marginTop:'10px'}}>
                <p>2号电梯维护中，请走楼梯</p>
                <p>2021年3月29日09：22:22</p>
            </Cell>
        </div>
    );
}

export default App;