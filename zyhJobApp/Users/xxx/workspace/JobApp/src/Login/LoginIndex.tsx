import React, { useState } from 'react';
import Property from "./PropertyAPPLogin";
import "animate.css";

export default function LoginIndex() {
    const [showProperty, setShowProperty] = useState(false);

    const handleShowProperty = () => {
        setShowProperty(true);
    };

    return (
        <div>
            {/* 添加物业管理入口按钮 */}
            <button onClick={handleShowProperty} style={{ color: '#1890ff', marginTop: '20px' }}>物业管理入口</button>

            {showProperty && (
                <div className="animate__animated animate__slideInUp" style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 100, backgroundColor: '#fff', padding: '20px', boxShadow: '0 -4px 6px rgba(0,0,0,0.1)' }}>
                    <Property onClose={() => setShowProperty(false)} />
                </div>
            )}
        </div>
    );
}