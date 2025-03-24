import React from 'react';
import { Swiper, Toast } from 'antd-mobile'
import { NoticeBar,Image } from 'tdesign-mobile-react';
import "./HomePage.less"

const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']
const items = colors.map((color, index) => (
  <Swiper.Item key={index}>
    <div
      className='home-page-item'
      style={{ background: color,textAlign:"center",borderRadius:"20px" }}
      onClick={() => {
        Toast.show(`你点击了卡片 ${index + 1}`)
      }}
    >
      {index + 1}
    </div>
  </Swiper.Item>
))

const serviceList = [
  { name: '楼盘表', icon: <div className="service - icon">楼盘表</div> },
  { name: '巡更', icon: <div className="service - icon">巡更</div> },
  { name: '维修处理', icon: <div className="service - icon">维修处理</div> },
  { name: '投诉建议', icon: <div className="service - icon">投诉建议</div> },
  { name: '远程开门', icon: <div className="service - icon">远程开门</div> },
  { name: '访客管理', icon: <div className="service - icon">访客管理</div> },
  { name: '扫码审核', icon: <div className="service - icon">扫码审核</div> },
  { name: '更多', icon: <div className="service - icon">更多</div> }
];

const communityLifeList = [
  { name: '和生活' },
  { name: '智品商城' },
  { name: 'XX' },
  { name: 'XXX' }
];

export default function HomePage() {
  const content1 = ['君不见', '高堂明镜悲白发', '朝如青丝暮成雪', '人生得意须尽欢', '莫使金樽空对月'];
  return (
        <div className='home-page'>
      <div className='home-page-header'>
        <div className='home-page-header-swiper'>
        <Swiper
          loop
          autoplay
          onIndexChange={i => {
            console.log(i, 'onIndexChange1')
          }}
        >
          {items}
        </Swiper>
        </div>
        <div className='home-page-header-content'>
        <NoticeBar 
        style={{backgroundColor:"white",borderRadius:"20px",width:"95vw",padding:"10px"}} 
        visible 
        marquee 
        content={content1} 
        direction="vertical" 
        prefixIcon={<div style={{}}>
          <p style={{padding:"0",margin:"0",fontSize:"12px",color:"red"}}>公告</p>
          <p style={{padding:"0",margin:"0",fontSize:"12px",color:"red"}}>消息</p>
          </div>} />
        </div>
      </div>
      <div className="common-service">
        <div className="common-service-title">常用服务</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {serviceList.map((service, index) => (
            <div key={index} className="service-item">
                        <Image
                          src={'data:image/jpeg;base64,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'}
                          width={64}
                          height={64}
                          fit='cover'
                          style={{ borderRadius: 50 }}
                        />
              <div className="service-text">{service.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="community-life">
        <div className="community-life-title">社区生活</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }} style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} className='community-life-content'>
          {communityLifeList.map((item, index) => (
            <div key={index} className="community-item">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}