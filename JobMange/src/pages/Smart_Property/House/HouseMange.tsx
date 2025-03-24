import { useState, useEffect, } from 'react';
import './HouseMange.less'
import { Base64 } from 'js-base64'
import { houseManage, TreeManage } from '../../../api/api'
import {
    Select,
    Button,
    Tree,
    Table,
} from 'antd';
import type { TreeDataNode, TableColumnsType } from 'antd';
import { CarryOutOutlined, CheckOutlined,  } from '@ant-design/icons';
//箭头函数形式
const HouseMange = () => {
    useEffect(() => {
        let cid = localStorage.getItem('cid') || ''
        getData(cid)
    }, [])
    const [data, setData] = useState([])  //房屋信息
    const [treeList, setTreeList] = useState([])  //树形结构
    const [treeData1, setTreeData1] = useState([])  //小区数据
    const getData = async (cid:string) => {
        const res = await houseManage({ id: cid })
        let arr = await TreeManage({ id: cid })
        // console.log(arr.data,res)
        setTreeData1(arr.data.cname)
        setTreeList(arr.data.data)
        setData(res.data)
    }

    const [filterMes, setFilterMes] = useState({
        isIn: '',
    })

    // 下拉框数据
    const [option1] = useState([
        { value: 'true', label: '已入住' },
        { value: 'false', label: '未入住' },
    ])

    // 树形选择
    const treeData: TreeDataNode[] = Array.from(treeData1).map((item: any) => (
        {
            title: item.communityName,
            key: item._id,
            icon: <CarryOutOutlined />,
            children: Array.from(treeList).map((i: any) =>(
                {}
            ))
        }
    ))
    // data[0].floorId.unitId.buildId.map((item)=>(
    //     {
    //         title:item.name,
    //         key:item._id,

    //     }
    // ))

    // [
    // {
    //   title: 'parent 1',
    //   key: '0-0',
    //   icon: <CarryOutOutlined />,
    //   children: [
    //     {
    //       title: 'parent 1-0',
    //       key: '0-0-0',
    //       icon: <CarryOutOutlined />,
    //       children: [
    //         { title: 'leaf', key: '0-0-0-0', icon: <CarryOutOutlined /> },
    //         {
    //           title: (
    //             <>
    //               <div>multiple line title</div>
    //               <div>multiple line title</div>
    //             </>
    //           ),
    //           key: '0-0-0-1',
    //           icon: <CarryOutOutlined />,
    //         },
    //         { title: 'leaf', key: '0-0-0-2', icon: <CarryOutOutlined /> },
    //       ],
    //     },
    //     {
    //       title: 'parent 1-1',
    //       key: '0-0-1',
    //       icon: <CarryOutOutlined />,
    //       children: [{ title: 'leaf', key: '0-0-1-0', icon: <CarryOutOutlined /> }],
    //     },
    //     {
    //       title: 'parent 1-2',
    //       key: '0-0-2',
    //       icon: <CarryOutOutlined />,
    //       children: [
    //         { title: 'leaf', key: '0-0-2-0', icon: <CarryOutOutlined /> },
    //         {
    //           title: 'leaf',
    //           key: '0-0-2-1',
    //           icon: <CarryOutOutlined />,
    //           switcherIcon: <FormOutlined />,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: 'parent 2',
    //   key: '0-1',
    //   icon: <CarryOutOutlined />,
    //   children: [
    //     {
    //       title: 'parent 2-0',
    //       key: '0-1-0',
    //       icon: <CarryOutOutlined />,
    //       children: [
    //         { title: 'leaf', key: '0-1-0-0', icon: <CarryOutOutlined /> },
    //         { title: 'leaf', key: '0-1-0-1', icon: <CarryOutOutlined /> },
    //       ],
    //     },
    //   ],
    // },
    //   ];
    const [showIcon, setShowIcon] = useState<boolean>(false);
    const [showLeafIcon, setShowLeafIcon] = useState<React.ReactNode>(true);

    const onSelect = (selectedKeys: React.Key[], info: any) => {
        console.log('selected', selectedKeys, info);
    };

    const handleLeafIconChange = (value: 'true' | 'false' | 'custom') => {
        if (value === 'custom') {
            return setShowLeafIcon(<CheckOutlined />);
        }

        if (value === 'true') {
            return setShowLeafIcon(true);
        }

        return setShowLeafIcon(false);
    };

    // 表格数据结构
    interface DataType {
        index: number;
        xiaoquId: string
        communityName?: string;
        buildName: string;
        unitName: string;
        floorName: string;
        houseName: string;
        houseMaster: string;
        sqrt: number;
        tel: number;
        isIn: boolean;
        _id: string;
    }
    // 表格
    const columns: TableColumnsType<DataType> = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (index) => <span>{index + 1}</span>,

        },
        {
            title: "楼栋",
            key: 'buildName',
            dataIndex: "buildName",
        },
        {
            title: '单元',
            dataIndex: 'unitName',
            key: 'unitName',
        },
        {
            title: '楼层',
            dataIndex: 'floorName',
            key: 'floorName',
        },
        {
            title: '房屋',
            dataIndex: 'houseName',
            key: 'houseName',
        },
        {
            title: '面积',
            dataIndex: 'sqrt',
            key: 'sqrt',
        },
        {
            title: '户主',
            dataIndex: 'houseMaster',
            key: 'houseMaster',
        },
        {
            title: '手机号',
            dataIndex: 'tel',
            key: 'tel',
        },
        {
            title: '状态',
            dataIndex: 'isIn',
            key: 'isIn',
            render: (text) => {
                if (text) {
                    return <span>已入住</span>
                } else {
                    return <span>未入住</span>
                }
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record, index) => {
                return (
                    <div>
                        <Button size='small'>编辑</Button>
                        <Button size='small'>删除</Button>
                    </div>
                )
            }

        }
    ];
    // 表格数据渲染
    const dataSource = Array.from<DataType>(data).map((item, index) => ({
        index: index,
        xiaoquId: item.xiaoquId,
        buildName: item.buildName,
        unitName: item.unitName,
        floorName: item.floorName,
        houseName: item.houseName,
        houseMaster: item.houseMaster,
        sqrt: item.sqrt,
        tel: item.tel,
        isIn: item.isIn,
        _id: item._id,
    }));

    // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    //     console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    //     setSelectedRowKeys(newSelectedRowKeys);
    // };

    // const rowSelection: TableRowSelection<DataType> = {
    //     selectedRowKeys,
    //     onChange: onSelectChange,
    // };

    return (
        <>
            <div className='top'>
                <div className='sel'>
                    <p>
                        <span>状态</span>
                        <Select
                            placeholder={"请选择"}
                            size="small"
                            style={{ width: 120 }}
                            onChange={(value) => setFilterMes({ ...filterMes, isIn: value })}
                            options={option1}
                        />
                    </p>
                    <p>
                        <span>状态</span>
                        <Select
                            defaultValue="lucy"
                            placeholder={"请选择"}
                            size="small"
                            style={{ width: 120 }}
                            onChange={(value) => setFilterMes({ ...filterMes, isIn: value })}
                            options={option1}
                        />
                    </p>
                    <p>
                        <span>状态</span>
                        <Select
                            defaultValue="lucy"
                            placeholder={"请选择"}
                            size="small"
                            style={{ width: 120 }}
                            onChange={(value) => setFilterMes({ ...filterMes, isIn: value })}
                            options={option1}
                        />
                    </p>
                    <p>
                        <span>状态</span>
                        <Select
                            defaultValue="lucy"
                            placeholder={"请选择"}
                            size="small"
                            style={{ width: 120 }}
                            onChange={(value) => setFilterMes({ ...filterMes, isIn: value })}
                            options={option1}
                        />
                    </p>
                    <p>
                        <span>状态</span>
                        <Select
                            defaultValue="lucy"
                            placeholder={"请选择"}
                            size="small"
                            style={{ width: 120 }}
                            onChange={(value) => setFilterMes({ ...filterMes, isIn: value })}
                            options={option1}
                        />
                    </p>
                </div>
                <div className='btn'>
                    <Button color="primary" variant="solid">
                        查询
                    </Button>
                    <Button color="default" variant="outlined">
                        一键重置
                    </Button>
                    <Button color="primary" variant="solid">
                        新增
                    </Button>
                    <Button color="primary" variant="solid">
                        导入
                    </Button>
                    <Button color="cyan" variant="solid">
                        导出
                    </Button>
                    <Button color="primary" variant="solid">
                        房屋配置
                    </Button>
                    <Button color="danger" variant="outlined">
                        批量删除
                    </Button>
                </div>
            </div>
            <div className='main'>
                <div className='main_left'>
                    <p>房屋结构</p>
                    <Tree
                        showLine={true}
                        showIcon={showIcon}
                        defaultExpandedKeys={['0-0-0']}
                        onSelect={onSelect}
                        treeData={treeData}
                    />
                </div>
                <div className='main_right'>
                    <Table
                        rowKey="_id"
                        // rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataSource} />
                </div>
            </div>
        </>
    )
}

export default HouseMange;