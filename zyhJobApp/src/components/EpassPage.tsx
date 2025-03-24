import React, { useState } from 'react';
import { NavBar } from 'antd-mobile';
import './EpassPage.less';
import { Button, Divider } from 'antd';
import CustomPopup from './Child/Popup';
import AddEditForm from './Child/AddEpass';
import Search from './Child/Search';
import EQList from './Child/EQList';
import 'animate.css';
import {EpassApi} from '../untils/api';
import { useNavigate } from 'react-router-dom';

interface DoorData {
  _id: number;
  name: string;
  location: string;
  type: string;
}
const EpassPage: React.FC = () => {
  const [visible2, setVisible2] = useState(false);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [someId, setSomeId] = useState<number | null>(null);
  const [selectedDoors, setSelectedDoors] = useState<number[]>([]);
  const [doors, setDoors] = useState<{ _id: number }[]>([]); // 假设 doors 是从某个地方获取的所有门禁数据
  const [allSelected, setAllSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState<{ [key: string]: any }>({});
  const [data, setData] = useState<DoorData[]>([]);
  const [qrcodes, setQrcodes] = useState<{ [key: number]: string | null }>({});
  const [editingDoor, setEditingDoor] = useState<DoorData | null>(null);
  const [RefreshEdit, setRefreshEdit] = useState<Boolean>(false);
  const navigate = useNavigate();
  const handleShowAddEditForm = () => {
    setShowAddEditForm(true); // 显示 AddEditForm
    setEditingDoor(null); // 清空编辑门禁数据
  };

  const handleEditDoor = (door: DoorData) => {
    setShowAddEditForm(true); // 显示 AddEditForm
    setEditingDoor(door); // 设置编辑门禁数据
  };

  const handleClose = (value: boolean, refresh: boolean) => {
    setShowAddEditForm(false); // 关闭 AddEditForm
    setEditingDoor(null); // 清空编辑门禁数据
    setRefreshEdit(refresh)
  };

  const handleDoorSelection = (doorId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedDoors(prevSelectedDoors => {
        const newSelectedDoors = [...prevSelectedDoors, doorId];
        console.log('Selected Doors:', newSelectedDoors);
        return newSelectedDoors;
      });
    } else {
      setSelectedDoors(prevSelectedDoors => {
        const newSelectedDoors = prevSelectedDoors.filter(id => id !== doorId);
        console.log('Selected Doors:', newSelectedDoors);
        return newSelectedDoors;
      });
    }
  };

  const handleSelectAll = () => {
    setSelectedDoors(doors.map(door => door._id));
    setAllSelected(true);
  };

  const handleDeselectAll = () => {
    setSelectedDoors([]);
    setAllSelected(false);
  };

  const handleAllSelectedChange = (isAllSelected: boolean) => {
    setAllSelected(isAllSelected);
  };

  const handleBatchEnable = async () => {
    if (selectedDoors.length === 0) {
      console.log('没有选中的门禁，无法启用二维码');
      return;
    }
  
    try {
      const response = await EpassApi.post('/enable-qrcodes', { ids: selectedDoors });
      if (response.data.success) {
        console.log(response.data.message);
        // 更新 doors 状态
        setDoors(prevDoors =>
          prevDoors.map(door => ({
            ...door,
            status: selectedDoors.includes(door._id) ? 'enabled' : door.status
          }))
        );
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error('启用二维码失败:', error);
    }
  };
  
  const handleBatchDisable = async () => {
    if (selectedDoors.length === 0) {
      console.log('没有选中的门禁，无法禁用二维码');
      return;
    }
  
    try {
      const response = await EpassApi.post('/disable-qrcodes', { ids: selectedDoors });
      if (response.data.success) {
        console.log(response.data.message);
        // 更新 doors 状态
        setDoors(prevDoors =>
          prevDoors.map(door => ({
            ...door,
            status: selectedDoors.includes(door._id) ? 'disabled' : door.status
          }))
        );
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error('禁用二维码失败:', error);
    }
  };
  
  const handleBatchDelete = async () => {
    if (selectedDoors.length === 0) {
      console.log('没有选中的门禁，无法删除二维码');
      return;
    }
  
    try {
      const response = await EpassApi.post('/delete-qrcodes', { ids: selectedDoors });
      if (response.data.success) {
        console.log(response.data.message);
        // 更新 doors 状态
        setDoors(prevDoors => prevDoors.filter(door => !selectedDoors.includes(door._id)));
        setSelectedDoors([]);
        setAllSelected(false);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error('删除二维码失败:', error);
    }
  };

  const handleBatchDownload = async () => {
    if (selectedDoors.length === 0) {
      console.log('没有选中的门禁，无法批量下载');
      return;
    }
  
    try {
      const selectedDoorsData = data.filter(door => selectedDoors.includes(door._id));
  
      for (const door of selectedDoorsData) {
        const qrCodeUrl = qrcodes[door._id];
        if (qrCodeUrl) {
          const link = document.createElement('a');
          link.href = qrCodeUrl;
          link.download = `${door.name}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (error) {
      console.error('批量下载失败:', error);
    }
  };

  const onDataChange = (newData: DoorData[], newQrcodes: { [key: number]: string | null }) => {
    setData(newData);
    setQrcodes(newQrcodes);
  };

  return (
    <div className='epass-page'>
      <div className='epass-header'>
        <div className='epass-nav' onClick={() => navigate(-1)}><NavBar   /></div>
        <div className='epass-title'>
          <p className='epass-title-text'>通行二维码</p>
          <p className='epass-title-more' onClick={() => setVisible2(true)}>更多操作</p>
        </div>
        <Search setSearchQuery={setSearchQuery}/>
        <CustomPopup 
           visible={visible2} 
           onClose={() => setVisible2(false)} 
           selectedDoors={selectedDoors} 
           onBatchEnable={handleBatchEnable} 
           onBatchDisable={handleBatchDisable} 
           onBatchDelete={handleBatchDelete}  
          />
      </div>
      <div className='epass-body'>
        <EQList
          onDoorSelection={handleDoorSelection}
          selectedDoors={selectedDoors}
          doors={doors}
          setDoors={setDoors}
          allSelected={allSelected}
          onAllSelectedChange={handleAllSelectedChange}
          searchQuery={searchQuery}
          onDataChange={onDataChange}
          onEdit={handleEditDoor}
          setRefreshEdit={RefreshEdit}
        />
        {showAddEditForm && <AddEditForm onCancel={handleClose} id={editingDoor?._id} initialValues={editingDoor} />}
      </div>
      <Divider />
      <div className='epass-footer'>
        <div className='epass-footer-left'>
          <input
            className='epass-footer-input'
            type="checkbox"
            checked={allSelected}
            onChange={(e) => {
              if (e.target.checked) {
                handleSelectAll();
              } else {
                handleDeselectAll();
              }
            }}
          />
          <p className='epass-footer-p' onClick={handleBatchDownload}>批量下载</p>
        </div>
        <div className='epass-footer-right'>
          <Button type="primary" className='epass-footer-button' onClick={handleShowAddEditForm}>+新增</Button>
        </div>
      </div>
    </div>
  );
};

export default EpassPage;