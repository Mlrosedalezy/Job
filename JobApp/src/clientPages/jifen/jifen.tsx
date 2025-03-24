import { NavBar,Toast,Cell,Button,Dialog } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { addVoucher, getVoucher, useBuVoucher } from '../../api/index'
import dayjs from 'dayjs';
import img1 from "./image/1.png" 
import img2 from "./image/2.png"
import './jifen.css'

function App() {
    const navigate = useNavigate();
    const [qian,setQian] = useState(10) //累计签到
    const [ji,setJi] = useState(1200) //积分
    const [qi,setQi] = useState(0) //当前日期
    const [visible, setVisible] = useState(false); // 商品弹出框
    const [visible1, setVisible1] = useState(false); // 补签弹出框
    const [week,setWeek] = useState([
        {name: '周一',value: 1,isQian: false},
        {name: '周二',value: 2,isQian: false},
        {name: '周三',value: 3,isQian: false},
        {name: '周四',value: 4,isQian: false},
        {name: '周五',value: 6,isQian: false},
        {name: '周六',value: 8,isQian: false},
        {name: '周日',value: 10,isQian: false}
    ])
    const [zhuan,setZhuan] = useState([true,false,false,false]) // 赚积分的按钮
     
    const shop = [
        {name:"【话费满减】满100.00元充值可用",xuJi:50,type:'话费卷',img:img1},
        {name:"【补签卡】补签卡兑换",xuJi:10,type:'补签卡',img:img2},
    ]
    const [i,setI] = useState(0)  // 对应商品的索引

    const shopRef = useRef<HTMLDivElement>(null); // 获取商品列表的dom，用于滚动

    const [buCard,setBuCard] = useState(0) //补签卡数量
    const [weekI,setWeekI] = useState(0) //当前点击的日期索引

    useEffect(() => {
        // 获取当前日期
        const now = dayjs();
        // 获取当前日期是星期几
        const dayOfWeek = now.day();
        setQi(dayOfWeek-1)
    },[])

    // 点击签到
    const qianDao = (index:number) => {
        let newWeek = [...week]
        newWeek[index].isQian = true
        setWeek(newWeek)
        Toast.success('签到成功')
        setJi(ji+newWeek[index].value)
        setQian(qian+1)
    }

    // 补签
    const buQian = async (index:number) => {
        let res = await getVoucher({type:'补签卡'})
        if(res.data.code == 200){
            setBuCard(res.data.data)
            setWeekI(index)
            setVisible1(true)
        }

    }
    // 使用补签卡
    const useBu = async () => {
        if(buCard <= 0){
            Toast.info('补签卡数量不足')
            return
        }else{
            let res = await useBuVoucher()
            if(res.data.code == 200){
                let newWeek = [...week]
                newWeek[weekI].isQian = true
                setWeek(newWeek)
                Toast.success('补签成功')
                setJi(ji+newWeek[weekI].value)
                setQian(qian+1)
                setVisible1(false)
            }
        }      
    }

    // 跳转到指定位置
    const jumpTo = ()=>{
        window.scrollTo({
            top: shopRef.current?.offsetTop,
            behavior: 'smooth'
        })
    }

    // 完成任务
    const ren = (i:number)=>{
        let newZhuan = [...zhuan]
        newZhuan[i] = true
        setZhuan(newZhuan)
        Toast.success('任务完成')
        setJi(ji+1)
    }

    // 兑换卡卷
    const dui = async ()=>{
        if(ji < shop[i].xuJi){
            Toast.info('积分不足')
        }else{
            let card = shop[i]
            let params={} as any
            params.name=card.name
            params.type=card.type
            params.time=Date.now()+3*24*60*60*1000
            
            let res = await addVoucher(params) as any
            if(res.data.code){
                Toast.success('兑换成功')
                setJi(ji-shop[i].xuJi)
            }else{
                Toast.fail('兑换失败')
            }
        }  
    }

    return ( 
        <div className='ji'>
            <NavBar onClickLeft={() => { navigate(-1) }} />
            <div className="ji_main">
                <p style={{fontSize: '1.3rem'}}>领积分</p>
                <div className='ji_card'>
                    <div>
                        <p>{ji}</p>
                        <small onClick={()=>{jumpTo()}}>积分兑好礼 &gt;</small>
                    </div>
                    <div>
                        <p>{qian}</p>
                        <small>累计签到</small>
                    </div>
                </div>
                <div className='ji_week'>
                    {week.map((item,i)=>{
                        if(i>qi){
                            return(
                                <div key={i} className={`${item.isQian ? 'qian' : 'wei'}`}>
                                    <p>{item.name}</p>
                                    <p>{item.value}</p>
                                    {!item.isQian && 
                                    <div className='bu' onClick={()=>{buQian(i)}}><small>补签</small></div>}
                                </div>
                            )
                        }else if(i==qi){
                            return(
                                <div key={i} className={`${item.isQian ? 'qian' : 'wei'}`}>
                                    <p>{item.name}</p>
                                    <p>{item.value}</p>
                                    {!item.isQian &&
                                     <div className='bu' onClick={()=>{qianDao(i)}}><small>签到</small></div>}
                                </div>
                            )
                        }else{
                            return(
                                <div key={i} onClick={()=>{Toast.info('时间未到')}}>
                                    <p>{item.name}</p>
                                    <p>{item.value}</p>
                                </div>
                            )
                        }
                    })}
                </div>

                <div className="addJI">
                    <Cell.Group title='做任务领积分'>
                        {zhuan.map((item,i)=>{
                            return(
                                <Cell key={i} title='查看社区公告' label='可领取1积分'
                                value={
                                    <Button type='primary' round size='small' disabled={item}
                                        onClick={()=>{ren(i)}}>
                                        {item?'已完成':'去完成'}
                                    </Button>}
                                 />                                
                            )
                        })}
                    </Cell.Group>                    
                </div>
                <Cell.Group title='积分商城' />
                <div className="shop" ref={shopRef}>
                    {shop.map((item,i)=>{
                        return(
                            <div key={i} className="shopItem" onClick={()=>{setVisible(true),setI(i)}}>
                                <img src={item.img} alt="加载失败" />
                                <p>{item.name}</p>
                                <span>{item.xuJi}积分</span>
                            </div>
                        )
                    })
                    }
                </div>
                
                <p className='noMore'><small>没有更多了</small></p>
            </div>

            {/* 商品弹出框 */}
            <Dialog
                visible={visible}
                title="兑换"
                showCancelButton
                onConfirm={() => {
                    setVisible(false)
                    dui()
                }}
                onCancel={() => setVisible(false)}
            >
                <div style={{ textAlign: 'center',width:"80%",margin:"0 auto"}}>
                    <p>
                        兑换此话费满减卡，需要消耗&nbsp;<span style={{color:'orange'}}>{shop[i].xuJi}</span>&nbsp;积分，确认兑换？
                    </p>
                </div>
            </Dialog>

            {/* 补签弹出框 */}
            <Dialog
                visible={visible1}
                title="补签"
                showCancelButton
                onConfirm={() => {
                    setVisible1(false)
                    useBu()
                }}
                onCancel={() => setVisible1(false)}
            >
                <div style={{ textAlign: 'center',width:"80%",margin:"0 auto"}}>
                    <p>
                        剩余补签卡&nbsp;<span style={{color:'orange'}}>{buCard}</span>&nbsp;，确认要使用吗？
                    </p>
                </div>
            </Dialog>
        </div>
     );
}

export default App;