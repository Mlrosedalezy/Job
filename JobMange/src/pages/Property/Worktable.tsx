import React, { useState, useEffect, } from 'react';
import { workBench } from '../../api/api'
import * as echarts from 'echarts';
import 'animate.css';
import { Base64 } from 'js-base64';
import './Worktable.less'
import { useLocation } from 'react-router-dom';
import { SettingOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Tabs, Carousel } from 'antd';
import type { TabsProps } from 'antd';
const WorkTable: React.FC = () => {
  const [msg, setMsg] = useState<any>('')  //获取登录信息
  const [data, setData] = useState<any>([]) //获取小区数据
  const [lishow, setlishow] = useState<any>(false)
  useEffect(() => {
    let str = JSON.parse(Base64.decode(localStorage.getItem("loginmsg") || ''))
    setMsg(str)
    let cid = localStorage.getItem("cid") || ''
    getData(cid)

    chart1()
    chart2()
  }, [])
  // 初始获取数据
  const getData = async (id: string) => {
    try {
      let res = await workBench({ id })
      setData(res.data)
    } catch (error) {
      let count: number = 0
      let timeout = setInterval(async () => {
        count++
        let res = await workBench({ id })
        setData(res.data)
        if (res.data.length > 0) {
          clearInterval(timeout)
        }
        if (count > 3) {
          clearInterval(timeout)
        }
      }, 1000)
    }
  }

  const onChange = (key: string) => {
    // console.log(key);
  };
  // 人员统计echarts
  function chart1() {
    let box = echarts.init(document.getElementById('chart1'))
    let option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              // fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 484 },
            { value: 300 }
          ]
        }
      ]
    };
    box.setOption(option)
  }
  function chart2() {
    let box = echarts.init(document.getElementById('chart2'))
    let option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 580 },
            { value: 484 },
            { value: 300 }
          ]
        }
      ]
    };

    box.setOption(option)
  }
  // 人员统计tab
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '人员统计',
      children: (<>
        <ul>
          <li>
            <span>
              楼栋数量
            </span><br></br>
            <span>5</span>
          </li>
          <li>
            <span>
              房屋数量
            </span><br />
            <span>256</span>
          </li>
          <li id='chart1' style={{ width: '100px', height: '100px' }}>
          </li>
          <li style={{ marginLeft: '-80px' }}>
            <span>已入住256</span><br></br>
            <span>未入住40</span><br></br>
          </li>
          <li id="chart2" style={{ width: '100px', height: '100px' }}></li>
          <li style={{ marginLeft: '-80px' }}>
            <span>自用256</span><br></br>
            <span>租用256</span><br></br>
            <span>闲置256</span><br></br>
          </li>
          <li>
            <span>
              住户数量
            </span><br />
            <span>
              256
            </span>
          </li>
        </ul>
      </>
      ),
    },
    {
      key: '2',
      label: '设备设施',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '车位概况',
      label: 'Tab 3',
      children: 'Content of Tab Pane 3',
    },
  ];

  const contentStyle: React.CSSProperties = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  const images = [
    'https://tse2-mm.cn.bing.net/th/id/OIP-C.GrHBDky_o4zwnTuKN0l0ugHaHa?rs=1&pid=ImgDetMain',
    'https://pic.616pic.com/ys_bnew_img/00/45/49/TmwEL84lBv.jpg',
    'https://tse1-mm.cn.bing.net/th/id/OIP-C.riBo4wAFdXtsvb_2NHro6gAAAA?rs=1&pid=ImgDetMain',
  ];
  const imageStyle: React.CSSProperties = {
    width: '100%',      // 宽度占满容器
    height: '200px',    // 固定高度
    objectFit: 'cover', // 保持图片比例，裁剪多余部分
  };
  return (
    <div>
      <div className='worktop'>
        <div className='left'>
          <img src="https://pic1.zhimg.com/v2-02760a1bf058904006740d3f66b2c9ac_r.jpg?source=1940ef5c" />
          <div>
            <p>下午好，<b>{msg.username}</b>，祝你开心每一天！</p>
            <p>{data.communityName},隶属于{data.addr}</p>
          </div>
        </div>
        <div className='right'>
          <ul>
            <li>系统工作人员</li>
            <li>今日访客</li>
            <li>未处理工单</li>
          </ul>
          <ul style={{ fontSize: '20px', fontWeight: '500', color: "orange" }}>
            <li style={{ color: "blue" }}>{6}</li>
            <li>12</li>
            <li>663</li>
          </ul>
        </div>
      </div>
      <div className='workmain'>
        <div className='main-left'>
          {/* 人员统计 */}
          <div className='item1'>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            <p>截止2024-06-12</p>
          </div>
          {/* 待办事项 */}
          <div className='item2'>
            <p style={{
              display: "flex",
              justifyContent: "space-between",
              lineHeight: "40px",
              padding: "0 15px",
              borderBottom: "1px solid #ccc"
            }}>
              <span>待办事项</span>
              <span><SettingOutlined /></span>
            </p>
            <div>
              <div className='left' onClick={() => setlishow(false)}><LeftOutlined /></div>
              <ul className='animate__backOutLeft'>
                <li style={{ display: lishow ? "none" : "block" }}>
                  <p>身份确认</p>
                  <p className='num'>500</p>
                  <p className='str'>待确认</p>
                </li>
                <li style={{ display: lishow ? "none" : "block" }}>
                  <p>装修报备</p>
                  <div style={{
                    marginTop: "0"
                  }}>
                    <p style={{
                      display: "flex",
                      flexDirection: "column",
                    }}>
                      <span className='num'>2</span>
                      <span className='str'>待验收</span>
                    </p>
                    <p style={{
                      display: "flex",
                      flexDirection: "column",
                    }}>
                      <span className='num'>3</span>
                      <span className='str'>带审批</span>
                    </p>
                  </div>
                </li>
                <li style={{ display: lishow ? "none" : "block" }}>
                  <p>投诉建议</p>
                  <p className='num'>6</p>
                  <p className='str'>待回复</p>
                </li>
                <li style={{ display: lishow ? "none" : "block" }}>
                  <p>高空抛物</p>
                  <p className='num'>5</p>
                  <p className='str'>未处理</p>
                </li>
                <li style={{ display: lishow ? "block" : "none" }}>
                  <p>物业缴费</p>
                  <p style={{ color: "red" }}>
                    <span style={{ fontSize: "20px", marginRight: "5px" }}>98000.30</span>
                    <span style={{ color: "gray", fontSize: "12px" }}>已交</span>
                  </p>
                  <p className='str'>待确认 <span style={{ marginLeft: "5px" }}>欠费65户</span></p>
                </li>
                <li style={{ display: lishow ? "block" : "none" }}>
                  <p>维修处理</p>
                  <div style={{
                    marginTop: "0"
                  }}>
                    <p style={{
                      display: "flex",
                      flexDirection: "column",
                    }}>
                      <span className='num'>2</span>
                      <span className='str'>待验收</span>
                    </p>
                    <p style={{
                      display: "flex",
                      flexDirection: "column",
                    }}>
                      <span className='num' style={{ color: "orange" }}>13</span>
                      <span className='str'>待接单</span>
                    </p>
                  </div>
                </li>
                <li style={{ display: lishow ? "block" : "none" }}>
                  <p>内容审核</p>
                  <p className='num'>6</p>
                  <p className='str'>待审核</p>
                </li>
              </ul>
              <div className='right' onClick={() => setlishow(true)}><RightOutlined /></div>
            </div>
          </div>
          {/* 便捷导航 */}
          <div className='item3'>
            <p style={{
              display: "flex",
              justifyContent: "space-between",
              lineHeight: "40px",
              padding: "0 15px",
              borderBottom: "1px solid #ccc"
            }}>
              <span>便捷导航</span>
              <span><SettingOutlined /></span>
            </p>
            <div className='card'>
              <p>
                <span className='icon' style={{ background: "skyblue" }}></span>
                <span>房屋管理</span>
              </p>
              <p>
                <span className='icon' style={{ background: "orange" }}></span>
                <span>住户管理</span>
              </p>
              <p>
                <span className='icon' style={{ background: "red" }}></span>
                <span>物业管理费</span>
              </p>
              <p>
                <span className='icon' style={{ background: "purple" }}></span>
                <span>维修处理</span>
              </p>
              <p>
                <span className='icon' style={{ background: "pink" }}></span>
                <span>广告推送</span>
              </p>
              <p>
                <span className='icon' style={{ background: "blue" }}></span>
                <span>社区公告</span>
              </p>
              <p>
                <span className='icon' style={{ background: "green" }}></span>
                <span>智慧巡更</span>
              </p>
              <p>
                <span className='icon' style={{ background: "yellow" }}></span>
                <span>智慧预警</span>
              </p>
            </div>
          </div>
          {/* 通知广告 */}
          <div className='item'>
            <div className='left'>
              <p>通知公告<a href="javacript:">更多</a></p>
              <ul>
                <li>
                  <span>停水通知</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
                <li>
                  <span>维修公告</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
                <li>
                  <span>楼层消毒提醒</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
              </ul>
            </div>
            <div className='right'>
              <a href="javacript:">更多</a>
              <Carousel arrows autoplay autoplaySpeed={2000}>
                {images.map((src, index) => (
                  <div key={index} style={contentStyle}>
                    <img
                      src={src}
                      style={imageStyle}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
        <div className='main-right'>
          {/* 警告 */}
          <div className='item4'>
            <p style={{
              display: "flex",
              justifyContent: "space-between",
              lineHeight: "40px",
              padding: "0 15px",
              borderBottom: "1px solid #ccc"
            }}>
              <span>警告</span>
              <span><SettingOutlined /></span>
            </p>
            <div>
              <p>
                <img src="https://bpic.588ku.com/element_origin_min_pic/23/04/23/02d6cf5509f1d69e2e28a2385c337f80.jpg" alt="" />
                初入警告
              </p>
              <p>
                <img src="https://bpic.588ku.com/element_origin_min_pic/23/04/23/02d6cf5509f1d69e2e28a2385c337f80.jpg" alt="" />
                陌生人警告
              </p>
              <p>
                <img src="https://bpic.588ku.com/element_origin_min_pic/23/04/23/02d6cf5509f1d69e2e28a2385c337f80.jpg" alt="" />
                电车进电梯
              </p>
              <p>
                <img src="https://bpic.588ku.com/element_origin_min_pic/23/04/23/02d6cf5509f1d69e2e28a2385c337f80.jpg" alt="" />
                高空抛物
              </p>
              <p>
                <img src="https://bpic.588ku.com/element_origin_min_pic/23/04/23/02d6cf5509f1d69e2e28a2385c337f80.jpg" alt="" />
                燃放爆竹
              </p>
              <p>
                <img src="https://bpic.588ku.com/element_origin_min_pic/23/04/23/02d6cf5509f1d69e2e28a2385c337f80.jpg" alt="" />
                初入警告
              </p>
            </div>
          </div>
          {/* 事件 */}
          <div className='item5'>
            <p style={{
              lineHeight: "40px",
              padding: "0 15px",
              borderBottom: "1px solid #ccc"
            }}>事件</p>
            <div>
              <p>
                <span>投诉建议 <a href="javacript:;">更多</a></span>
                <span>待回复</span>
              </p>
              <ul>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
              </ul>
            </div>
            <div>
              <p>
                <span>维修处理 <a href="javacript:;">更多</a></span>
                <span>待回复</span>
              </p>
              <ul>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
              </ul>
            </div>
            <div>
              <p>
                <span>事件上报 <a href="javacript:;">更多</a></span>
                <span>待回复</span>
              </p>
              <ul>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
                <li>
                  <span>电梯摇晃太危险了</span>
                  <span>2021-09-12&nbsp;12:12:34</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkTable;