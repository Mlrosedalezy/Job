import React, { useState, useEffect } from 'react';
import { Checkbox, Button, Card } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const { Group } = Checkbox;
// 本地存储的键名
const LOCAL_STORAGE_KEY = 'savedCheckboxValues';
const Role: React.FC = () => {
    // 定义状态 selectedItems，用于存储用户选中的多选框值
    const [selectedItems, setSelectedItems] = useState<CheckboxValueType[]>([]);
    // 定义状态 expandedKeys，用于存储展开的父级选项
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    // 定义多选框的选项数据
    const options = [
        { label: '小程序用户资源', value: 'user-resources' }, // 单个选项
        {
            label: '智慧物业', // 父级选项
            value: 'smart-property',
            children: [ // 子级选项
                { label: '物业缴费', value: 'property-payment' },
                { label: '智慧停车', value: 'smart-parking' },
                { label: '便民助手', value: 'convenience-helper' },
                { label: '事件上报', value: 'incident-reporting' },
            ],
        },
        {
            label: '门禁访客', // 父级选项
            value: 'access-control',
            children: [ // 子级选项
                { label: '访客邀请', value: 'visitor-invitation' },
                { label: '远程开门', value: 'remote-opening' },
                { label: '访客预约', value: 'visitor-booking' },
                { label: 'SIM卡门禁', value: 'sim-access' },
            ],
        },
        {
            label: '智慧生活', // 父级选项
            value: 'smart-life',
            children: [ // 子级选项
                { label: '社区活动', value: 'community-events' },
                { label: '智慧健康', value: 'smart-health' },
                { label: '生活缴费', value: 'life-payment' },
                { label: '快递外卖', value: 'delivery' },
            ],
        },
    ];

    // 初始化时从 localStorage 加载保存的选中值
    useEffect(() => {
        const savedValues = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedValues) {
            setSelectedItems(JSON.parse(savedValues));
        }
    }, []);

    // 处理多选框选中状态变化
    const handleCheckboxChange = (checkedValues: CheckboxValueType[]) => {
        setSelectedItems(checkedValues);
    };

    // 处理父级选项的展开/折叠
    const handleExpand = (key: string) => {
        if (expandedKeys.includes(key)) {
            setExpandedKeys(expandedKeys.filter((k) => k !== key)); // 折叠
        } else {
            setExpandedKeys([...expandedKeys, key]); // 展开
        }
    };

    // 检查是否所有子级选项都被选中
    const isAllChildrenSelected = (children: { value: string }[]) => {
        return children.every((child) => selectedItems.includes(child.value));
    };

    // 处理父级选项的选中/取消
    const handleParentCheckboxChange = (parentValue: string, children: { value: string }[]) => {
        if (selectedItems.includes(parentValue)) {
            // 取消父级选项，同时取消所有子级选项
            setSelectedItems(selectedItems.filter((item) => !children.some((child) => child.value === item) && item !== parentValue));
        } else {
            // 选中父级选项，同时选中所有子级选项
            setSelectedItems([...selectedItems, parentValue, ...children.map((child) => child.value)]);
        }
    };

    // 保存选中结果到 localStorage
    const handleSave = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedItems));
        console.log('保存选中项:', selectedItems); // 打印用户选中的值
    };

    // 取消操作，恢复到最近一次保存的结果
    const handleCancel = () => {
        const savedValues = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedValues) {
            setSelectedItems(JSON.parse(savedValues));
        }
        console.log('取消操作，恢复到最近一次保存的结果');
    };

    // 渲染多选框组
    const renderCheckboxGroup = () => {
        return options.map((option) => (
            <div key={option.value} style={{ marginBottom: 16,textAlign:'left' }}>
                {/* 父级多选框 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        value={option.value}
                        checked={selectedItems.includes(option.value) || (option.children && isAllChildrenSelected(option.children))}
                        onChange={() => option.children && handleParentCheckboxChange(option.value, option.children)}
                    >
                        {option.label}
                    </Checkbox>
                    {option.children && (
                        <Button
                            type="link"
                            onClick={() => handleExpand(option.value)}
                            style={{ marginLeft: 8 }}
                        >
                            {expandedKeys.includes(option.value) ? '收起' : '展开'}
                        </Button>
                    )}
                </div>
                {/* 子级多选框 */}
                {option.children && expandedKeys.includes(option.value) && (
                    <div style={{ marginLeft: 24 }}>
                        <Group
                            value={selectedItems}
                            onChange={handleCheckboxChange}
                        >
                            {option.children.map((child) => (
                                <Checkbox key={child.value} value={child.value}>
                                    {child.label}
                                </Checkbox>
                            ))}
                        </Group>
                    </div>
                )}
            </div>
        ));
    };

    return (
        // 使用 Card 组件包裹整个功能模块
        <Card title="配置业主手机小程序服务功能" style={{ width: '100%',height: '100%',textAlign:"left" }} className='app'>
            {/* 渲染多选框组 */}
            {renderCheckboxGroup()}
            {/* 底部按钮区域 */}
            <div style={{ marginTop: 24, textAlign: 'left' }}>
                {/* 取消按钮 */}
                <Button style={{ marginRight: 8 }} onClick={handleCancel}>
                    取消
                </Button>
                {/* 保存按钮 */}
                <Button type="primary" onClick={handleSave}>
                    保存
                </Button>
            </div>
        </Card>
    );
};
export default Role;