import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './styles/App.css';
import IntegracionCRM from './pages/IntegracionCRM';
import ConfigPage from './pages/ConfigPage';
import Header from './components/Header'; // ✅ Importación correcta arriba

const App = () => {
  const [theme, setTheme] = useState('dark');

  return (
    <Router>
      <div className={`app ${theme}`}>

        <main className="main-content">
          {/* ✅ Componente Header correcto */}
          <Header />

          {/* 🔸 Secciones de configuración */}
          <Routes>
            <Route path="/" element={<ConfigPage />} />
              <Route path="/integracion-crm" element={<IntegracionCRM />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
