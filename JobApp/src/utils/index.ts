//兼容处理  
// 1rem =16px
function setHtml() {
    //获取设备宽度
    const deviceWidth = document.documentElement.offsetWidth;
    //给html标签设置fontSize，就是给rem赋值
    document.documentElement.style.fontSize = deviceWidth / 430 * 16 + 'px';
}
 
//监听窗口尺寸变化，实时调整
window.onresize = setHtml;
//页面初始加载时也要触发
setHtml();