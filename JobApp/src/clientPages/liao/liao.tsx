import { NavBar, Input, Button, ImagePreview } from 'react-vant';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getMessage, addMessage } from '../../api/index';
import './liao.css'

// 定义消息类型
interface Message {
    sender: string,
    content: string,
    timestamp: number,
    receiverId: string,
    type: string,
    messageType: string
}

function App() {
    const location = useLocation();
    const jie = location.state.data
    const navigate = useNavigate();

    const [text, setText] = useState<string>('');  // 消息内容
    const [msg, setMsg] = useState<Message[]>([]); // 消息列表
    const ws = useRef<WebSocket | null>(null); // WebSocket 实例
    const messagesEndRef = useRef(null) as any; // 消息列表的最后一个元素

    const user = localStorage.getItem('user')
    let userId = ''
    let img = ''
    if (user) {
        userId = JSON.parse(user)._id;
        img = JSON.parse(user).img
    }

    // 获取消息
    const getMsg = async () => {
        const res = await getMessage()
        setMsg(res.data.data)
    }

    // 初始化
    useEffect(() => {
        // 获取消息列表
        getMsg()

        // 创建一个WebSocket对象
        ws.current = new WebSocket("ws://localhost:3000");  //  ws://为未加密，wss://为加密（需SSL）

        // 连接成功触发,进行身份认证
        ws.current.onopen = function () {
            console.log("WebSocket连接已打开", userId);
            ws.current?.send(JSON.stringify({
                type: 'auth',
                userId: userId
            }));
        }

        // 接收到消息触发
        ws.current.onmessage = function (event) {
            const data = JSON.parse(event.data);
            
            if (data.type === 'message') {
                setMsg((prev) => [...prev, data]);
                addMessage(data)
            }
        }

        // 添加心跳检测
        const interval = setInterval(() => {
            if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ type: 'ping' }));
            }
        }, 25000); // 25秒一次心跳

        return () => {
            // 清除定时器
            clearInterval(interval);
            // 关闭连接
            ws.current?.close();
        }
    }, [])


    // 添加图片上传处理逻辑
    const handleImageUpload = async (file: File) => {
        if (!file) return;

        // 验证图片类型和大小（2MB限制）
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!validTypes.includes(file.type)) {
            alert('仅支持 JPG/PNG/GIF 格式');
            return;
        }

        if (file.size > maxSize) {
            alert('图片大小不能超过2MB');
            return;
        }

        try {
            // 转换为Base64
            const reader = new FileReader();
            // FileReader() 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。
            reader.onload = () => {
                const base64Data = reader.result as string;

                // 发送消息
                ws.current?.send(JSON.stringify({
                    type: 'message',
                    receiverId: jie._id,
                    senderID: userId,
                    text: base64Data,
                    messageType: 'image'
                }));
                
            };
            reader.readAsDataURL(file);
            //将读取到的文件编码成DataURL ，可以将资料(例如图片、excel文件)内嵌在网页之中，不用放到外部文件
        } catch (error) {
            alert('图片上传失败');
        }
    };

    // 自动滚动到底部   发送消息时会自动滚动到底部，会显示最后的消息
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [msg]);

    // 发送消息
    const sendMsg = () => {
        if (text.trim()) {
            ws.current?.send(JSON.stringify({
                type: 'message',
                receiverId: jie._id,
                senderID: userId,
                text: text
            }));
            setText("");
        }
    }

    // 图片预览
    const setYu = (img:string)=>{
        const images = []
        images.push(img)
        ImagePreview.open({ images })
    }


    return (
        <div>
            <NavBar title={jie.username} leftText={''} onClickLeft={() => { navigate(-1) }} />
            <div className="chat-container">
                <div className="messages">
                    {msg.map((item, index) => (
                        <div key={index}>
                            {((item.receiverId === userId || item.receiverId === jie._id) &&
                                (item.sender === userId || item.sender === jie._id)) &&
                                <div
                                    className={`message ${item.sender === userId ? 'sent' : 'received'}`}
                                >
                                    <div className="avatar">
                                        <img
                                            src={item.sender === userId ? img : jie.img}
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="message-body">
                                        {item.messageType === 'image' ? (
                                            <div className="image-bubble">
                                                <img
                                                    src={item.content}
                                                    alt="发送的图片"
                                                    width={150}
                                                    onClick={()=>setYu(item.content)}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-bubble">
                                                <div className="content">{item.content}</div>
                                            </div>
                                        )}
                                    </div> 
                                </div>
                            }
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="ipt">
                    <label className="image-upload-btn">
                        <input
                            type="file"
                            accept="image/*" // accept允许上传图片的类型
                            hidden
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleImageUpload(e.target.files[0]);
                                }
                            }}
                        />
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
                        </svg>
                    </label>
                    <Input placeholder="输入内容" onChange={e => { setText(e) }} value={text}
                        suffix={<Button size="small" type="primary" onClick={() => { sendMsg() }}>发送</Button>} 
                        onKeyDown={e => { if (e.key === 'Enter') { sendMsg() } }}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;