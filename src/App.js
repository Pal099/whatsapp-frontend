import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import IntegracionCRM from './pages/IntegracionCRM';
import ConfigPage from './pages/ConfigPage';

function App() {
  return (
    <div className="app-container">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ConfigPage />} />
          <Route path="/integracion-crm" element={<IntegracionCRM />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
