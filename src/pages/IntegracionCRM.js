import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://behaviour-cute-tribute-rarely.trycloudflare.com', {
  transports: ['polling', 'websocket'], // clave para compatibilidad
});

const IntegracionCRM = () => {
  const [estado, setEstado] = useState("desconectado");
  const [qr, setQR] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    socket.on('qr', (qrData) => {
      setQR(qrData);
      setEstado("esperando");
    });

    socket.on('estado', (nuevoEstado) => {
      setEstado(nuevoEstado);
      if (nuevoEstado === 'autenticado') setQR(null);
    });

    return () => {
      socket.off('qr');
      socket.off('estado');
    };
  }, []);

  const desconectar = () => {
    socket.emit('cerrar_sesion');
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Vincula tu dispositivo con WhatsApp</h2>
      {estado === 'autenticado' && <p>✅ Dispositivo conectado</p>}
      {estado === 'esperando' && qr && (
        <div>
          <img src={qr} alt="Código QR" style={{ width: 300 }} />
          <p>Escanea este código con tu app de WhatsApp</p>
        </div>
      )}
      {estado === 'desconectado' && <p>🔌 No conectado</p>}
      {estado === 'autenticado' && (
        <button onClick={desconectar}>Desconectar</button>
      )}
    </div>
  );
};

export default IntegracionCRM;
