import { lazy } from "react"
import { Navigate } from "react-router-dom"

const ClientLogin = lazy(() => import('../clientPages/login/login'))
const ClientIndex = lazy(() => import('../clientPages/index/index'))
const ClientHome = lazy(() => import('../clientPages/Home/home'))
const ClientFuwu = lazy(() => import('../clientPages/fuwu/fuwu'))
const ClientMain = lazy(() => import('../clientPages/main/main'))
const ClientSetting = lazy(() => import('../clientPages/setting/setting'))
const ClientChange = lazy(() => import('../clientPages/changeTel/changeTel'))
const ClientDel = lazy(() => import('../clientPages/delTel/delTel'))
const Gao = lazy(() => import('../clientPages/gao/gao'))
const WithAuth = lazy(() => import('../utils/withAuth'))
const Xiaoxi = lazy(() => import('../clientPages/xiaoxi/xiaoxi'))
const Liao = lazy(() => import('../clientPages/liao/liao'))
const Jifen = lazy(() => import('../clientPages/jifen/jifen'))
const Voucher = lazy(() => import('../clientPages/voucher/voucher'))
const TelRecharge = lazy(() => import('../clientPages/telRecharge/index'))

const router = [
    { path:'/clientLogin',element: <ClientLogin /> },
    { 
        path:'/clientIndex',
        element: <WithAuth><ClientIndex /></WithAuth>,
        children:[
            { path:'home',element: <ClientHome/> },
            { path:'fuwu',element: <ClientFuwu/> },
            { path:'xiaoxi',element:<Xiaoxi/>},
            { path:'main',element: <ClientMain/> },
            { path:'gao',element: <Gao/> },
            { path:'',element: <Navigate to='/clientIndex/home' replace /> },
        ]
    },
    { path:'/clientLiao',element: <Liao /> },
    { path:'/clientSetting',element: <ClientSetting /> },
    { path:'/clientchange',element: <ClientChange /> },
    { path:'/clientdel',element: <ClientDel /> },
    { path:'/clientji',element: <Jifen /> },
    { path:'/clientVoucher',element: <Voucher /> },
    { path:'/clientTel',element: <TelRecharge /> },
    { path:'/',element: <Navigate to='/clientIndex' replace/> }, //默认路由
]

export default router