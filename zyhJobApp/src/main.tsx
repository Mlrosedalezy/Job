import { StrictMode, } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.tsx'
import { Toast } from 'antd-mobile'
import ErrorBoundary from '../src/untils/ErrorBoundaey.tsx';
import { AuthProvider } from './context/AuthContext.tsx'


// 全局错误捕获
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise rejection:', event.reason);
  Toast.show({ content: '发生了一个错误，请稍后再试', icon: 'fail' });
  if (process.env.NODE_ENV === 'production') {
    sendErrorToMonitoring(event.reason);
  }
  return true;
});

window.addEventListener('error', (event) => {
  console.error('Unhandled JavaScript error:', event.error);
  Toast.show({ content: '发生了一个错误，请稍后再试', icon: 'fail' });
  if (process.env.NODE_ENV === 'production') {
    sendErrorToMonitoring(event.error);
  }
  return true;
});

// 渲染应用
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>

    </ErrorBoundary>
 
  </StrictMode>,
)

// 错误发送到监控平台（示例函数）
function sendErrorToMonitoring(error: any) {
  console.log('Sending error to monitoring:', error);
  // 实际实现中替换为具体的错误监控服务
}
