import React, { useEffect, useState } from 'react';
import './UserRole.less'
import { userManage, userAdd, userDel, userEdit } from '../../api/api'
import { EyeOutlined } from '@ant-design/icons';
import { Space, Table, Button, Input, Modal, Popconfirm, message } from 'antd';
import { Base64 } from 'js-base64'
import type { PopconfirmProps } from 'antd';
import type { TableProps } from 'antd';
const User: React.FC = () => {
    const [msg, setMsg] = useState<any>({})  //用户信息
    useEffect(() => {  //初始化操作
        let str = JSON.parse(Base64.decode(localStorage.getItem('loginmsg') || ''))
        setMsg(str)
        getData()
    }, [])
    const [list, setList] = useState<any>([])  //用户列表
    const [val, setVal] = useState<string>('')  //搜索框
    interface DataType {
        id: string,
        username: string,
        password: string,
        index: number,
        role: string,
        content: string,
        status: boolean,
        upname: string,
        timeout: number,
        Permiss: number,
    }
    // 表格结构定义
    const columns: TableProps<DataType>['columns'] = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (index) => index + 1,
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '角色描述',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: (text) => (
                <span>
                    {text ? '启用' : '未启用'}
                </span>)
        },
        {
            title: '添加人',
            key: 'upname',
            dataIndex: 'upname',
        },
        {
            title: '添加时间',
            key: 'timeout',
            dataIndex: 'timeout',
            render: (text) => (
                <span>
                    {formatDate(text)}
                </span>)
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle" className='btns'>
                    <button disabled={record.Permiss > msg.permiss ? false : true} style={{ color: record.Permiss > msg.permiss ? "409EFF" : "gray" }} onClick={() => handleStop(record)}>{record.status ? '停用' : '启用'}</button>
                    <Popconfirm
                        title="删除确认"
                        description="确认删除?"
                        onConfirm={() => handleDel(record)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <button className='del' disabled={msg.permiss < 1 && msg.permiss != 0 ? false : true} style={{ color: msg.permiss < record.Permiss && record.Permiss!=0 ? "red" : "gray" }}>删除</button>
                    </Popconfirm>
                    <button disabled={msg.permiss < record.Permiss ? false : true} style={{ color: msg.permiss < record.Permiss ? "409EFF" : "gray" }} onClick={() => handleEdit(record)}>编辑</button>
                </Space>
            ),
        },
    ];
    // 请求数据
    const getData = async () => {
        try {
            let res = await userManage({ val })
            console.log(res.data);
            setList(res.data)
        } catch (error) {  //token过期，重新请求
            let count: number = 0
            let timeout = setInterval(async () => {
                let res = await userManage({ val })
                setList(res.data)
                count++
                // console.log(count);
                if (count >= 3) {
                    clearInterval(timeout)
                }
                if (res.data.length > 0) {
                    clearInterval(timeout)
                }
            }, 1000);
        }
    }
    // 渲染表格数据
    const data: DataType[] = list.map((item: any, index: any) => ({
        id: item._id,
        index: index,
        username: item.username,
        password: item.password,
        role: item.role,
        content: item.content,
        status: item.status,
        upname: item.upname,
        timeout: item.timeout,
        Permiss: item.Permiss,
    }))

    function formatDate(timestamp: number) {  // 日期格式化
        const date = new Date(timestamp);

        const year = date.getFullYear(); // 年份
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份（补零）
        const day = String(date.getDate()).padStart(2, '0'); // 日期（补零）
        const hours = String(date.getHours()).padStart(2, '0'); // 小时（补零）
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 分钟（补零）
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 秒数（补零）

        // 替换格式字符串中的占位符
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    const handleStop = async (data: any) => {  // 停用用户
        await userEdit({ id: data.id, status: data.status })
        getData()
    }
    const handleDel = async (data: any) => {  //删除用户列表
        await userDel({ id: data.id })
        getData()
        message.success('删除成功')
    }
    const [isModalOpen, setIsModalOpen] = useState(false);  //模态框状态
    const handleEdit = (data: any) => {  //编辑用户列表
        setIsModalOpen(true);
        setId(data.id);
        setRolename(data.role);
        setRolecontent(data.content);
        setStatus(data.status);
        setName(data.username);
        setpsw(data.password);
        setUpname(data.upname);
    }
    const handleOk = async () => {  //编辑用户列表提交
        setIsModalOpen(false);
        await userAdd({
            id: id,
            role: rolename,
            content: rolecontent,
            status: status,
            timeout: Date.now(),
            username: name,
            password: psw,
            upname: upname,
        })
        // console.log(res.data);
        getData()
        setName('')
        setpsw('')
        setUpname('')
        setRolename('')
        setRolecontent('')
        setStatus(true)
    };
    const handleCancel = () => {  //编辑用户列表取消
        setIsModalOpen(false);
        setName('')
        setpsw('')
        setUpname('')
        setRolename('')
        setRolecontent('')
        setStatus(true)
    }
    const handleSearch = () => {  //搜索
        getData()
        setVal('')
    }

    // 模态框内容
    const [rolename, setRolename] = useState<string>('');  //角色名称
    const [rolecontent, setRolecontent] = useState<string>('');  //角色描述
    const [status, setStatus] = useState<Boolean>(true);  //状态
    const [name, setName] = useState<string>('');  //用户名
    const [psw, setpsw] = useState<string>('');  //密码
    const [upname, setUpname] = useState<string>('');  //添加人
    const [id, setId] = useState<string>(''); //id
    const [pswShow, setPswShow] = useState<Boolean>(false)  //密码显示隐藏


    const confirm: PopconfirmProps['onConfirm'] = async (e: any) => {

        message.success('删除成功');
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('取消成功');
    };
    return (
        <>
            {/* 搜索添加 */}
            <div className='action'>
                <p>
                    <span>角色名称：</span>
                    <Input placeholder="请输入" style={{ width: 200 }} value={val} onChange={(e) => setVal(e.target.value)} />
                </p>
                <p>
                    <Button disabled={msg.permiss < 2 ? false : true} color="cyan" variant="solid" onClick={handleSearch}>
                        查询
                    </Button>
                    <Button type="primary" onClick={() => {
                        setIsModalOpen(true);
                    }} disabled={msg.permiss < 2 ? false : true}>新增</Button>
                </p>
            </div>
            {/* 表格 */}
            <Table<DataType> rowKey="index" columns={columns} dataSource={data} />
            {/* 新增/修改弹窗 */}
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} className='model'>
                <p>
                    <span>角色名称：</span>
                    <Input placeholder="请输入" style={{ width: 200 }} value={rolename} onChange={(e) => setRolename(e.target.value)} />
                </p>
                <p>
                    <span>角色描述：</span>
                    <Input placeholder="请输入" style={{ width: 200 }} value={rolecontent} onChange={(e) => setRolecontent(e.target.value)} />
                </p>
                <p>
                    <span>用户名：</span>
                    <Input placeholder="请输入" style={{ width: 200 }} value={name} onChange={(e) => setName(e.target.value)} />
                </p>
                <p>
                    <span>密码：</span>
                    {!pswShow ?
                        <Input type="password" placeholder="请输入" style={{ width: 200 }} value={psw} onChange={(e) => setpsw(e.target.value)} />
                        :
                        <Input type="text" placeholder="请输入" style={{ width: 200 }} value={psw} onChange={(e) => setpsw(e.target.value)} />}<EyeOutlined onClick={() => { setPswShow(!pswShow) }} />
                </p>
                <div>
                    <span>添加人：</span>
                    <select value={upname} onChange={(e) => setUpname(e.target.value)} style={{ width: 200 }} defaultChecked={upname==''}>
                        <option value="" disabled>请选择</option>
                        {list.map((item: any) => (
                            <option value={item.username} key={item._id} disabled={item.username !== msg.username}>{item.username}</option>
                        ))
                        }
                    </select>
                </div>
                <p>
                    <span>状态：</span>
                    <label>
                        <input
                            type="radio"
                            value="true"
                            checked={status === true}
                            onChange={(e) => setStatus(e.target.value === 'true')}
                            name="status"
                        />
                        启用
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="false"
                            checked={status === false}
                            onChange={(e) => setStatus(e.target.value === 'false')}
                            name="status"
                        />
                        未启用
                    </label>
                </p>
            </Modal>
        </>
    )
}
export default User;