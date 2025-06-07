const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:9090/ws/');

ws.onopen = () => {
  console.log('Conectado ao WebSocket!');

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
      latitude: -23.545647734168224,
      longitude: -46.47570980164753
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