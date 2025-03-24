import React, { useState, useEffect } from "react";
import { Card, Button, Checkbox, Modal, Image,message  } from "antd";
import { EpassApi } from "../../untils/api";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./EQList.less";

interface DoorData {
  _id: number;
  name: string;
  location: string;
  type: string;
}

interface EQListProps {
  onDoorSelection: (doorId: number, isSelected: boolean) => void;
  selectedDoors: number[];
  doors: { _id: number }[];
  setDoors: React.Dispatch<React.SetStateAction<{ _id: number }[]>>;
  allSelected: boolean;
  onAllSelectedChange: (isAllSelected: boolean) => void;
  searchQuery: { [key: string]: any }; // 添加搜索条件
  onDataChange: (data: DoorData[], qrcodes: { [key: number]: string | null }) => void;
  onEdit: (door: DoorData) => void;
  setRefreshEdit: React.Dispatch<React.SetStateAction<boolean>>; 
}

const EQList: React.FC<EQListProps> = ({setRefreshEdit,onEdit, onDataChange,onDoorSelection, selectedDoors, doors, setDoors, allSelected, onAllSelectedChange, searchQuery }) => {
  const [data, setData] = useState<DoorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrcodes, setQrcodes] = useState<{ [key: number]: string | null }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoor, setSelectedDoor] = useState<DoorData | null>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [doorToDelete, setDoorToDelete] = useState<DoorData | null>(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await EpassApi.get("/qrcodes",{params: searchQuery});
      const doorsData = response.data.data;
      // 初始化 qrcodes 状态
      const initialQrcodes = doorsData.reduce((acc: { [key: number]: string | null }, door: DoorData) => ({ ...acc, [door._id]: null }), {});
      setQrcodes(initialQrcodes);

      // 获取每个门禁的二维码
      const updatedQrcodes = await Promise.all(
        doorsData.map(async (door: DoorData) => {
          const qrCodeUrl = await generateQRCode(door);
          return { _id: door._id, qrCodeUrl };
        })
      );

      // 更新 qrcodes 状态
      const newQrcodes = updatedQrcodes.reduce((acc, { _id, qrCodeUrl }) => ({ ...acc, [_id]: qrCodeUrl }), {});
      setQrcodes(newQrcodes);

      setData(doorsData);
      setDoors(doorsData.map(door => ({ _id: door._id })));
      onDataChange(doorsData, newQrcodes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery,setRefreshEdit]);

  const generateQRCode = async (door: DoorData) => {
    try {
      const response = await EpassApi.post('/generate-qrcode', {
        name: door.name,
        location: door.location,
        type: door.type
      });
      return response.data.qrCodeUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  const handleQRCodeClick = (door: DoorData) => {
    setSelectedDoor(door);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const downloadQRCode = (url: string, filename: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCheckboxChange = (door: DoorData, e: React.ChangeEvent<HTMLInputElement>) => {
    onDoorSelection(door._id, e.target.checked);
  };

  useEffect(() => {
    // 检测所有复选框是否都被选中
    const isAllSelected = doors.every(door => selectedDoors.includes(door._id));
    if (isAllSelected !== allSelected) {
      onAllSelectedChange(isAllSelected);
    }
  }, [selectedDoors, doors, allSelected]);

  const handleDelete = async (door: DoorData) => {
    setConfirmDeleteVisible(true);
    setDoorToDelete(door);
  };
  const handelInfo = (item: DoorData)=>{
    navigate('/eqinfo',{state:item})
  }
  const confirmDelete = async () => {
    if (doorToDelete) {
      try {
        const response = await EpassApi.post('/delete-pass-config', { id: doorToDelete._id });
        if (response.data.success) {
          message.success('删除电子通行证配置成功');
          // 从数据中移除已删除的门禁
          setData(prevData => prevData.filter(d => d._id !== doorToDelete._id));
          setDoors(prevDoors => prevDoors.filter(d => d._id !== doorToDelete._id));
          setQrcodes(prevQrcodes => {
            const newQrcodes = { ...prevQrcodes };
            delete newQrcodes[doorToDelete._id];
            return newQrcodes;
          });
        } else {
          message.error('删除电子通行证配置失败');
        }
      } catch (error) {
        console.error('删除电子通行证配置失败:', error);
        message.error('删除电子通行证配置失败，请稍后再试');
      }
    }
    setConfirmDeleteVisible(false);
    setDoorToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteVisible(false);
    setDoorToDelete(null);
  };

  return (
    <div className="door-list">
      {loading ? (
        <p className="loading-text">加载中...</p>
      ) : (
        data.map((item) => (
          <Card key={item._id} className="door-card">
            <Checkbox 
              className="door-checkbox"
              checked={selectedDoors.includes(item._id)}
              onChange={(e) => handleCheckboxChange(item, e)}
            />
            <div className="door-content">
              <img
                src={qrcodes[item._id] || "https://placehold.co/48x48"}
                alt="二维码"
                className="door-qrcode"
                onClick={() => handleQRCodeClick(item)}
              />
              <div className="door-details">
                <p className="door-name">
                  名称：<span>{item.name}</span>
                </p>
                <p className="door-location">
                  位置：<span>{item.location}</span>
                </p>
                <p className="door-type">
                  出入类型：<span>{item.type}</span>
                </p>
              </div>
            </div>
            <RightOutlined className="door-arrow" onClick={() => handelInfo(item)} />
            <div className="door-actions">
              <Button type="link" className="edit-btn" onClick={() => onEdit(item)}>
                编辑
              </Button>
              <Button type="link" danger className="delete-btn" onClick={() => handleDelete(item)}>
                删除
              </Button>
            </div>
          </Card>
        ))
      )}
      <Modal
        title="通行二维码"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            返回
          </Button>,
          selectedDoor && (
            <Button key="download" type="primary" onClick={() => downloadQRCode(qrcodes[selectedDoor._id], `${selectedDoor.name}.png`)}>
              下载二维码
            </Button>
          ),
        ]}
      >
        {selectedDoor && (
          <>
            <Image
              width={200}
              src={qrcodes[selectedDoor._id] || "https://placehold.co/48x48"}
              alt="二维码"
            />
            <p>名称：{selectedDoor.name}</p>
            <p>位置：{selectedDoor.location}</p>
            <p>出入类型：{selectedDoor.type}</p>
          </>
        )}
      </Modal>
      <Modal
        title="确认删除"
        visible={confirmDeleteVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="确定"
        cancelText="取消"
      >
        <p>您确定要删除该电子通行证配置吗？</p>
      </Modal>
    </div>
  );
};

export default EQList;