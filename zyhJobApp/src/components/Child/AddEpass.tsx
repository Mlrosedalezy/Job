// AddEditForm.tsx
import React, { useState,useEffect } from 'react';
import { Form, Input, Radio, Button, message } from 'antd';
import './AddEpass.less';
import 'animate.css';
import {EpassApi} from "../../untils/api"

interface DoorData {
  _id: number;
  name: string;
  location: string;
  type: string;
}

interface AddEditFormProps {
    onCancel: (value: boolean, refresh: boolean) => void; // 定义 onCancel 函数类型
    id?: string;
    initialValues?: DoorData; // 新增 initialValues 类型
  }
const AddEditForm: React.FC<AddEditFormProps> = ({ onCancel,id,initialValues  }) => {
  const [form] = Form.useForm();
  const [entryType, setEntryType] = useState('出');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setEntryType(initialValues.type || '出');
    }
  }, [form, initialValues]);
  const handleSubmit = async (values: any) => {
    try {
      let response;
      if (id) { // 如果存在 id，则为更新操作
        response = await EpassApi.post('/save-qrcode', { ...values, id });
        console.log(response.status,"更新")
      } else { // 否则为新增操作
        response = await EpassApi.post('/save-qrcode', values);
        console.log(response.status,"新增")
      }
      
      if (response.status === 200) {
        const isChanged  = form.isFieldsTouched();
        onCancel(true, isChanged );
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
    } catch (error) {
      console.error(error);
      message.error('保存失败，请稍后再试');
    }
  };
  const onFinish = (values: any) => {
    handleSubmit(values)
    const isChanged  = form.isFieldsTouched();
    console.log(isChanged )
    onCancel(true, isChanged );

    message.success('保存成功');
  };


  const handleCancel = () => {
    onCancel(false,false); // 调用父组件传递的 onCancel 函数，并传递 false 值
  };

  return (
    <div className="add-edit-form animate__animated animate__slideInUp">
      <h3>新增/编辑</h3>
      <Form
        form={form}
        name="add-edit-form"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item
          label="出入位置"
          name="location"
          rules={[{ required: true, message: '请输入出入位置' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="出入类型" name="type">
          <Radio.Group value={entryType} onChange={(e) => setEntryType(e.target.value)}>
            <Radio value="出">出</Radio>
            <Radio value="入">入</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[{ max: 50, message: '最多输入50个字符' }]}
        >
          <Input.TextArea placeholder="请输入（0/50）" maxLength={50} showCount />
        </Form.Item>

        <div className="form-buttons">
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary"  htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEditForm;