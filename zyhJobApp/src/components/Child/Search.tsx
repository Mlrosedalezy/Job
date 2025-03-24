import React,{useState} from 'react';
import {  Popup } from 'antd-mobile';
import {Select,DatePicker,Button, Input,Form} from "antd"
import './Search.less'
import {EpassApi} from "../../untils/api"

interface SearchProps {
  setSearchQuery: (query: { [key: string]: any }) => void;
}
const Search: React.FC<SearchProps> = ({ setSearchQuery }) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm(); // 获取 form 实例

    const handleOpen = () => {
      setVisible(true);
    };
  
    const handleClose = () => {
      setVisible(false);
    };
  
    const handleSubmit = async (values: any) => {
      try {
        const { type, name, location, StartTime, endTime } = values;
        const query: { [key: string]: any } = {};
  
        if (type && type !== '全部') {
          query.type = type;
        }
  
        if (name) {
          query.name = name;
        }
  
        if (location) {
          query.location = location;
        }
  
        if (StartTime) {
          query.startDate = StartTime.toISOString().split('T')[0];
        }
  
        if (endTime) {
          query.endDate = endTime.toISOString().split('T')[0];
        }
        setSearchQuery(query);
        // 在这里处理查询结果
      } catch (error) {
        console.error('查询失败:', error);
      } finally {
        handleClose();
      }
    };
  
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          onClick={handleOpen}
          style={{
            width: '90%',
            height: '40px',
            borderRadius: '20px',
            backgroundColor: '#fff',
            color: '#666666',
            border: 'none',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          查询
        </Button>
        <Popup visible={visible} position="top" onClose={handleClose}>
          <div style={{ padding: '16px', backgroundColor: '#fff' }}>
            <h3>查询</h3>
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item name="type"  label="出入类型">
                <Select defaultValue="全部" placeholder="出入类型" style={{width:'100px'}}>
                  <option value="全部">全部</option>
                  <option value="入口">入口</option>
                  <option value="出口">出口</option>
                </Select>
              </Form.Item>
              <Form.Item name="name" label="名称">
                <Input placeholder="名称" />
              </Form.Item>
              <Form.Item name="location" label="位置">
                <Input placeholder="位置" />
              </Form.Item>
              <Form.Item name="StartTime" label="提交时间" style={{display:"flex",flexDirection:"column"}}>
                <DatePicker renderExtraFooter={() => 'extra footer'} placeholder='开始时间'/>
              </Form.Item>
              <Form.Item name="endTime"  style={{display:"flex",flexDirection:"column"}}>
                <DatePicker renderExtraFooter={() => 'extra footer'} placeholder='结束时间'/>
              </Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <Button onClick={() => form.resetFields()}>重置</Button>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </div>
            </Form>
          </div>
        </Popup>
      </div>
    );
  };
  
  export default Search;