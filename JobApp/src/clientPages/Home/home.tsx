import { NoticeBar, Swiper, Grid, Card,Toast } from 'react-vant'
import { useNavigate } from 'react-router-dom'
import { ShopO } from '@react-vant/icons'
import './home.css'

function App() {
    const navigate = useNavigate()
    const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']

    return (
        <div>
            <div className="bg"></div>
            <div className="demo-swiper">
                <Swiper autoplay={5000}>
                    {colors.map((color,index) => (
                        <Swiper.Item key={color}>
                            <div className='demo-swiper__item' style={{backgroundColor:color}} onClick={() => {Toast.info(`你点击了卡片 ${index + 1}`)}}>
                                {index + 1}
                            </div>
                        </Swiper.Item>
                    ))}
                </Swiper>
            </div>                    

            <NoticeBar color='#000' background="#fff" style={{width:'318px',margin:'0 auto'}}
                rightIcon={'更多'} onClick={()=>{navigate('/clientIndex/gao')}}>
                <Swiper
                    autoplay={3000}
                    indicator={false}
                    vertical
                    className='notice-swipe'
                >
                    <Swiper.Item><small>1号电梯维护中，大家不要使用</small></Swiper.Item>
                    <Swiper.Item><small>1号电梯水管改造，停供水12小时</small></Swiper.Item>
                    <Swiper.Item><small>2号电梯维护中，请走楼梯</small></Swiper.Item>
                </Swiper>
            </NoticeBar>

            <div className='grid'>
                <Card round>
                    <Card.Header style={{ fontSize: '14px',fontWeight: 'normal',color: 'gray'}}>
                        常用服务
                    </Card.Header>
                    <Card.Body>
                        <Grid square>
                            {Array.from({ length: 7 }, (_, i) => (
                                <Grid.Item key={i} icon={<ShopO />} text='文字' />
                            ))}
                            <Grid.Item icon={<ShopO />} text='更多' onClick={()=>{navigate('/clientIndex/fuwu')}} />
                        </Grid>                         
                    </Card.Body>
                </Card>          
            </div>

            <div className='grid'>
                <Card round>
                    <Card.Header style={{ fontSize: '14px',fontWeight: 'normal',color: 'gray'}} extra={'更多'}>
                        便民助手
                    </Card.Header>
                    <Card.Body>
                        <Grid square>
                            {Array.from({ length: 8 }, (_, i) => (
                                <Grid.Item key={i} icon={<ShopO />} text='文字' />
                            ))}
                        </Grid>                         
                    </Card.Body>
                </Card>          
            </div>
        </div>
    );
}

export default App;