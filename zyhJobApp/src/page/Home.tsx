import React from 'react';
import "../style/global.less"
import {Outlet} from "react-router-dom"
import TabBar from '../components/TabBar';
function Home() {
  return (
    <div className="Home">
        <Outlet/>
        <TabBar/>
    </div>
  );
}

export default Home;