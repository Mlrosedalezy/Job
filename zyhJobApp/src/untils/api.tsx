// src/utils/api.tsx
import axios from 'axios';
import { getAuthData, setAuthData } from '../untils/authUtils';

// 创建一个 Axios 实例
const createApiInstance = (baseURL: string) => {
  const api = axios.create({
    baseURL: baseURL,
  });

  // 请求拦截器
  api.interceptors.request.use((config) => {
    const authData = getAuthData();
    if (authData && authData.accessToken) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }
    return config;
  }, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  });

  // 响应拦截器
  api.interceptors.response.use((response) => {
    return response;
  }, async (error) => {
    const originalRequest = error.config;

    // 检查 error.response 是否存在
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data);

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const authData = getAuthData();
          if (authData && authData.refreshToken) {
            const response = await axios.post('http://localhost:3000/login/refresh-token', { refreshToken: authData.refreshToken });
            const data = response.data;
            if (response.status === 200) {
              const newAccessToken = data.accessToken;
              setAuthData({ accessToken: newAccessToken, refreshToken: authData.refreshToken,expiresAt:data.expiresAt });
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            } else {
              console.error('Failed to refresh token');
              // 重定向到登录页面
              window.location.href = '/login';
            }
          }
        } catch (refreshError) {
          console.error('Error refreshing token', refreshError);
          // 重定向到登录页面
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('No response received:', error.request);
    } else {
      // 一些设置请求时发生错误
      console.error('Error setting request:', error.message);
    }

    return Promise.reject(error);
  });

  return api;
};

// 默认的 Axios 实例


// 其他 Axios 实例
const loginApi = createApiInstance('http://localhost:3000/login/');
const serviceApi = createApiInstance('http://localhost:3000/routing/');
const EpassApi = createApiInstance('http://localhost:3000/qrCode/');

export { createApiInstance, loginApi,serviceApi,EpassApi };