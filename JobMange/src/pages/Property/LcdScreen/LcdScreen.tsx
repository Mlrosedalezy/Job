import React, { useState, useEffect } from 'react';
import './lcdScreen.less';
import * as echarts from 'echarts';
import AMapLoader from '@amap/amap-jsapi-loader'; // 引入 
import {
  HomeOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import axios from 'axios';

interface SnapshotItem {
  id: number;
  name: string;
  unit: string;
  timestamp: string;
}

interface NoteItem {
  type: '绿码' | '黄码' | '未核验';
  temperature: string;
}
interface AccessRecord {
  id: number;
  code: string;
  timestamp: string;
}

interface AccessStatus {
  type: '进' | '出';
}

interface HighAltThrowItem {
  id: number;
  location: string;
  deviceCode: string;
  timestamp: string;
}

const LcdScreen = () => {
  useEffect(() => {
    chart1()
    chart2()
    // startScroll()
    chart3()
    gdAPI()
  }, [])
  // 定义高德地图配置
  const MAP_CONFIG = {
    key: '155249504150b1b041ca6af0ca21c49c',
    version: '2.0',
    plugins: [],
    zoom: 10,
    center: [116.397428, 39.90923],
  };

  interface SnapshotItem {
    id: number;
    name: string;
    unit: string;
    timestamp: string;
  }
  async function gdAPI() {
    try {
      const AMap = await AMapLoader.load({
        key: '1796c764f3ea94238c32243d5a8947a2', // 你的高德地图 API key
        version: '2.0',
        plugins: [], // 如果需要使用插件，可以在这里添加
      });
      // 创建地图实例
      const map = new AMap.Map('container', {
        zoom: 18, // 初始化地图层级
        center: [103.972404,30.667253], // 初始化地图中心点
        viewMode: '3D' //使用3D视图
      });

      console.log('地图加载成功', map);
    } catch (error) {
      console.error('地图加载失败', error);
    }

  }


  let [showTime, setShowTime] = useState<string>('');
  // 创建一个新的Date对象
  setInterval(() => {
    const now = new Date();
    // 获取年、月、日、时、分、秒
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // 获取星期几
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];

    // 组合成完整的日期时间字符串
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekday}`;

    setShowTime(dateTimeString)
  }, 1000)
  window.addEventListener('resize', () => {
    let box = document.documentElement;
    box.style.fontSize = Math.max(box.clientWidth / 106.5) + 'px';
  })

  function chart1() {
    let char = document.querySelector('#chart1')
    let myChart = echarts.init(char as HTMLElement);
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
          name: '人口',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 4044 },
            { value: 300 }
          ]
        }
      ]
    };
    myChart.setOption(option);
    window.addEventListener('resize', function () {
      myChart.resize()
    })
  }
  function chart2() {
    const chart = echarts.init(document.getElementById('chart2') as HTMLElement);
    // 图表配置
    const option = {
      title: {
        textStyle: {
          fontSize: '1.2rem', // 使用 rem 单位
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        bottom: '10%',
        left: 'center',
        textStyle: {
          fontSize: '1rem', // 使用 rem 单位
        },
      },
      grid: {
        left: '0%',
        right: '10%',
        bottom: '20%',
        top: '1%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
          fontSize: '1rem', // 使用 rem 单位
        },
      },
      yAxis: {
        type: 'category',
        data: ['业主', '物业', '五保户', '军人', '退休', '低保'],
        axisLabel: {
          fontSize: '1rem', // 使用 rem 单位
          color: 'white', // 设置 Y 轴字体颜色为红色
        },
      },
      series: [
        {
          type: 'bar',
          data: [700, 200, 80, 20, 11, 20, 4, 3],
          itemStyle: {
            color: '#5470C6', // 设置柱状图颜色
          },
          label: {
            show: true,
            position: 'right',
            fontSize: '1rem', // 使用 rem 单位
          },
        },
      ],
    };

    chart.setOption(option);

    // 监听窗口大小变化，调整图表大小
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

  }

  function chart3() {
    const chart = echarts.init(document.getElementById('chart3') as HTMLElement);

    // 图表配置
    const option = {
      title: {
        left: 'center',
        textStyle: {
          fontSize: '1.2rem', // 使用 rem 单位
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['充电量', '充电时长'], // 使用 rem 单位
        right: "5%",
        top: "10%",
        textStyle: {
          fontSize: '0.8rem', // 使用 rem 单位
        },
      },
      grid: {
        top: '10%',
        left: '4%',
        right: '4%',
        bottom: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['08-01', '08-02', '08-03', '08-04', '08-15', '08-16', '08-17'],
        axisLabel: {
          fontSize: '1rem', // 使用 rem 单位
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: '1rem', // 使用 rem 单位
        },
      },
      series: [
        {
          name: '充电量',
          type: 'bar',
          data: [1400, 1200, 1000, 800, 600, 400, 200],
          itemStyle: {
            color: '#5470C6', // 设置柱状图颜色
          },
          label: {
            show: true,
            position: 'top',
            fontSize: '1rem', // 使用 rem 单位
          },
        },
        {
          name: '充电时长',
          type: 'bar',
          data: [500, 450, 400, 350, 300, 250, 200], // 示例数据
          itemStyle: {
            color: '#91CC75', // 设置柱状图颜色
          },
          label: {
            show: true,
            position: 'top',
            fontSize: '1rem', // 使用 rem 单位
          },
        },
      ],
    };

    chart.setOption(option);

    // 监听窗口大小变化，调整图表大小
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
  }
  const statsData = [
    { name: '充电站总数', value: '1', color: '#007bff' },
    { name: '充电口总数', value: '300', color: '#007bff' },
    { name: '告警总数', value: '2', color: '#ff4d4f' }, // 红色
    { name: '累计充电时长', value: '565.87分', color: '#52c41a' }, // 绿色
    { name: '累计充电量', value: '33.98瓦', color: '#faad14' }, // 橙色
  ];


  const snapshots: SnapshotItem[] = [
    { id: 1, name: '张三', unit: '2栋3单元', timestamp: '2020-12-12 12:23:44' },
    // 重复数据用于演示，实际应从接口获取
    ...Array(3).fill({
      id: 2,
      name: '张三',
      unit: '2栋3单元',
      timestamp: '2020-12-12 12:23:44'
    })
  ];
  const notes: NoteItem[] = [
    { type: '绿码', temperature: '一°C' },
    { type: '未核验', temperature: '一°C' },
    { type: '黄码', temperature: '36.7°C' },
    { type: '绿码', temperature: '36.7°C' }
  ];

  const records: AccessRecord[] = [
    { id: 1, code: 'JIT123456', timestamp: '2020-12-12 12:23:44' },
    { id: 2, code: 'JIT123456', timestamp: '2020-12-12 12:23:44' },
    { id: 3, code: 'JIT123456', timestamp: '2020-12-12 12:23:44' }
  ];
  const statuses: AccessStatus[] = [
    { type: '进' },
    { type: '进' },
    { type: '出' },
    { type: '进' }
  ];

  const data: HighAltThrowItem[] = [
    {
      id: 1,
      location: '腾讯大厦高空抛物',
      deviceCode: '12341231234234',
      timestamp: '2020-12-12 12:23:44'
    },
    {
      id: 2,
      location: '腾讯大厦高空抛物',
      deviceCode: '12341231234234',
      timestamp: '2020-12-12 12:23:44'
    },
    {
      id: 3,
      location: '腾讯大厦高空抛物',
      deviceCode: '12341231234234',
      timestamp: '2020-12-12 12:23:44'
    },
    // ...Array(2).fill({
    //   id: 2,
    //   location: '腾讯大厦高空抛物',
    //   deviceCode: '12341231234234',
    //   timestamp: '2020-12-12 12:23:44'
    // })
  ];
  return (
    <div className='lcd' id="container" >
      <div className='top'>
        <div className='left'>
          <div className='logo'>LOGO</div>
          <div>
            <h1>智慧社区物业大屏</h1>
          </div>
        </div>
        <div className='right'>
          <div className='data'>
            <ul className='u1'>
              <li>12</li>
              <li>776</li>
              <li>3354</li>
              <li>1254</li>
              <li>50</li>
            </ul>
            <ul className='u2'>
              <li>楼栋数量</li>
              <li>房屋数量</li>
              <li>住户数量</li>
              <li>车辆数量</li>
              <li>设备设施</li>
            </ul>
          </div>
          <div className='show-time'>
            <h3>
              {showTime}
            </h3>
          </div>
        </div>
      </div>
      <div className='main'>
        <div className='left'>
          <div className='item'>
            <h3 style={{
              color: "rgb(51, 255, 255)",
              fontWeight: "500",
              margin: "5px 0"
            }}>小区概况</h3>
            <p style={{ marginLeft: "1rem", color: "white" }}>鼎盛大厦A座</p>
            <p style={{ marginLeft: "1rem" }}>地址：北京市朝阳区建国路93号</p>
            <div>
              <ul style={{
                display: "flex",
                listStyle: "none",
                justifyContent: "space-around",
                fontSize: "1.2rem",
                color: "rgb(51, 255, 255)",
                fontWeight: "700",
                marginTop: "0.6rem",
              }}>
                <li>12</li>
                <li>589</li>
                <li>475</li>
              </ul>
              <ul style={{
                display: "flex",
                listStyle: "none",
                justifyContent: "space-around",
                color: "white",
                marginBottom: "0.6rem",
                fontSize: "0.8rem"
              }}>
                <li>楼栋数</li>
                <li>房屋数</li>
                <li>住户数</li>
              </ul>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-around",
            }}>
              <div className='per'>
                <p style={{ color: "white" }}><span style={{ color: "orange" }}>流动人口：</span>324（9.75%）</p>
                <p style={{ color: "white" }}><span style={{ color: "green" }}>常驻人口：</span>3000（90.75%）</p>
              </div>
              <div id='chart1'>
              </div>
            </div>
          </div>
          <div className='item'>
            <h3 style={{
              color: "rgb(51, 255, 255)",
              margin: "5px 0",
              fontWeight: "500",
              marginBottom: "0.6rem",
            }}>房屋类型分布</h3>
            <div style={{
              display: "flex",
              justifyContent: "space-around",
            }}>
              <p style={{
                color: "#328966",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#334b56",
                width: "24%",
                padding: "1rem 0",
              }}>
                <HomeOutlined style={{ fontSize: "3rem" }} />
                <span style={{
                  fontWeight: "700",
                  fontSize: "1.2rem"
                }}>121</span>
                <span style={{ color: "white" }}>80%</span>
                <button style={{
                  backgroundColor: "#328966",
                  border: "none",
                  color: "gray",
                  fontWeight: "700",
                  padding: "5px 10px",
                  marginTop: "1rem",
                  width: "5rem",
                  fontSize: "1rem",
                }}>自用</button>
              </p>
              <p style={{
                color: "#46629d",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#334b56",
                width: "24%",
                padding: "1rem 0",
              }}>
                <HomeOutlined style={{ fontSize: "3rem" }} />
                <span style={{
                  fontWeight: "700",
                  fontSize: "1.2rem"
                }}>124</span>
                <span style={{ color: "white" }}>15%</span>
                <button style={{
                  backgroundColor: "#46629d",
                  border: "none",
                  color: "gray",
                  fontWeight: "700",
                  padding: "5px 10px",
                  marginTop: "1rem",
                  width: "5rem",
                  fontSize: "1rem",
                }}>租用</button>
              </p>
              <p style={{
                color: "#d9d9d9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#334b56",
                width: "24%",
                padding: "1rem 0",
              }}>
                <HomeOutlined style={{ fontSize: "3rem" }} />
                <span style={{
                  fontWeight: "700",
                  fontSize: "1.2rem"
                }}>121</span>
                <span style={{ color: "white" }}>80%</span>
                <button style={{
                  backgroundColor: "#4b5453",
                  border: "none",
                  color: "gray",
                  fontWeight: "700",
                  padding: "5px 10px",
                  marginTop: "1rem",
                  width: "5rem",
                  fontSize: "1rem",
                }}>闲置</button>
              </p>
            </div>
          </div>
          <div className='item'>
            <h3 style={{
              color: "rgb(51, 255, 255)",
              margin: "5px 0",
              fontWeight: "500",
              marginBottom: "0.6rem",
            }}>住户分布 <a style={{
              fontSize: "0.8rem",
              float: "right",
            }} href="javascript:">更多</a></h3>
            <div id='chart2' style={{
              width: "100%",
              height: "100%",
            }}></div>
          </div>
        </div>
        <div className='middle'>
          <div className='down'>
            <div className='item'>
              <h3 style={{
                color: "rgb(51, 255, 255)",
                margin: "5px 0",
                fontWeight: "500",
                marginBottom: "0.6rem",
                marginLeft: "0.5rem",
              }}>通知公告 <a style={{
                fontSize: "0.8rem",
                float: "right",
              }} href="javascript:">更多</a></h3>
              <ul className="notification-list">
                <li className="notification-date">消毒提示XXXXXX... <span >2021-09-12 12:34</span></li>
                <li className="notification-date">消毒提示XXXXXX... <span >2021-09-12 12:34</span></li>
                <li className="notification-date">消毒提示XXXXXX... <span >2021-09-12 12:34</span></li>
                <li className="notification-date">消毒提示XXXXXX... <span >2021-09-12 12:34</span></li>
                <li className="notification-date">消毒提示XXXXXX... <span >2021-09-12 12:34</span></li>
                <li className="notification-date">消毒提示XXXXXX... <span >2021-09-12 12:34</span></li>
                <li className="notification-date">消毒提示XXXXXX... <span >2021-09-12 12:34</span></li>
                <li className="notification-date">消毒提示XXXXXX... <span >2021-09-12 12:34</span></li>
              </ul>
            </div>
            <div className='item'>
              <h3 style={{
                color: "rgb(51, 255, 255)",
                margin: "5px 0",
                fontWeight: "500",
                marginBottom: "0.6rem",
                marginLeft: "0.5rem",
              }}>智能充电 <a style={{
                fontSize: "0.8rem",
                float: "right",
              }} href="javascript:">更多</a></h3>
              <div className="charging-stats">
                <ul className="stats-list">
                  {statsData.map((stat, index) => (
                    <li key={index} className="stat-item">
                      <span className="stat-name" style={{
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: "300",
                      }}>{stat.name}</span>
                      <span className="stat-value" style={{ color: stat.color, fontSize: "0.8rem", fontWeight: "500", marginLeft: "0.5rem" }}>
                        {stat.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div id='chart3' style={{
                width: "100%",
                height: "80%",
              }}></div>
            </div>
          </div>
        </div>
        <div className='right'>
          <div className='item'>
            <h3 style={{
              color: "rgb(51, 255, 255)",
              fontWeight: "500",
              marginLeft: "0.5rem",
            }}>门禁抓拍 <a style={{
              fontSize: "0.8rem",
              float: "right",
            }} href="javascript:">更多</a></h3>
            <div className="container">
              <div className="snapshots-list">
                {snapshots.map((item, index) => (
                  <SnapshotItem key={index} {...item} />
                ))}
              </div>
              <div className="notes-section">
                {notes.map((note, index) => (
                  <NoteItem key={index} {...note} />
                ))}
              </div>
            </div>
          </div>
          <div className='item'>
            <h3 style={{
              color: "rgb(51, 255, 255)",
              margin: "5px 0",
              fontWeight: "500",
              marginLeft: "0.5rem",
            }}>车辆出入 <a style={{
              fontSize: "0.8rem",
              float: "right",
            }} href="javascript:">更多</a></h3>
            <div className="access-container">
              <div className="records-list">
                {records.map((record) => (
                  <RecordItem key={record.id} {...record} />
                ))}
              </div>
              <div className="status-section">
                {statuses.map((status, index) => (
                  <StatusItem key={index} {...status} />
                ))}
              </div>
            </div>
          </div>
          <div className='item'>
            <h3 style={{
              color: "rgb(51, 255, 255)",
              margin: "5px 0",
              fontWeight: "500",
              marginLeft: "0.5rem",
            }}>高空抛物 <a style={{
              fontSize: "0.8rem",
              float: "right",
            }} href="javascript:">更多</a></h3>
            <div className="high-alt-container">
              <div className="records-list">
                {data.map((item) => (
                  <ThrowItem key={item.id} {...item} />
                ))}
              </div>
              <div className='icons'>
                <WarningOutlined className='icon-item' />
                <WarningOutlined className='icon-item' />
                <WarningOutlined className='icon-item' />
                <WarningOutlined className='icon-item' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SnapshotItem: React.FC<SnapshotItem> = ({ name, unit, timestamp }) => (
  <div className="snapshot-item">
    <div className="user-info">
      <span className="name">{name}</span>
      <span className="unit">（{unit}）</span>
    </div>
    <div className="timestamp">{timestamp}</div>
  </div>
);
const NoteItem: React.FC<NoteItem> = ({ type, temperature }) => {
  const typeColors = {
    '绿码': '#52c41a',
    '黄码': '#faad14',
    '未核验': '#f5222d'
  };

  return (
    <div className="note-item">
      <span
        className="type-dot"
        style={{ backgroundColor: typeColors[type] }}
      />
      <span className="note-text">
        注：{type}
        <span className="temperature">{temperature}</span>
      </span>
    </div>
  );
};

const RecordItem: React.FC<AccessRecord> = ({ code, timestamp }) => (
  <div className="record-item">
    <div className="code">{code}</div>
    <div className="timestamps">{timestamp}</div>
  </div>
);
const StatusItem: React.FC<AccessStatus> = ({ type }) => {
  const statusColors = {
    '进': '#52c41a',
    '出': '#f5222d'
  };
  return (
    <div className="status-item">
      <span
        className="status-icon"
        style={{ backgroundColor: statusColors[type] }}
      />
      <span className="status-text">{type}</span>
    </div>
  );
};

const ThrowItem: React.FC<HighAltThrowItem> = ({ location, deviceCode, timestamp }) => (<div>
  <div className="throw-item">
    <div className="location">位置（{location}）</div>
    <div className="device-code">设备编码（{deviceCode}）</div>
    <div className="time" style={{
      marginBottom: '0.5rem'
    }}>{timestamp}</div>
  </div>
</div>
);

export default LcdScreen;