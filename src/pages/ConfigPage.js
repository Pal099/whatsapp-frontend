import React, { useState } from 'react';
import '../styles/ConfigPage.css';

const ConfigPage = () => {
  const [isKanbanEnabled, setKanbanEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <div className="config-page">
      <h1>Configuración General</h1>

      <section className="section">
        <h2>Interfaz de Usuario</h2>

        <div className="setting">
          <label>Tema:</label>
          <select>
            <option value="dark">Oscuro</option>
            <option value="light">Claro</option>
          </select>
        </div>

        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={isKanbanEnabled}
            onChange={() => setKanbanEnabled(!isKanbanEnabled)}
          />
          Habilitar vista Kanban
        </label>

        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={compactMode}
            onChange={() => setCompactMode(!compactMode)}
          />
          Modo compacto
        </label>
      </section>

      <section className="section">
        <h2>Notificaciones</h2>

        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          Habilitar notificaciones
        </label>

        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          Sonidos de notificación
        </label>
      </section>

      <section className="section">
        <h2>Privacidad</h2>

        <label className="custom-checkbox">
          <input type="checkbox" />
          Respaldo automático de conversaciones
        </label>

        <label className="custom-checkbox">
          <input type="checkbox" />
          Cifrar datos locales
        </label>
      </section>
    </div>
  );
};

export default ConfigPage;
