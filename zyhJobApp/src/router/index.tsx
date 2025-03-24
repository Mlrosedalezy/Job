// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import LoginIndex from "../Login/LoginIndex";
import VerificationCodeAuthentication from "../Login/VerificationCodeAuthentication";
import Home from "../page/Home";
import PrivateRoute from "./PrivateRoute";
import HomePage from "../components/HomePage";
import MyPage from "../components/MyPage";
import ServicePage from "../components/ServicePage";
import PersinalInformation from "../components/PersonalInformationPage";
import SetUserName from "../components/SetUserName";
import Settings from "../components/Settings"
import Epass from "../components/EpassPage"
import EpassManagement from "../components/EpassManagement"
import EQInfo from "../components/Child/EQinfo";
// 定义一个处理返回用户点击的回调函数
const handleReturnUserClick = (phoneNumber: string) => {
  console.log("Return to user clicked with phone number:", phoneNumber);
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/home",
        element: <Home />,
        children:[
          {
            path:"/home/homepage",
            element:<HomePage/> // 首页
          },
          {
            path:"/home/mypage",
            element:<MyPage/>, // 个人中心
          },
          {
            path:"/home/servicepage",
            element:<ServicePage/> // 服务中心

          }
        ]
      }, 
      {
        path: "/personalInformation",
        element: <PersinalInformation />, //个人信息页面
      },{
        path:"/setusername",
        element:<SetUserName/> // 设置用户名页面
      },{
        path:"/settings",
        element:<Settings/>
      },{
        path:"/epass",
        element:<Epass/>
      },{
        path:"/epassmanagement",
        element:<EpassManagement/>
      },{
        path:"/eqinfo",
        element:<EQInfo/>
      }
    ],
  }, 
  {
    path: "login",
    element: <LoginIndex />, // 登录页面
  },
  {
    path: "verificationCodeAuthentication",
    element: (
      <VerificationCodeAuthentication onReturnUserClick={handleReturnUserClick} />  // 验证码登录页面
    ),
  },
 
]);

export default router;