import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/IntegracionCRM.css';
import '../styles/Pipeline.css';
import '../components/Footer.css';

const socket = io('https://remind-daniel-reaction-basics.trycloudflare.com', {
  transports: ['websocket'],
  secure: true
});

const respuestasRapidas = [
  "Hola, ¿cómo podemos ayudarte hoy?",
  "Gracias por tu mensaje, te responderemos en breve.",
  "Recibimos tu consulta y ya la estamos procesando."
];

const IntegracionCRM = () => {
  const [estado, setEstado] = useState("desconectado");
  const [mensajes, setMensajes] = useState({
    nuevos: [],
    enProceso: [],
    atendidos: []
  });

  useEffect(() => {
    socket.on('estado', setEstado);
    socket.on('nuevo_mensaje', (msg) => {
      msg.nota = "";
      msg.etiquetas = [];
      setMensajes((prev) => ({
        ...prev,
        nuevos: [...prev.nuevos, msg]
      }));
    });
    return () => {
      socket.off('estado');
      socket.off('nuevo_mensaje');
    };
  }, []);

  const moverMensaje = (id, origen, destino) => {
    const item = mensajes[origen].find(m => m.id === id);
    setMensajes(prev => ({
      ...prev,
      [origen]: prev[origen].filter(m => m.id !== id),
      [destino]: [...prev[destino], item]
    }));
  };

  const actualizarNota = (id, key, texto) => {
    setMensajes(prev => ({
      ...prev,
      [key]: prev[key].map(m => m.id === id ? { ...m, nota: texto } : m)
    }));
  };

  const agregarEtiqueta = (id, key, etiqueta) => {
    setMensajes(prev => ({
      ...prev,
      [key]: prev[key].map(m =>
        m.id === id && !m.etiquetas.includes(etiqueta)
          ? { ...m, etiquetas: [...m.etiquetas, etiqueta] }
          : m
      )
    }));
  };

  const enviarRespuesta = (numero, texto) => {
    socket.emit('enviar_mensaje', { numero, texto });
  };

  const renderColumna = (titulo, key) => (
    <div className="columna" key={key}>
      <h3>{titulo}</h3>
      {mensajes[key].map((msg) => (
        <div className="tarjeta" key={msg.id}>
          <strong>{msg.nombre}</strong>
          <p>{msg.mensaje}</p>
          <small>{msg.numero}</small>

          <div className="etiquetas">
            {msg.etiquetas.map((et, i) => <span className="tag" key={i}>{et}</span>)}
            <input
              type="text"
              placeholder="Añadir etiqueta"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  agregarEtiqueta(msg.id, key, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>

          <textarea
            placeholder="Nota interna"
            value={msg.nota}
            onChange={(e) => actualizarNota(msg.id, key, e.target.value)}
          />

          <div className="respuestas-rapidas">
            {respuestasRapidas.map((r, i) => (
              <button key={i} onClick={() => enviarRespuesta(msg.numero, r)}>{r}</button>
            ))}
          </div>

          <div className="acciones">
            {key !== 'atendidos' && (
              <button onClick={() => moverMensaje(msg.id, key, 'atendidos')}>✅ Atendido</button>
            )}
            {key === 'nuevos' && (
              <button onClick={() => moverMensaje(msg.id, 'nuevos', 'enProceso')}>➡ En Proceso</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="crm-container">
      <div className="crm-header">
        <h2><i className="fab fa-whatsapp"></i> CRM WhatsApp - Prototipo estilo Organize-C</h2>
      </div>
      <div className="pipeline-container-modern">
        {renderColumna("🆕 Nuevo", "nuevos")}
        {renderColumna("⏳ En Proceso", "enProceso")}
        {renderColumna("✅ Atendidos", "atendidos")}
      </div>
    </div>
  );
};

export default IntegracionCRM;
