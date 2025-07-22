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
            <h2>WhatsApp CRM Pro</h2>
            <p>Configuración y Gestión</p>
          </div>
        </div>
        <div className="buttons">
          <button className="btn btn-secondary">Exportar Config</button>
          <button className="btn btn-primary">Guardar Cambios</button>
        </div>
      </div>

      <div className="nav-tabs">
        <Link to="/general" className="tab"><FaCog /> General</Link>
        <Link to="/integracion-crm" className="tab"><FaLink /> Integración CRM</Link>
        <div className="tab"><FaRobot /> Inteligencia Artificial</div>
        <div className="tab"><FaBolt /> Automatización</div>
        <div className="tab"><FaFileAlt /> Plantillas</div>
        <div className="tab"><FaClock /> Programación</div>
        <div className="tab"><FaSave /> Res</div>
      </div>
    </div>
  );
};

export default Header;
