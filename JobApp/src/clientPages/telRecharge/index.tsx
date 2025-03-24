import { NavBar, Card, Input, Button, Divider  } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getVoucher, payment } from '../../api/index';
import './index.css'

function App() {
    const navigate = useNavigate();
    const qian = [50,100,200]
    const use = localStorage.getItem('user') as any
    const [tel,setTel] = useState(JSON.parse(use).tel) || '';
    const [checkQian, setCheckQian] = useState(-1)
    const [youMoney,setYouMoney] = useState(0)
    const [money,setMoney] = useState(0)

    const clickFang = (i:number)=>{
        setCheckQian(i)
        if(qian[i] >= 100){
            setMoney(qian[i] - youMoney)
        }else{
            setMoney(qian[i])
        }
    }
    useEffect(() => {
        getVoucher({type:'话费卷'}).then(res=>{
            if(res.data.data > 0){
                setYouMoney(10)
            }
        })
    },[])
    // 支付
    const recharge = ()=>{
        let data = {
            orderId: `ORDER_${Date.now()}`,
            price: money,
            name:'话费',
        };
        payment(data).then(res => {
            //跳转到支付页面
            window.location.href = res.data.data.paymentUrl
        })
    }

    return ( 
        <div className="telRecharge">
            <NavBar title="话费充值" leftText="" onClickLeft={() => navigate(-1)} />
            <Card round style={{margin: '10px'}}>
                <Card.Body>默认号码（中国移动）</Card.Body>
                <Card.Body>
                    <Input placeholder='请输入充值号码' value={tel} onChange={(e)=>setTel(e)} />
                    <Divider />
                </Card.Body>
                <Card.Body>
                    <div className="fang">
                        {qian.map((item,i)=>{
                            return(
                                <div key={i} onClick={()=>clickFang(i)} className={checkQian === i ? 'fang_item' : ''} >
                                    <p>{item}元</p>
                                    <p><small>
                                        {item>=100 ? `价格：${item-youMoney}.00元` : `价格：${item}`}
                                    </small></p>
                                </div>
                            )
                        })}
                    </div>
                    <p>需支付：{money}元</p>
                </Card.Body>
                <Card.Body>
                    <Button type="primary" onClick={()=>{recharge()}} block round disabled={checkQian===-1}>立即充值</Button>
                </Card.Body>
            </Card>
        </div>
     );
}

export default App;