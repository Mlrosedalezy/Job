import React from "react";
import { Link } from "react-router-dom";
import { NavBar, Toast } from "antd-mobile";
import { QrcodeOutlined, SettingOutlined, FileTextOutlined } from "@ant-design/icons";
import "./EpassManagement.less";
import { useNavigate } from "react-router-dom";

const PassManagement: React.FC = () => {
  const navigate = useNavigate();
  const items = [
    {
      icon: <QrcodeOutlined className="icon blue" />, 
      title: "通行二维码",
      path: "/epass"
    },
    {
      icon: <SettingOutlined className="icon orange" />, 
      title: "电子通行证配置",
      path: "/epass/config"
    },
    {
      icon: <FileTextOutlined className="icon green" />, 
      title: "通行记录",
      path: "/epass/records"
    }
  ];

  const back = () =>{
    navigate(-1)
  }


  return (
    <div className="pass-management">
      <NavBar onBack={back} className="nav-bar" />
      <h1 className="title">电子通行证管理</h1>
      <div className="card">
        {items.map((item, index) => (
          <Link to={item.path} key={index} className="item">
            <div className="icon-container">{item.icon}</div>
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PassManagement;
