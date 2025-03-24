import { useState, useEffect } from 'react';
import { NavBar, Form, Button, Input, Toast } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import { clientGetyzm, clientYzmLogin } from '../../api'  // 引入接口

function App() {
    const navigate = useNavigate();
    const [form] = Form.useForm()
    const [time, setTime] = useState(60);  // 验证码倒计时
    const [isStart, setIsStart] = useState(false);  // 是否开始倒计时
    const [ding, setDing] = useState<number>();  // 用于接收定时器
    const Tel = JSON.parse(localStorage.getItem('user') as string).tel
    const id = JSON.parse(localStorage.getItem('user') as string)._id
    const tel = Tel.replace(Tel.substring(3, 7), "****")

    // 向手机发送验证码
    const getYzm = async () => {
        if (!form.getFieldsValue().tel) {
            Toast.fail('填写手机号')
        } else {
            let params = {
                phone: form.getFieldsValue().tel,
                type:'change'
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
    }
    // 修改手机号
    const onFinish1 = async (values: object) => {
        let params = values as any
        params.id=id
        
        await clientYzmLogin(params).then(res => {
            if (res.data.code === 200) {
                Toast.fail('不可修改成相同手机号')
            } else if (res.data.code === 202) {
                Toast.success('修改成功')
                localStorage.removeItem('AccessToken');
                localStorage.removeItem('RefreshToken');
                localStorage.removeItem('user');
                navigate('/clientLogin',{replace:true});
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
    },[])
    
    return (
        <div>
            <NavBar onClickLeft={() => { navigate(-1) }} />
            <div style={{ padding: '10px' }}>
                <p style={{ fontSize: '18px' }}>更换新手机号</p>
                <span>当前手机号：{tel}，更换新手机号后下次将使用新手机号登录</span>

                <Form
                    form={form}
                    onFinish={onFinish1}
                    style={{marginTop:'30px'}}
                    footer={
                        <div style={{ margin: '16px 16px 0' }}>
                            <Button round nativeType='submit' type='primary' block>
                                确定
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        rules={[{ required: true, message: '请填写手机号' }]}
                        name='tel'
                        label='手机号'
                        suffix={
                            <Button size="small" type="primary" disabled={isStart}
                                onClick={() => { getYzm() }}>
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
                </Form>
            </div>
        </div>
    );
}

export default App;