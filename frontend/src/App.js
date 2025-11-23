import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeListPage from './components/EmployeeListPage';
import EmployeeFormPage from './components/EmployeeFormPage';
import EmployeeViewPage from './components/EmployeeViewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" />} />
        <Route path="/employees" element={<EmployeeListPage />} />
        <Route path="/employees/new" element={<EmployeeFormPage mode="create" />} />
        <Route path="/employees/:id/edit" element={<EmployeeFormPage mode="edit" />} />
        <Route path="/employees/:id" element={<EmployeeViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;