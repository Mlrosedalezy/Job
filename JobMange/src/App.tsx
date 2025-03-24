import React from 'react';
import './App.css'
import routes from './routers/index'
import { useRoutes } from 'react-router-dom';

const App: React.FC = () => {
  const element = useRoutes(routes)
  return (
    <React.Suspense fallback={<div>loading....</div>}>
      {element}
    </React.Suspense>
  );
};

export default App;
