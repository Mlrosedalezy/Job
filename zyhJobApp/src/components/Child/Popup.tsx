import React from 'react';
import { Popup} from 'antd-mobile'
import { Button,Divider } from 'antd';
import './Popup.less'

interface CustomPopupProps {
  visible: boolean;
  onClose: () => void;
  selectedDoors: number[];
  onBatchEnable: () => void;
  onBatchDisable: () => void;
  onBatchDelete: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ visible, onClose, selectedDoors, onBatchEnable, onBatchDisable, onBatchDelete })=> {
  return (
    <div className='epass-popup'>
            <Popup
              visible={visible}
              onMaskClick={onClose}
              onClose={onClose}
              position='top'
              bodyStyle={{ height: '35vh' }}
              className='epass-popup-content'
            >
              <div className='epass-popup-body'>
                <div className='epass-popup-title'><p className='epass-popup-title-text'>更多操作</p></div>
                <div className='epass-popup-btn'>  
                  <Button  className='epass-popup-btn-text' type="primary" onClick={onBatchEnable} disabled={selectedDoors.length === 0}>
                    全部启用
                  </Button>
                </div>
                <div className='epass-popup-btn'>  
                  <Button className='epass-popup-btn-text' color="danger" variant="outlined" onClick={onBatchDisable} disabled={selectedDoors.length === 0}>
                    全部禁用
                  </Button>
                </div>
                <Divider></Divider>
                <div className='epass-popup-btn'>
                  <Button className='epass-popup-btn-text' color="danger" variant="outlined" onClick={onBatchDelete} disabled={selectedDoors.length === 0}>
                    全部删除
                  </Button>
                </div>
                <Divider></Divider>
                <div className='epass-popup-btn'>   
                  <Button color="default" className='epass-popup-btn-text' variant="outlined" onClick={onClose}>
                    关闭
                  </Button>
                </div>
              </div>
            </Popup>
        </div>
  )
}

export default CustomPopup