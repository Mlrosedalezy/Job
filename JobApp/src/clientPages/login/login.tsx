import { useState, useEffect,useRef } from 'react'
import { Button, Input, Form, Tabs, Card, Toast, Overlay,Divider  } from 'react-vant'
import { useNavigate } from 'react-router-dom'
import { clientLogin,clientGetyzm,clientYzmLogin,face } from '../../api'  // 引入接口
import SliderCaptcha from 'rc-slider-captcha'; // 滑块验证码
import { inRange, sleep } from 'ut2';
import ImageBg from '../../assets/1bg@2x.jpg';  // 背景图
import ImagePuzzle from '../../assets/1puzzle@2x.png';  // 滑块
import Webcam from 'react-webcam'; //引入摄像头组件
import weixin from '../../assets/微信.png'
import qq from '../../assets/QQ.png'
import './login.css'

function App() {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [select, setSelect] = useState(0)
    const items = ['密码登录', '短信登录']
    const [visible, setVisible] = useState(false); // 滑块弹窗
    const [isCameraOn, setIsCameraOn] = useState(false); // 是否开启摄像头
    const [token, setToken] = useState({'accessToken': '', 'refreshToken': '','user':''}); // 滑块token
    const [time, setTime] = useState(60);  // 获取验证码倒计时
    const [isStart, setIsStart] = useState(false);  // 是否开始倒计时
    const [ding, setDing] = useState<number>();  // 用于接收定时器
    const webcamRef = useRef<Webcam>(null);  // 摄像头组件

    // 登录
    const onFinish1 = async (values: object) => {
        if (select === 0) {        // 密码登录
            await clientLogin(values).then(res => {
                if (res.data.code === 200) {
                    setToken(res.data.data);
                    setVisible(true)
                } else {
                    Toast.fail('用户名密码错误')
                }
            })
        } else if (select === 1) {        // 短信登录
            await clientYzmLogin(values).then(res => {
                if (res.data.code === 200) {
                    setToken(res.data.data);
                    setVisible(true)
                } else {
                    Toast.fail('验证码错误')
                }
            })
        }
    }
    // 向手机发送验证码
    const getYzm = async () => {
        if (!form.getFieldsValue().tel) {
            Toast.fail('填写手机号')
        }else{
            let params = {phone: form.getFieldsValue().tel}
            await clientGetyzm(params).then(res => {
                if (res.data.code === 200) {
                    setIsStart(true);
                    Toast.success('验证码已发送')
                    setDing(
                        window.setInterval(() => {
                            setTime(time => time - 1);
                        }, 1000)
                    );
                } else if (res.data.code === 201) {
                    Toast.fail('手机号未注册')
                }else{
                    Toast.fail('验证码发送失败')
                }
            })  
        }
    }

    // 显示刷脸登录
    const showface = () => {
        setIsCameraOn(true)
        setTimeout(() => {
            faceLogin()
        }, 1000);
    }
    // 刷脸登录
    const faceLogin = async () => {
        // 获取当前摄像头的截图,以base64格式返回
        // 可以使用canvas来对图片在进行压缩处理，减少图片的大小
        const imageSrc = webcamRef.current?.getScreenshot(); 
        
        if(imageSrc){
            const res = await face(imageSrc.split(',')[1]) as any   
            if (res.data.code === 200) {
                // 关闭摄像头
                setIsCameraOn(false)
                setToken(res.data.data);
                Toast.success('识别成功')
                setVisible(true)
            } else if (res.data.code === 400) {
                Toast.fail(res.msg)
            } else {
                Toast.fail('人脸识别失败')
            }
        }
    }

    // 滑块验证，返回背景图片和滑块
    const getCaptcha = async () => {
        await sleep();
        return {
            bgUrl: ImageBg,
            puzzleUrl: ImagePuzzle
        };
    };
    // 滑块验证成功后，执行登录操作
    const verifyCaptcha = async (data: { x: number }) => {
        await sleep();
        // 误差允许范围 90±5
        if (data && inRange(data.x, 85, 95)) {
            localStorage.setItem('AccessToken', token.accessToken)
            localStorage.setItem('RefreshToken', token.refreshToken)
            localStorage.setItem('user', JSON.stringify(token.user))
            Toast.success('登录成功')
            setVisible(false);
            navigate('/clientIndex')
            return Promise.resolve();
        }
        return Promise.reject();
    };

    // 当倒计时为0时清除定时器
    useEffect(() => {
        if(time === 0) {
            clearInterval(ding)
            setTime(60)
            setIsStart(false)
        }
    },[time])
    // 退出时清除定时器
    useEffect(() => {
        return () => {
            console.log('清除定时器');
            clearInterval(ding)
        };
    },[])

    return (
        <div>
            <h1>LOGO</h1>
            <Card round style={{width: '350px', margin: '50px auto'}}>
                <Card.Body>
                    <Tabs onChange={(e) => { setSelect(Number(e)) }} >
                        {items.map(item => (
                            <Tabs.TabPane key={item} title={`${item}`} />
                        ))}
                    </Tabs>
                    <Form
                        form={form}
                        onFinish={onFinish1}
                        footer={
                            <div style={{ margin: '16px 16px 0' }}>
                                <Button round nativeType='submit' type='primary' block>
                                    登录
                                </Button>
                            </div>
                        }
                    >
                        {select === 0 && (
                            <>
                                <Form.Item
                                    intro='确保这是唯一的用户名'
                                    rules={[{ required: true, message: '请填写用户名' }]}
                                    name='username'
                                    label='用户名'
                                >
                                    <Input placeholder='请输入用户名' />
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: '请填写密码' }]}
                                    name='password'
                                    label='密码'
                                >
                                    <Input type='password' placeholder='请输入密码' />
                                </Form.Item>
                            </>
                        )}
                        {select === 1 && (
                            <>
                                <Form.Item
                                    rules={[{ required: true, message: '请填写手机号' }]}
                                    name='tel'
                                    label='手机号'
                                    suffix={
                                        <Button size="small" type="primary" disabled={isStart} 
                                            onClick={()=>{getYzm()}}>
                                            {!isStart ? '发送' : `${time}S`}
                                        </Button>
                                    }
                                >
                                    <Input placeholder='请输入手机号' />
                                </Form.Item>
                                <Form.Item
                                    rules={[{ required: true, message: '请填写验证码' }]}
                                    name='yzm'
                                    label='验证码'
                                >
                                    <Input placeholder='请输入验证码' />
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </Card.Body>
            </Card>
            <Button round  type='primary' block 
                style={{width:'75%',margin:'0 auto',marginTop:'20px'}}
                onClick={() => showface()}>
                刷脸登录
            </Button>
            <Divider>其他登录方式</Divider>   
            <div className="login-img" style={{textAlign:'center'}}>
                <img src={weixin} width={50}></img>
                <img src={qq} width={50}></img>
            </div>        

            {/* 滑块弹窗 */}
            <Overlay visible={visible} onClick={() => setVisible(false)}
                style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <SliderCaptcha
                    request={getCaptcha}
                    onVerify={(data) => {
                        console.log(data);
                        return verifyCaptcha(data);
                    }}
                />
            </Overlay>

            {/* 摄像头 */}
            <Overlay visible={isCameraOn} onClick={() => setIsCameraOn(false)}
                style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
            >
                {isCameraOn && 
                <div style={{ width: 200, height: 200, backgroundColor: '#fff', borderRadius: 4 }}>
                    <Webcam ref={webcamRef} style={{width: 200, height: 200}}/>
                </div>
                }
            </Overlay>
        </div>
    );
}

export default App;