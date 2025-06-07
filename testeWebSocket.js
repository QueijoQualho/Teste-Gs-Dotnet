const WebSocket = require('ws');

/// Salve como test-ws.js e rode com: node test-ws.js

const ws = new WebSocket('ws://localhost:9090/ws/');

ws.onopen = () => {
  console.log('Conectado ao WebSocket!');

  // Exemplo de dados (ajuste os campos conforme seu SensorData)
  // ...existing code...
  // Exemplo de dados (ajuste os campos conforme seu SensorData)
  const sensorData = {
    sensor: {
      temperatura: 40.5,
      umidade: 60,
      pressao: 1013,
      vento: 5,
      chuva: 200,
      nivelAgua: 2.5,
      gases: 0.03,
      luminosidade: 800
      // "evento" pode ser omitido
    },
    localizacao: {
      latitude: -23.431982460171234,
      longitude: -46.48072882511031
    }
  };
  ws.send(JSON.stringify(sensorData));
};

ws.onmessage = (event) => {
  console.log('Resposta da IA:', event.data);
  ws.close();
};

ws.onerror = (err) => {
  console.error('Erro no WebSocket:', err);
};

ws.onclose = () => {
  console.log('Conexão encerrada.');
};