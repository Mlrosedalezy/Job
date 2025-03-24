// src/router/PrivateRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../untils/api'; // 假设你有一个 API 实例
import { Alert, Flex, Spin, Switch } from 'antd';
const PrivateRoute: React.FC = () => {
  const { isAuthenticated, accessToken, refreshAccessToken,logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (accessToken) {
        console.log('Checking token validity...');
        try {
          const response = await loginApi.post('/verify-token', {
            accessToken: accessToken,
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log('Token validation response:', response);
          if (response.status === 200) {
            const isAuthenticated = response.data.user.isAuthenticated;
            setIsLoading(false); // 设置加载状态为 false
            if (isAuthenticated) {
              console.log('Token is valid, user is authenticated.');
            } else {
              console.log('User is not authenticated according to the backend.');
              logout();
            }
          } else {
            console.log('Token is invalid, refreshing...');
            await refreshAccessToken();
          }
        } catch (error) {
          console.error('Token validation failed', error);
          await refreshAccessToken();
        }
      } else {
        console.log('User is not authenticated or no access token found.');
        setIsLoading(false); // 设置加载状态为 false
      }
    };

    if (!authLoading) {
      checkTokenValidity();
    }

    return () => {
      // 清理函数
    };
  }, [isAuthenticated, accessToken, refreshAccessToken, authLoading, navigate]);

  // 如果 isLoading 或 authLoading 为 true，显示加载界面
  if (isLoading || authLoading) {
    return <div >
        <Spin>
        <Outlet />
      </Spin>
    </div>;
  }

  // 如果用户已认证，渲染受保护的路由
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;