import { useState, useEffect } from 'react';
import { NavBar, Form, Button, Input, Toast, Dialog } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { clientGetyzm, delPhone } from '../../api'  // 引入接口

function App() {
    const navigate = useNavigate();
    const [form] = Form.useForm()
    const [time, setTime] = useState(60);  // 验证码倒计时
    const [isStart, setIsStart] = useState(false);  // 是否开始倒计时
    const [ding, setDing] = useState<number>();  // 用于接收定时器
    const [visible, setVisible] = useState(false); // 弹出框
    const Tel = JSON.parse(localStorage.getItem('user') as string).tel
    const id = JSON.parse(localStorage.getItem('user') as string)._id
    const tel = Tel.replace(Tel.substring(3, 7), "****")

    const [params, setParams] = useState({}); // 用于接收表单数据

    // 向手机发送验证码
    const getYzm = async () => {
        let params = {
            phone: Tel
        }
        await clientGetyzm(params).then(res => {
            if (res.data.code === 200) {
                setIsStart(true);
                Toast.success('验证码已发送')
                setDing(
                    window.setInterval(() => {
                        setTime(time => time - 1);
                    }, 1000)
                );
                console.log(res.data.data.yanzhenma);
            } else if (res.data.code === 201) {
                Toast.fail('手机号未注册')
            } else {
                Toast.fail('验证码发送失败')
            }
        })
    }
    // 获取表单信息
    const onFinish = async (values: object) => {
        let params = values as any
        params.id = id
        setVisible(true)
        setParams(params)
    }
    // 注销账号
    const del = ()=>{
        delPhone(params).then(res => {
            if (res.data.code === 200) {
                Toast.success('注销成功')
                localStorage.removeItem('AccessToken');
                localStorage.removeItem('RefreshToken');
                localStorage.removeItem('user');
                navigate('/clientLogin');
            } else {
                Toast.fail('验证码错误')
            }
        })
        
    }
    // 当倒计时为0时清除定时器
    useEffect(() => {
        if (time === 0) {
            clearInterval(ding)
            setTime(60)
            setIsStart(false)
        }
    }, [time])

    // 退出时清除定时器
    useEffect(() => {
        return () => {
            console.log('清除定时器');
            clearInterval(ding)
        };
    }, [])

    return (
        <div>
            <NavBar onClickLeft={() => { navigate(-1) }} />
            <div style={{ padding: '10px' }}>
                <p style={{ fontSize: '18px' }}>注销账号</p>
                <p>为了验证您的身份，需要获取手机验证注销账号</p>
                <span>当前手机号：{tel}</span>

                <Form
                    form={form}
                    onFinish={onFinish}
                    style={{ marginTop: '30px' }}
                    footer={
                        <div style={{ margin: '16px 16px 0' }}>
                            <Button round nativeType='submit' type='primary' block>
                                确定
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        rules={[{ required: true, message: '请填写验证码' }]}
                        name='yzm'
                        label='验证码'
                        suffix={
                            <Button size="small" type="primary" disabled={isStart}
                                onClick={() => { getYzm() }}>
                                {!isStart ? '发送' : `${time}S`}
                            </Button>
                        }
                    >
                        <Input placeholder='请输入验证码' />
                    </Form.Item>
                </Form>
            </div>

            {/* 提示弹出框 */}
            <Dialog
                visible={visible}
                title='确定要注销吗'
                showCancelButton
                onConfirm={() => {
                    del()
                    setVisible(false)
                }}
                onCancel={() => setVisible(false)}
            >
                <div style={{ textAlign: 'center',width:"80%",margin:"0 auto"}}>
                    <p>注销成功后，该账号将删除用户数据并且无法登陆</p>
                </div>
            </Dialog>
        </div>
    );
}

export default App;