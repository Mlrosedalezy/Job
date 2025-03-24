import {useEffect, useState} from 'react';
import {
  getUserList,
} from '../api/api'
//箭头函数形式
const Index = () => {
  const [name, setName] = useState('')
  useEffect(() => {
    getData()
  },[])
  const getData = async ()=>{
    const res = await getUserList()
    console.log(res);
    
  }
  return (
    <>
      <div>
        {/* JSX 内容 */}
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </>
  )
}

export default Index;