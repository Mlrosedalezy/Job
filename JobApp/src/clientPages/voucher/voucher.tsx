import { NavBar,Tabs,Cell,Button } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getVoucher } from '../../api/index'
import './voucher.css'
import dayjs from 'dayjs';

interface Voucher {
    name: string,
    type: string,
    time: number,
    num: number
}

function App() {
    const navigate = useNavigate();
    const [voucherList,setVoucherList] = useState<Voucher[]>([])
    const [checked, setChecked] = useState(0);

    // 使用卡卷
    const useVoucher = (item:Voucher)=>{
        console.log(item.type);
        
        if(item.type === '补签卡'){
            navigate('/clientji')
        } else if(item.type === '话费卷'){
            navigate('/clientTel')
        }
    }

    // 获取卡卷
    useEffect(()=>{
        getVoucher().then((res:any)=>{
            setVoucherList(res.data.data)
        })
    },[])

    return ( 
        <div className='voucher'>
            <NavBar onClickLeft={() => { navigate(-1) }} title={"我的卡卷"} />
            <div className="voucher_main">
                <Tabs border type='capsule' onChange={e=>{setChecked(Number(e))}}>
                    <Tabs.TabPane title={`卡卷`} />             
                    <Tabs.TabPane title={`已使用/过期`} />             
                </Tabs>

                <Cell.Group card className='voucher_list'>
                    {voucherList.map((item,i)=>{
                        if(item.time > Date.now() && checked === 0 && item.num > 0){
                            return(
                                <Cell key={i} title={item.type} 
                                    label={dayjs(item.time).format('YYYY-MM-DD HH:mm')+'过期'}
                                    value={
                                        <Button round size='small' onClick={()=>{useVoucher(item)}}>
                                            去使用
                                        </Button>}
                                     />                                   
                            )
                        }else if(item.time < Date.now() && checked === 1 || item.num === 0 && checked === 1){
                            return(
                                <Cell key={i} title={item.type} className='guoqi'
                                    label={dayjs(item.time).format('YYYY-MM-DD HH:mm')+'过期'}
                                    value={
                                        <Button round size='small' disabled>
                                            {item.num === 0 ? '已使用' : '已过期'}
                                        </Button>}
                                     />  
                            )
                        }
                    })}
                </Cell.Group>
            </div>
        </div>
     );
}

export default App;