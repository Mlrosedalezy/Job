import {lazy} from 'react'
import Index from '../pages/index'
import Layout from '../pages/Layout/Layout'
const LcdScreen = lazy(() => import('../pages/Property/LcdScreen'))
const WorkTable = lazy(() => import('../pages/Property/Worktable'))
const ScreenSet = lazy(() => import('../pages/Property/ScreenSet'))

const HouseMange = lazy(() => import('../pages/Smart_Property/House/HouseMange'))

const routes = [
  {
    path: "/", element: <Index />, meta: { title: "首页" },
  },
  {
    path: "/layout", element: <Layout />, meta: { title: "父页面" },
    children:[
      {
        path: "lcdscreen", element: <LcdScreen />, meta: { title: "可视化大屏" },
      },
      {
        path: "worktable", element: <WorkTable />, meta: { title: "工作台" },
      },
      {
        path: "screenset", element: <ScreenSet />, meta: { title: "大屏设置" },
      },

      {
        path: "housemange", element: <HouseMange />, meta: { title: "房屋管理" },
      }
    ]

  }
]

export default routes