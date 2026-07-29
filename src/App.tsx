import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CRMPage from './pages/CRMPage/CRMPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CRMPage />} />
      <Route path="/crm" element={<CRMPage />} />
    </Routes>
  );
};

export default App;
