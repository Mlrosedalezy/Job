import { Card,Grid } from 'react-vant';
import { ShopO } from '@react-vant/icons'
import './fuwu.css'

function App() {
    return ( 
        <div className="fuwu">
            <h3>服务</h3>
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
                        </Grid>                         
                    </Card.Body>
                </Card>          
            </div>

            <div className='grid'>
                <Card round>
                    <Card.Header style={{ fontSize: '14px',fontWeight: 'normal',color: 'gray'}}>
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