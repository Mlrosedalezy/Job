import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Base64 } from 'js-base64';
import { getLayout, getRoutes } from '../../api/api'

import './Layout.less'
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Dropdown } from 'antd';
const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const Layouts = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState<any>('')
    const [community, setCommunity] = useState<any>([])
    const [cid, setCid] = useState<any>('67ca8ad17d72767a706b9395')
    const [activeRoute, setActiveRoute] = useState<string>(''); //当前路由
    const [routes, setRoutes] = useState<any>([])
    useEffect(() => {
        let str = JSON.parse(Base64.decode(localStorage.getItem("loginmsg") || ''))
        console.log(str, 11111);
        getData()
        setMsg(str)

        // 刷新页面选中不掉
        let active = localStorage.getItem('activeRoute') || '/worktable'
        // console.log(active, 22222);
        setActiveRoute(active)

        return () => {  //组件销毁时清除
            // localStorage.removeItem('activeRoute')
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cid', cid)
    }, [cid])

    const items2: MenuProps['items'] =
        // [
        //     {
        //         label: '首页', key: '1', child: [
        //             { label: '工作台', key: '/worktable' },
        //             { label: '物业大屏', key: '/lcdscreen' },
        //             { label: '物业大屏配置', key: '/screenset' },
        //         ]
        //     },
        //     {
        //         label: '智慧物业', key: '2', child: [
        //             { label: '房屋管理', key: '/housemange' },
        //             { label: '基础信息', key: '3' },
        //             { label: '业主管理', key: '4' },
        //         ]
        //     },
        //     {
        //         label: '系统管理', key: '6', child: [
        //             { label: '用户管理', key: 'user' },
        //             { label: '角色管理', key: 'role' },
        //         ]
        //     },
        // { label: '内容管理', key: '6',child:[
        //     { label: '轮播图管理', key: '6' },
        //     { label: '公告管理', key: '6' },
        // ] },
        // { label: '门禁管理', key: '6',child:[
        //     { label: '门禁设备管理', key: '6' },
        //     { label: '门禁记录', key: '6' },
        // ] },
        // { label: '视频监控', key: '6',child:[
        //     {label:'视频监控',key:'7'},
        // ] },
        // { label: '智慧停车', key: '6',child:[
        //     { label: '停车管理', key: '6' },
        //     { label: '停车记录', key: '6' },
        // ] },
        // { label: '水气电管理', key: '6' ,child:[
        //     { label: '水费管理', key: '6' },
        //     { label: '电费管理', key: '6' },
        // ]},
        // { label: '智能预警', key: '6' ,child:[
        //     { label: '消防预警', key: '6' },
        //     { label: '门禁预警', key: '6' },
        // ]},
        // { label: '智慧防疫', key: '6' ,child:[
        //     { label: '防疫管理', key: '6' },
        //     { label: '防疫记录', key: '6' },
        // ]},

        // { label: '活动管理', key: '6' ,child:[
        //     { label: '活动发布', key: '6' },
        //     { label: '活动记录', key: '6' },
        // ]},
        // { label: '电子通行证', key: '6' ,child:[
        //     { label: '通行证管理', key: '6' },
        //     { label: '通行证记录', key: '6' },
        // ]},
        // ]
        routes.map(
            (i: any) => {
                console.log(msg.permiss);
                
                return {
                    key: i.key,
                    label: i.label,
                    children: i.child.map((j: any) => {
                        if (msg.permiss<=j.permiss) {
                            return {
                                key: j.key,
                                label: j.label,
                            };
                        }
                    }),
                };
            },
        );

    // 头部小区显示
    const getData = async () => {
        try {
            let res = await getLayout()
            let routes = await getRoutes()
            setCommunity(res.data)
            // console.log(routes.data,2222,msg);
            setRoutes(routes.data)
        } catch (error) {
            let count: number = 0
            let timeout = setInterval(async () => {
                count++
                let res = await getLayout()
                let routes = await getRoutes()
                setRoutes(routes.data)

                setCommunity(res.data)
                if (res.data.length > 0 && routes.data.length > 0) {
                    clearInterval(timeout)
                }
                if (count >= 3) {
                    clearInterval(timeout)
                }
            }, 1000)
        }
        // console.log(res.data);
    }


    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 退出登录
    const lis = [
        {
            key: '1',
            label: (
                <p>个人信息</p>
            ),
        },
        {
            key: '3',
            label: (
                <p onClick={() => { navigate('/login'), localStorage.removeItem('accessToken'), localStorage.removeItem('refreshToken'), localStorage.removeItem('loginmsg') }}>退出登录</p>
            ),
        },
    ];

    // 侧边栏切换
    const handleMenuClick = (key: any) => {
        setActiveRoute(key.key);
        navigate(key.key);
        // console.log(key.key);
        localStorage.setItem('activeRoute', key.key)
    }
    window.addEventListener('resize', (e) => {
        let box = document.documentElement;
        console.log(window.innerWidth);
        box.style.fontSize = Math.max(window.innerWidth / 106.6, 8) + 'px'
    });

    return (
        <>
            <Layout>
                {/* 头部 */}
                <Header style={{
                    height: '8vh',
                    backgroundColor: "white",
                    padding: '0 40px',
                }}
                    className='header'
                >
                    <div className='left'>
                        <img src="https://img.ixintu.com/download/jpg/201912/53d46e7d137b86b79a4321e85c525945.jpg!con" alt="" />
                        <h2>智慧小区物业管理平台</h2>
                    </div>
                    <div className='right'>
                        <p>
                            <span>小区：</span>
                            <select name={cid} id="mySelect" onChange={(e) => {  //切换小区工作台内容变化
                                setCid(e.target.value),
                                    navigate(`/worktable`, { state: { id: e.target.value } })
                            }}>
                                {community.map((i: any) => {
                                    return <option key={i._id} value={i._id}>{i.communityName}</option>
                                })}
                            </select>
                        </p>
                        <div className='img'>
                            <img src="https://ts1.tc.mm.bing.net/th/id/R-C.31df3a5a2d8462228734f95d459883e2?rik=7EE6TeWDk%2f%2bctQ&riu=http%3a%2f%2fwww.quazero.com%2fuploads%2fallimg%2f140303%2f1-140303214331.jpg&ehk=SpI7mz%2byLqOkT8BL79jcd3iCtQYNFlBHQzbtF1p0vuQ%3d&risl=&pid=ImgRaw&r=0" alt="" />
                        </div>
                        <Dropdown
                            menu={{
                                items: lis,
                            }}
                            placement="bottom"
                        >
                            <div className='name'>{msg.username}</div>
                        </Dropdown>
                    </div>
                </Header>

                {/* 侧边栏 */}
                <Layout>
                    <Sider width={200} style={{ background: colorBgContainer, height: '100%' }}>
                        <Menu
                            mode="inline"
                            theme="dark"
                            defaultSelectedKeys={[activeRoute]}
                            onClick={handleMenuClick}
                            style={{ height: '110vh', borderRight: 0 }}
                            items={items2}
                        />
                    </Sider>
                    <Layout>
                        {/* <Breadcrumb
                            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                            style={{ margin: '16px 0' }}
                        /> */}
                        <Content
                            style={{
                                padding: "15px",
                                margin: 0,
                                // minHeight: 280,
                                // background: colorBgContainer,
                                // borderRadius: borderRadiusLG,
                            }}
                        >
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}


export default Layouts;