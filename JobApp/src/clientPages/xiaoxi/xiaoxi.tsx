import { useState,useEffect } from 'react';
import { getUser } from '../../api';
import { Loading, NavBar } from 'react-vant';
import { useNavigate } from 'react-router-dom';
import VirtualScroll from '../../utils/VirtualScroll'

// 定义接口描述数据项的完整结构
interface CompanyItem {
  _id:string,
  username: string,
  [propname:string]:any
}

// 使用示例
const App = () => {
  const navigate = useNavigate();
  const [data,setData] = useState<CompanyItem[]>([]);  // 数据
  const [page,setPage] = useState(1)  // 页码
  const [isLoading, setIsLoading] = useState(false); // 是否正在加载
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据

  // 获取数据
  const getData = async ()=>{
    if(isLoading || !hasMore) return;
    setIsLoading(true);

    try{
      let params = {
        page:page,
        pageSize:6
      }      
      const res = await getUser(params);
      console.log(res.data);
      
      if(res.data.data.length === 0){
        setHasMore(false); // 没有更多数据了
      }else{
        await new Promise(resolve => setTimeout(resolve, 1500));

        setData(prev => [...prev, ...res.data.data]);
        setPage(prev => prev + 1);
      } 
    } catch (error){
      Promise.reject(error);
    } finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <NavBar title="消息列表" leftArrow={''} />
      {data.length > 0 &&
      <VirtualScroll
        itemCount={data.length} // 总项数
        itemHeight={100} // 每一项的高度
        containerHeight={560} // 容器可视高度
        offset={10} // 距离容器顶部和底部的偏移量
        onLoadMore={getData} // 加载更多数据
        renderItem={(index) => ( // 渲染每一项
          <div style={{
            height: 100,
            padding: 10,
            boxSizing: 'border-box',
          }} onClick={()=>{navigate(`/clientLiao`,{state:{data:data[index]}})}}>
            {data[index].username}
          </div>
        )}
      />}
      {isLoading && 
      <div style={{display:'flex', justifyContent:'center', alignItems:'center',color:'gray'}}>
        <Loading type="spinner" size="1.5rem" />&nbsp;
        <small >加载中</small>
      </div>
      }
        
    </div>
  );
};

export default App;