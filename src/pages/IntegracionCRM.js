import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/IntegracionCRM.css';
import '../styles/Pipeline.css';
import '../components/Footer.css';

const socket = io('https://remind-daniel-reaction-basics.trycloudflare.com', {
  transports: ['websocket']
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
    // Carga inicial desde backend
    fetch('http://localhost:3001/api/mensajes')
      .then(res => res.json())
      .then(data => setMensajes(data))
      .catch(console.error);

    socket.on('estado', setEstado);

    socket.on('nuevo_mensaje', (msg) => {
      setMensajes(prev => ({
        ...prev,
        nuevos: [...prev.nuevos, msg]
      }));
    });

    socket.on('actualizar_mensaje', (msg) => {
      setMensajes(prev => {
        // Remueve msg de cualquier estado actual
        let todos = [...prev.nuevos, ...prev.enProceso, ...prev.atendidos];
        todos = todos.filter(m => m.id !== msg.id);

        // Añade msg actualizado según su estado
        if (msg.estado === 'nuevo') {
          return { ...prev, nuevos: [...prev.nuevos, msg], enProceso: prev.enProceso, atendidos: prev.atendidos };
        } else if (msg.estado === 'enProceso') {
          return { ...prev, nuevos: prev.nuevos, enProceso: [...prev.enProceso, msg], atendidos: prev.atendidos };
        } else {
          return { ...prev, nuevos: prev.nuevos, enProceso: prev.enProceso, atendidos: [...prev.atendidos, msg] };
        }
      });
    });

    return () => {
      socket.off('estado');
      socket.off('nuevo_mensaje');
      socket.off('actualizar_mensaje');
    };
  }, []);

  const moverMensaje = (id, origen, destino) => {
    const item = mensajes[origen].find(m => m.id === id);
    if (!item) return;

    // Actualizar backend
    fetch(`http://localhost:3001/api/mensajes/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: destino })
    }).then(() => {
      // Actualización real se refleja via socket 'actualizar_mensaje'
    });
  };

  const actualizarNota = (id, key, texto) => {
    fetch(`http://localhost:3001/api/mensajes/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nota: texto })
    });
  };

  const agregarEtiqueta = (id, key, etiqueta) => {
    const msg = mensajes[key].find(m => m.id === id);
    if (!msg) return;

    const etiquetas = msg.etiquetas.includes(etiqueta)
      ? msg.etiquetas
      : [...msg.etiquetas, etiqueta];

    fetch(`http://localhost:3001/api/mensajes/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etiquetas })
    });
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
            {msg.etiquetas.map((et, i) => (
              <span className="tag" key={i}>{et}</span>
            ))}
            <input
              type="text"
              placeholder="Añadir etiqueta"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  agregarEtiqueta(msg.id, key, e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
          </div>

          <textarea
            placeholder="Nota interna"
            defaultValue={msg.nota}
            onBlur={(e) => actualizarNota(msg.id, key, e.target.value)}
          />

          <div className="respuestas-rapidas">
            {respuestasRapidas.map((r, i) => (
              <button key={i} onClick={() => enviarRespuesta(msg.numero, r)}>
                {r}
              </button>
            ))}
          </div>

          <div className="acciones">
            {key !== 'atendidos' && (
              <button onClick={() => moverMensaje(msg.id, key, 'atendidos')}>
                ✅ Atendido
              </button>
            )}
            {key === 'nuevos' && (
              <button onClick={() => moverMensaje(msg.id, 'nuevos', 'enProceso')}>
                ➡ En Proceso
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="crm-container">
      <div className="crm-header">
        <h2>
          <i className="fab fa-whatsapp"></i> CRM WhatsApp - Prototipo estilo Organize-C
        </h2>
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
