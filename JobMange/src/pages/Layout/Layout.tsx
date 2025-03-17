import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Sider } = Layout;
const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [
    {
        label: '首页', key: '1', child: [
            { label: '工作台', key: '/layout/worktable' },
            { label: '物业大屏', key: '/layout/lcdscreen' },
            { label: '物业大屏配置', key: '/layout/screenset' },
        ]
    },
    { label: '智慧物业', key: '2',child:[
        { label: '房屋管理', key: '/layout/housemange' },
        { label: '基础信息', key: '3' },
        { label: '业主管理', key: '4' },
    ] },
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
    // { label: '系统管理', key: '6' ,child:[
    //     { label: '用户管理', key: '6' },
    //     { label: '角色管理', key: '6' },
    // ]},
    // { label: '活动管理', key: '6' ,child:[
    //     { label: '活动发布', key: '6' },
    //     { label: '活动记录', key: '6' },
    // ]},
    // { label: '电子通行证', key: '6' ,child:[
    //     { label: '通行证管理', key: '6' },
    //     { label: '通行证记录', key: '6' },
    // ]},
].map(
    (i) => {
        return {
            key: i.key,
            label: i.label,
            children: i.child.map((j) => {
                return {
                    key: j.key,
                    label: j.label,
                };
            }),
        };
    },
);

//箭头函数形式
const Layouts = () => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [activeRoute, setActiveRoute] = useState<string>('');
    // 刷新页面选中不掉
    useEffect(() => {
        setActiveRoute(localStorage.getItem('activeRoute') || '')
                
        return () => {  //组件销毁时清除
            localStorage.removeItem('activeRoute')
        }
    }, []);
    
    // 侧边栏切换
    const handleMenuClick = (key: any) => {
        setActiveRoute(key.key);
        navigate(key.key);
        console.log(key.key);
        
        localStorage.setItem('activeRoute', key.key)
    }
    return (
        <>
            <Layout>
                {/* 头部 */}
                <Header style={{
                    display: 'flex',
                    height: '5vh'
                    // alignItems: 'center' 
                }}>
                    <div className="demo-logo" />
                    <Menu
                        // theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={items1}
                        style={{ flex: 1, minWidth: 0 }}
                    />
                </Header>

                {/* 侧边栏 */}
                <Layout>
                    <Sider width={200} style={{ background: colorBgContainer, height: '95vh', overflowY: 'auto' }}>
                        <Menu
                            mode="inline"
                            theme="dark"
                            // defaultSelectedKeys={['1']}
                            defaultOpenKeys={[activeRoute]}
                            onClick={handleMenuClick}
                            style={{ height: '100%', borderRight: 0 }}
                            items={items2}
                        />
                    </Sider>
                    <Layout style={{ padding: '0 20px 20px' }}>
                        <Breadcrumb
                            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                            style={{ margin: '16px 0' }}
                        />
                        <Content
                            style={{
                                // padding: "15px",
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