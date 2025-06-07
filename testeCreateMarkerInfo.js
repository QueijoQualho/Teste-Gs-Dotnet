const amqp = require('amqplib');

async function sendMarker() {
  const queue = 'create-marker-info';

  const message = {
    MarkerInfo: {
      latitude: -23.5505,
      longitude: -46.6333,
      desasterType: 'tempestade',
      markerType: 'disaster',
      timestamp: new Date().toISOString(),
    },
  };

  try {
    const connection = await amqp.connect('amqp://rabbitmq-aci-watchtower.brazilsouth.azurecontainer.io');
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      contentType: 'application/json',
      persistent: true,
      headers: {
        messageType: [
          "urn:message:MlNetService.App.Dtos.Messaging:CreateMarkersRequest"
        ]
      }
    });

    console.log('Mensagem enviada com sucesso.');
    await channel.close();
    await connection.close();
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
  }
}

sendMarker();
