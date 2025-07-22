import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/IntegracionCRM.css';
import '../styles/Pipeline.css';

const socket = io('https://objects-tiger-beverages-anaheim.trycloudflare.com', {
  transports: ['websocket'],
  secure: true
});



const IntegracionCRM = () => {
  const [estado, setEstado] = useState("desconectado");
  const [qr, setQR] = useState(null);
  const [mensajes, setMensajes] = useState({
    nuevos: [],
    enProceso: [],
    atendidos: []
  });

  useEffect(() => {
    socket.on('qr', (qrData) => {
      setQR(qrData);
      setEstado("esperando");
    });

    socket.on('estado', (nuevoEstado) => {
      setEstado(nuevoEstado);
      if (nuevoEstado === 'autenticado') setQR(null);
    });

    socket.on('nuevo_mensaje', (msg) => {
      setMensajes((prev) => ({
        ...prev,
        nuevos: [...prev.nuevos, msg]
      }));
    });

    return () => {
      socket.off('qr');
      socket.off('estado');
      socket.off('nuevo_mensaje');
    };
  }, []);

  const abrirWhatsappWeb = () => {
    window.open('https://web.whatsapp.com', '_blank');
  };

  const moverMensaje = (id, origen, destino) => {
    const item = mensajes[origen].find(m => m.id === id);
    setMensajes(prev => ({
      ...prev,
      [origen]: prev[origen].filter(m => m.id !== id),
      [destino]: [...prev[destino], item]
    }));
  };

  const renderColumna = (titulo, key) => (
    <div className="columna" key={key}>
      <h3>{titulo}</h3>
      {mensajes[key].map((msg) => (
        <div className="tarjeta" key={msg.id}>
          <strong>{msg.nombre}</strong>
          <p>{msg.mensaje}</p>
          <small>{msg.numero}</small>
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
    <div className="integracion-crm">
      <h1>Integración con WhatsApp Business</h1>

      {estado === 'esperando' && qr && (
        <div className="qr-container">
          <img src={qr} alt="Código QR" />
          <p>Escanea este código QR con tu app de WhatsApp Business</p>
        </div>
      )}

      {estado === 'autenticado' && (
        <>
          <p style={{ color: "green", fontWeight: "bold" }}>
            ✅ ¡Dispositivo conectado exitosamente!
          </p>
          <button className="btn-conectar" onClick={abrirWhatsappWeb}>
            Abrir WhatsApp Web
          </button>
          <div className="pipeline-container">
            {renderColumna("Nuevo", "nuevos")}
            {renderColumna("En Proceso", "enProceso")}
            {renderColumna("Atendidos", "atendidos")}
          </div>
        </>
      )}

      {estado === 'generando' && <p>⏳ Generando código QR...</p>}
      {estado === 'desconectado' && <p>🔌 No conectado</p>}
    </div>
  );
};

export default IntegracionCRM;
