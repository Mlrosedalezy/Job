// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthData, setAuthData, removeAuthData } from '../untils/authUtils'; // 确保路径正确
import { loginApi } from '../untils/api';
import { Toast } from 'antd-mobile';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (accessToken: string, refreshToken: string, expiresAt: number) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  isLoading: boolean; // 添加加载状态
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  login: () => {},
  logout: () => {},
  refreshAccessToken: async () => {},
  isLoading: true, // 初始加载状态为 true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态

  useEffect(() => {
    // 从 local storage 中读取登录状态
    const authData = getAuthData();
    if (authData) {
      setAccessToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);
      checkTokenValidity(authData.accessToken);
    } else {
      setIsLoading(false); // 如果没有认证数据，直接设置为加载完成
    }
  }, []);

  const checkTokenValidity = async (token: string) => {
    try {
      console.log('Checking token validity...');
      const response = await loginApi.post('/verify-token', {
        accessToken: token,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const isAuthenticated = response.data.user.isAuthenticated;
        setIsAuthenticated(isAuthenticated);
      } else {
        console.log('Token is invalid, refreshing...');
        await refreshAccessToken();
      }
    } catch (error) {
      console.error('Token validation failed', error);
      await refreshAccessToken();
    } finally {
      setIsLoading(false); // 认证检查完成后设置加载状态为 false
    }
  };

  const login = (accessToken: string, refreshToken: string, expiresAt: number) => {
    setIsAuthenticated(true);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setAuthData({ accessToken, refreshToken, expiresAt });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoading(false)
    removeAuthData();
    console.log('用户注销');
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      setIsAuthenticated(false);
      console.error('没有可用的刷新令牌');
      logout();
      return;
    }

    try {
      console.log('试图刷新访问令牌…');
      const response = await loginApi.post('/refresh-token', { refreshToken });
      const data = response.data;
      if (response.status === 200) {
        const newAccessToken = data.accessToken;
        const newExpiresAt = Date.now() + data.expiresIn * 1000; // 假设后端返回 expiresIn（秒）
        setAccessToken(newAccessToken);
        setAuthData({ accessToken: newAccessToken, refreshToken, expiresAt: newExpiresAt });
        setIsAuthenticated(true);
        console.log('访问令牌刷新成功:', newAccessToken);
      } else {
        console.error('刷新访问令牌失败。处理步骤:', response);
        showReLoginPrompt(); // 显示重新登录提示
      }
    } catch (error) {
      console.error('刷新访问令牌错误', error);
      logout();
    } finally {
      setIsLoading(false); // 刷新完成后设置加载状态为 false
    }
  };


  const showReLoginPrompt = () => {
    let toastClosed = false; // 标志变量，防止重复注销
  
    Toast.show({
      content: '您的会话已过期，请重新登录。',
      duration: 5000, // 显示时长为 5 秒
      afterClose: () => { // 使用 afterClose 替代 onClose
        if (!toastClosed) {
          toastClosed = true;
          logout(); // 用户关闭提示后注销
        }
      },
    });
  
    // 防止用户手动关闭 Toast 后重复执行注销逻辑
    setTimeout(() => {
      toastClosed = true;
    }, 5000); // 与 Toast 显示时长一致
  };


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (accessToken) {
        const authData = getAuthData();
        if (authData && authData.expiresAt <= Date.now()) {
          console.log('令牌过期，正在刷新…');
          refreshAccessToken();
        }
      }
    }, 60000); // 每分钟检查一次

    return () => clearInterval(intervalId);
  }, [accessToken, refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, refreshToken, login, logout, refreshAccessToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};