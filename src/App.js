import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SupportPage from './Components/SupportPage';
import LoginPage from './Components/LoginPage';
import RegisterUser from './Components/RegisterUser';
import AdminPage from './Components/AdminPage';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SupportPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
