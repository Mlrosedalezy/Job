import React, { useEffect, useState } from 'react';
import './login.less'
import { loginInfo, telCode, faceLogin, altelCode } from '../../api/api'
// import type { FormProps } from 'antd';
// import type { RadioChangeEvent } from 'antd';
import type { Rule } from 'antd/es/form';
import { Button, Form, Input, Radio, Space, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

// 滑块
import { inRange, sleep } from 'ut2';
import ImageBg from '../../assets/1x.jpg';
import ImagePuzzle from '../../assets/1p.png';
import SliderCaptcha from 'rc-slider-captcha'

const Login: React.FC = () => {
    // 表单绑定
    const [form] = Form.useForm()
    // 定义表单接口
    interface FormProps {
        username?: string;
        password?: string;
        tel?: string;
        tel_code?: string;
    }
    // 表单完成验证
    const onFinish = async (values: FormProps) => {
        // console.log('Success:', values);
        setIsModalOpen(true)  //滑块验证码显

        let res: any
        if (type == 'user') {  //用户名登录
            res = await loginInfo(values)
        } else if (type == 'tel') {  //手机号登录
            // res = await altelCode(val)  //阿里云
            res = await telCode(values)  //测试
        } else if (type == 'face') {  //人脸识别登录
            res = await faceLogin(values)
        }
        // console.log(res);
        if (res.status == 200) {
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
        }
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    // 手机号登录
    const [disable, setDisable] = useState(false)  //验证码可否操作
    const [codeShow, setCodeShow] = useState(false)  //验证码文字显示
    const [subShow, setSubShow] = useState(true)  //提交按钮禁用
    // 验证码rules
    const checkCode = (_: any, value: any) => {
        if (value) {
            if (form.getFieldsValue().tel) {
                // setSubShow(false)  //完成按钮可操作
            }
            return Promise.resolve()
        } else {
            // setSubShow(true)  //完成按钮不可操作
            return Promise.reject(new Error('验证码不能为空'))
        }
    }
    // 验证码倒计时
    const [message, setMessage] = useState(60)  //验证码按钮文字变化
    let [timeout, setTimeOut] = useState(null)
    const handleSetout = async () => {
        // 发送验证码
        let tel = form.getFieldsValue().tel
        // let res = await altelCode({ tel: tel })  //阿里云
        let res = await telCode({ tel: tel })  //测试

        setMessage(60)  //更新倒计时时间
        setCodeShow(true)  //验证码可操作
        setDisable(true)  //重新发送验证码文字出现

        // 开启定时器
        setTimeOut(setInterval(() => {
            setMessage(message => message - 1)
            setDisable(true)
        }, 10))
    }
    // 监听倒计时
    useEffect(() => {
        if (message == 0) {
            clearInterval(timeout)  //清除定时器
            setMessage('重新发送验证码')
            setDisable(false)
        }
    }, [message])


    // 腾讯云人脸识别登录
    const handleFaceLogin = async (val: any) => {
        let box = document.getElementById('.face_login')
        let video = document.querySelector('video')
        let canvas = document.querySelector('canvas')
        // const context = canvas.getContext('2d');
        // context.drawImage(video, 0, 0, 200, 200)
        // canvas.style.width = 200 + "px"
        // canvas.style.height = 200 + "px"
        // let stream = await navigator.mediaDevices.getUserMedia({ video: true })
        // video.srcObject = stream

        // console.log(val);

        // if (val.outdown) {
        // stream.getTracks(、).forEach(track => track.stop());
        // }
    }


    // 切换登录方式
    const type = Form.useWatch('type', form)
    // 监听登录方式变化
    useEffect(() => {
        // console.log(type);
        // 切换登录方式清空表单
        form.setFieldsValue({
            username: '',
            password: '',
            tel: '',
            tel_code: ''
        })
        if (type == 'user' || type == 'tel') {  //人脸不显示提交按钮
            setSubShow(true)
            handleFaceLogin({ outdown: true })
        } else {
            setSubShow(false)
            // handleFaceLogin()
        }
    }, [type])

    // 手机号规则
    const telRules: Rule[] = [
        { required: true, message: '请填写手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' },
    ];


    const navigate = useNavigate()  //路由跳转
    const [isModalOpen, setIsModalOpen] = useState(false);  //模态框状态
    // 实现滑块
    const getCaptcha = async () => {
        await sleep(500);
        return {
            bgUrl: ImageBg,
            puzzleUrl: ImagePuzzle
        };
    };
    // 验证滑块
    const verifyCaptcha = async (data: any, navigate: any) => {
        await sleep();
        // value is 90±5
        if (data && inRange(data.x, 85, 95)) {
            // console.log('滑块验证成功');
            setIsModalOpen(false)
            navigate('/')
            return Promise.resolve('成功');
        }
        // console.log('滑块验证失败');
        // localStorage.removeItem('accessToken')
        // localStorage.removeItem('refreshToken')
        return Promise.reject('失败');
    };
    return (
        <div className='login'>
            <div className='main'>
                <div className='right'>
                    <h2>欢迎来到智慧社区</h2>
                </div>
                <Form
                    layout="horizontal"
                    form={form}
                    initialValues={{
                        type: 'user',  //默认登录方式
                    }}
                    onFinish={onFinish}
                // <div style={{ margin: '16px 16px 0', display: subShow == true ? "block" : "none" }}>
                //     <Button
                //         // disabled={subShow}
                //         round nativeType='submit' type='primary' block>
                //         提交
                //     </Button>
                // </div>
                >
                    {/* 切换登录方式 */}
                    <Form.Item name='type' className='type'>
                        <Radio.Group>
                            <Radio value='user'>用户名</Radio>
                            <Radio value='tel'>手机号</Radio>
                            <Radio value='face'>人脸</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/* 用户名登录 */}
                    {type === 'user' && (
                        <>
                            <Form.Item
                                rules={[{ required: true, message: '请填写用户名', trigger: 'blur' }]}
                                name='username'
                                label='用户名'
                            >
                                <Input placeholder='请输入用户名' />
                            </Form.Item>
                            <Form.Item
                                rules={[{ required: true, message: '请填写密码', trigger: "blur" }]}
                                name='password'
                                label={<div>密<span style={{ width: '14px', height: '100%', display: 'inline-block', verticalAlign: 'middle' }}></span>码</div>}
                            >
                                <Input placeholder='请输入密码' />
                            </Form.Item>
                        </>
                    )}
                    {/* 手机号登录 */}
                    {type === 'tel' && (
                        <>
                            <Form.Item
                                rules={telRules}
                                name='tel'
                                label='手机号'
                            >
                                <Input placeholder='请输入手机号' />
                            </Form.Item>
                            <Form.Item
                                name='tel_code'
                                label={<span style={{ paddingLeft: '11px' }}>验证码</span>}
                                // 自定义rules规则
                                rules={[
                                    { validator: checkCode },
                                ]}
                                extra={
                                    <Button
                                        disabled={disable}
                                        size="small"
                                        onClick={handleSetout}
                                        className='code'
                                    >
                                        {codeShow == false ? <span style={{ color: "blue" }}>发送验证码</span> :
                                            <span style={{ color: "blue" }}>{message}</span>}
                                    </Button>
                                }>
                                <Input placeholder='请输入验证码' />
                            </Form.Item>
                        </>
                    )}
                    {/* 人脸识别登录 */}
                    {/* {type === 'face' && (
                        <>
                            <div className='face_login' style={{
                                textAlign: "center"
                            }}>
                                <video autoPlay ></video>
                                <canvas></canvas>
                            </div>
                        </>
                    )} */}
                    <Form.Item>
                        <Space style={{ display: subShow == true ? "block" : "none" }}>
                            <Button
                                // disabled={subShow}
                                shape="round" htmlType="submit" type="primary" block>
                                提交
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
            {/* 滑块 */}
            <Modal title="验证人机" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} closable={false} width={400}>
                <SliderCaptcha
                    request={getCaptcha}
                    onVerify={(data) => {
                        // console.log(data);
                        return verifyCaptcha(data, navigate);
                    }}
                />
            </Modal>
        </div >
    )
}

export default Login;