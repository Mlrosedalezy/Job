import React, { useState, useRef, useCallback } from 'react';

// 约束类型
interface VirtualScrollProps {
  itemCount: number;       // 总数据量
  itemHeight: number;      // 每项高度（固定高度）
  // React.ReactNode代表任何可以被渲染的React元素，包括字符串、数字、React元素、数组等
  // JSX.Element仅表示JSX元素（div），使用 React.ReactNode 更灵活
  renderItem: (index: number) => React.ReactNode;  // 用来渲染单个列表项，函数类型
  containerHeight: number; // 容器可视高度
  buffer?: number;         // 缓冲额外渲染的项目数
  onLoadMore?: () => void; // 分页回调
  offset?: number; // 滚动条小于这个值触发加载更多
}

// React.FC代表React Function Component，也就是函数组件
// 在TypeScript中，这用于定义函数组件的类型，确保组件接收正确的props类型
// 自动包含 children，类型检查明确
const VirtualScroll: React.FC<VirtualScrollProps> = ({
  // 接收的参数
  itemCount,  
  itemHeight,
  renderItem,
  containerHeight,
  buffer = 0,
  onLoadMore,
  offset = 100
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  // <HTMLDivElement>是泛型类型，对useRef进行约束，表示HTML的div元素
  // <HTMLInputElement> 则表示HTML的input元素
  const containerRef = useRef<HTMLDivElement>(null);
  // 容器总高度
  const totalHeight = itemHeight * itemCount;
  
  // 计算可见项目的起始和结束下标
  const startIndex = Math.max(
    0,  // 初始时使用的下标
    Math.floor(scrollTop / itemHeight) - buffer  // 多渲染前3个元素
  );
  const endIndex = Math.min(
    itemCount - 1,  // 滚到末尾时使用的下标
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer  // 多渲染后3个元素
  );

  // 可视窗口的内容
  const visibleItems = [];
  // 渲染可视窗口的内容
  for (let i = startIndex; i <= endIndex; i++) {
    
    visibleItems.push(
      <div key={i}
        style={{
          position: 'absolute',
          top: `${i * itemHeight}px`,
          width: '100%',
          lineHeight: `${itemHeight}px`
        }}
      >
        {renderItem(i)}
      </div>
    );
  }

  // 处理滚动事件,获取滚动条位置
  // e: React.UIEvent<HTMLDivElement> 定义事件参数类型为 <div> 元素的 UI 事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentTarget = e.currentTarget;  // 获取当前触发事件的元素
    const newScrollTop = currentTarget.scrollTop;  // 获取当前滚动条位置
    setScrollTop(newScrollTop);
    
    // 触发分页加载
    const scrollBottom = newScrollTop + containerHeight;  // 获取滚动条底部位置
    // currentTarget.scrollHeight 获取滚动条总高度
    if (currentTarget.scrollHeight - scrollBottom <= offset) {
      onLoadMore?.();  // 调用分页加载函数
    }
  }, [onLoadMore, offset]); 


  return (
    <div     
      ref={containerRef}
      style={{
        height: containerHeight,
        overflowY: 'auto',
        position: 'relative'
      }}
      onScroll={handleScroll}
    >                 {/* 可视窗口 */}
      <div style={{ height: totalHeight }}>  {/* 占位元素，用于撑开容器高度，显示滚动条 */}
        {visibleItems}   {/* 渲染可视区域内的元素 */}
      </div>
    </div>
  );
};


export default VirtualScroll;