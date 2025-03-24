import React, { useEffect, useState } from 'react';
import { Grid, Card } from 'antd-mobile';
import { NavBar, Toast,Image } from 'antd-mobile';
import axios, { AxiosResponse } from 'axios';
import { serviceApi } from "../untils/api";
import './ServicePage.less'; // 引入 Less 样式文件
import { useNavigate } from 'react-router-dom';

// 定义 Routing 接口
interface Routing {
  _id: string;
  RoutingName: string;
  RoutingChildren: RoutingChild[];
}

// 定义 RoutingChild 接口
interface RoutingChild {
  _id: string;
  routerName: string;
  routerPath: string;
}

export default function ServicePage() {
  const [services, setServices] = useState<Routing[]>([]);
  const navigate = useNavigate();
  const back = () =>{
    navigate(-1)
  }

  const handleSkip = (routerPath: string) => {
    console.log(routerPath,"routerPath")
    navigate(`/${routerPath}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 调用 API 并提取响应数据
        const response: AxiosResponse<any> = await serviceApi.get('/routingList');

        // 检查响应数据是否存在并且是期望的格式
        if (response.data && Array.isArray(response.data)) {
          setServices(response.data); // 直接使用 response.data
        } else if (response.data && Array.isArray(response.data.data)) {
          setServices(response.data.data); // 如果有 data 字段，则使用 data
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="service-page">
      <div className='service-page-Navbar'>
      <NavBar onBack={back} className="nav-bar"></NavBar>
        <p className='service-page-title'>服务</p>
      </div>
      {services.map((serviceGroup) => (
        <div key={serviceGroup._id} className='service-group'>
          <h3 className="service-group-title">{serviceGroup.RoutingName}</h3>
          <Grid columns={4} gap={5}>
            {serviceGroup.RoutingChildren.map((item: RoutingChild) => (
              <Card key={item._id} className="service-card" onClick={()=>{handleSkip(item.routerPath)}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <Image
                    className='service-img'
                    src={""}
                    width={30}
                    height={30}
                    fit='cover'
                    style={{ borderRadius: 32 }}
                  />
                <p>{item.routerName}</p>
                </div>
  
              </Card>
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
}