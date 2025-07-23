import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';
import { FaCog, FaLink, FaRobot, FaBolt, FaFileAlt, FaClock, FaSave } from 'react-icons/fa';

const Header = () => {
  return (
    <div className="header-container">
      <div className="header-top">
        <div className="logo">
          <img src="/logo.svg" alt="Logo" />
          <div>
            <h2>Gestión Profesional</h2>
            <p>Conecte con sus clientes de forma profesional</p>
          </div>
        </div>
        <div className="buttons">
          <button className="btn btn-secondary">Exportar Config</button>
          <button className="btn btn-primary">Guardar Cambios</button>
        </div>
      </div>

      <div className="nav-tabs">
        <Link to="/integracion-crm" className="tab"><FaLink />CRM</Link>
        <Link to="/" className="tab"><FaCog />Configuración</Link>
        
        
      </div>
    </div>
  );
};

export default Header;
