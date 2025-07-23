import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/IntegracionCRM.css';
import '../styles/Pipeline.css';
import successSound from '../assets/exito_song.mp3';
import '../components/Footer.css';

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  secure: true
});

const IntegracionCRM = () => {
  const [estado, setEstado] = useState("desconectado");
  const [qr, setQR] = useState(null);
  const [animacionExito, setAnimacionExito] = useState(false);
  const [animacionCierre, setAnimacionCierre] = useState(false);
  const audioRef = useRef(null);
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
      if (nuevoEstado === 'autenticado') {
        setEstado(nuevoEstado);
        setQR(null);
        if (audioRef.current) {
          audioRef.current.play();
        }
        setAnimacionExito(true);
        setTimeout(() => setAnimacionExito(false), 3000);
      } else if (nuevoEstado === 'desconectado') {
        setAnimacionCierre(true);
        setTimeout(() => {
          setMensajes({ nuevos: [], enProceso: [], atendidos: [] });
          setAnimacionCierre(false);
          setEstado(nuevoEstado);
        }, 1000);
      } else {
        setEstado(nuevoEstado);
      }
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

  const desconectar = () => {
    socket.emit('cerrar_sesion');
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
    <div className={`columna ${animacionCierre ? 'fade-out' : ''}`} key={key}>
      <h3>{titulo}</h3>
      {mensajes[key].map((msg) => (
        <div className={`tarjeta ${animacionCierre ? 'fade-out-card' : ''}`} key={msg.id}>
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
    <div className="crm-container">
      <audio ref={audioRef} src={successSound} preload="auto" />

      <div className="crm-header">
        <h2><i className="fab fa-whatsapp"></i> Vincula tu dispositivo con WhatsApp Business</h2>
      </div>

      {estado === 'autenticado' && (
        <div className="status-message success">
          <i className="fas fa-check-circle pulse"></i> ¡Dispositivo conectado exitosamente!
        </div>
      )}

      {estado === 'autenticado' && (
        <button className="disconnect-btn" onClick={desconectar}>
          <i className="fas fa-plug-circle-xmark"></i> Desconectar dispositivo
        </button>
      )}

      {estado === 'esperando' && qr && (
        <div className="estado-box esperando">
          <img className="qr-image" src={qr} alt="Código QR" />
          <p>📱 Escanea este código QR con tu app de WhatsApp Business</p>
        </div>
      )}

      {estado === 'generando' && (
        <div className="estado-box generando">
          <span className="loader"></span>
          <p>⏳ Generando código QR...</p>
        </div>
      )}

      {estado === 'desconectado' && (
        <div className="estado-box desconectado">
          <p>🔌 No conectado</p>
        </div>
      )}

      <div className="pipeline-container-modern">
        {renderColumna("🆕 Nuevo", "nuevos")}
        {renderColumna("⏳ En Proceso", "enProceso")}
        {renderColumna("✅ Atendidos", "atendidos")}
      </div>
    </div>
  );
};

export default IntegracionCRM;
