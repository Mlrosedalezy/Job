import React, { lazy, useEffect,useState } from 'react'
import { Navigate, redirect } from 'react-router-dom'
import { verifyToken } from '../api/api'
import {Base64} from 'js-base64'
import Index from '../pages/index'
import Layout from '../pages/Layout/Layout'
const LcdScreen = lazy(() => import('../pages/Property/LcdScreen/LcdScreen'))
const WorkTable = lazy(() => import('../pages/Property/Worktable'))
const ScreenSet = lazy(() => import('../pages/Property/ScreenSet'))

const HouseMange = lazy(() => import('../pages/Smart_Property/House/HouseMange'))

const User = lazy(() => import('../pages/UserMange/User'))
const Role = lazy(() => import('../pages/UserMange/Role'))

const Login = lazy(() => import('../pages/Login/Login'))

// 路由守卫
export const Auth =  ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('refreshToken') || '';
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态
  const [isVerify, setIsVerify] = useState(false);  // 添加验证状态
  const [isStatus, setIsStatus] = useState(false);  // 添加启用状态

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyToken({ token });
        let str = Base64.encode(JSON.stringify(res.data))  //str-json-base64
        localStorage.setItem("loginmsg",str)
        setIsVerify(res.data.states); // 更新验证状态
        setIsStatus(res.data.status); // 更新启用状态
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsVerify(false); // 验证失败，设置为 false
      } finally {
        setIsLoading(false); // 无论成功与否，加载完成
      }
    };

    verify(); // 调用验证函数
  }, [token]); // 依赖 token，如果 token 变化会重新验证

  if (isLoading) {
    return <div>Loading...</div>; // 加载中显示加载状态
  }

  if (isVerify && isStatus) {
    return children; // 验证通过，渲染子组件
  } else {
    return <Navigate to="/login" replace />; // 验证失败，跳转到登录页
  }
}

const routes = [
  {
    path: "/login", element: <Login />, meta: { title: "登录" }
  },
  {
    path: "/", redirect: "/layout", element: <Auth><Layout /></Auth>, meta: { title: "父页面" },
    children: [
      {
        path: "", element: <WorkTable />, meta: { title: "首页" },
      },
     
      {
        path: "worktable", element: <WorkTable />, meta: { title: "工作台" },
      },
      {
        path: "screenset", element: <ScreenSet />, meta: { title: "大屏设置" },
      },
      {
        path: "housemange", element: <HouseMange />, meta: { title: "房屋管理" },
      },
      {
        path: "role", element: <Role />, meta: { title: "角色管理" },
      },
      {
        path: "user", element: <User />, meta: { title: "用户管理" },
      }
    ]

  },
  {
    path: "lcdscreen", element: <LcdScreen />, meta: { title: "可视化大屏" },
  },
]

export default routes

